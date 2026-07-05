'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';

interface InstantWin {
  id: string;
  prizeName: string;
  prizeValue: number;
  ticketNumber: number;
  competitionTitle: string;
  competitionSlug: string;
  revealedAt: string | null;
}

const SCRATCH_THRESHOLD = 0.5;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 200;

export default function InstantWinReveal() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<InstantWin[]>([]);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scratchingRef = useRef(false);
  const checkTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch('/api/account/instant-wins')
      .then((r) => r.json())
      .then((data) => {
        const unrevealed = (data.wins || []).filter((w: InstantWin) => !w.revealedAt);
        setQueue(unrevealed);
      })
      .catch(console.error);
  }, [user]);

  const current = queue[0];

  const drawOverlay = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#94A3B8');
    gradient.addColorStop(1, '#64748B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#0A0E1A';
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch to reveal ✨', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }, []);

  useEffect(() => {
    if (current && !revealed) {
      drawOverlay();
    }
  }, [current, revealed, drawOverlay]);

  const checkScratchedAmount = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { data } = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let transparent = 0;
    for (let i = 3; i < data.length; i += 4 * 8) {
      if (data[i] === 0) transparent++;
    }
    const total = data.length / (4 * 8);
    if (transparent / total > SCRATCH_THRESHOLD) {
      setRevealed(true);
    }
  }, []);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CANVAS_WIDTH;
    const y = ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (checkTimerRef.current === null) {
      checkTimerRef.current = window.setTimeout(() => {
        checkTimerRef.current = null;
        checkScratchedAmount();
      }, 120);
    }
  }, [checkScratchedAmount]);

  const handleNext = async () => {
    if (current) {
      try {
        await fetch(`/api/account/instant-wins/${current.id}/reveal`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to mark instant win as revealed:', error);
      }
    }
    setRevealed(false);
    setQueue((prev) => prev.slice(1));
  };

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center animate-fade-in-up">
        <p className="text-xs font-bold uppercase tracking-wider text-primary mb-1">⚡ Instant Win</p>
        <h2 className="text-xl font-black text-foreground mb-1">{current.competitionTitle}</h2>
        <p className="text-xs text-muted font-medium mb-5">
          Winning ticket #{String(current.ticketNumber).padStart(4, '0')}
        </p>

        {!revealed ? (
          <div className="relative mx-auto rounded-xl overflow-hidden border border-border" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, maxWidth: '100%' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-primary/10">
              <span className="text-2xl">🎁</span>
              <span className="text-sm font-bold text-foreground">{current.prizeName}</span>
            </div>
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="relative touch-none cursor-pointer w-full h-full"
              onPointerDown={(e) => {
                scratchingRef.current = true;
                scratchAt(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (scratchingRef.current) scratchAt(e.clientX, e.clientY);
              }}
              onPointerUp={() => {
                scratchingRef.current = false;
              }}
              onPointerLeave={() => {
                scratchingRef.current = false;
              }}
            />
          </div>
        ) : (
          <div className="rounded-xl border border-primary/30 bg-primary/10 py-8 px-4 animate-fade-in-up">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-black text-foreground mb-1">{current.prizeName}</p>
            <p className="text-sm text-muted font-semibold">
              Worth {formatPrice(current.prizeValue)}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {revealed ? (
            <>
              <Link
                href="/account/tickets"
                onClick={handleNext}
                className="w-full px-5 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105 text-sm"
              >
                View My Tickets
              </Link>
              <button
                onClick={handleNext}
                className="text-xs text-muted hover:text-foreground font-semibold transition-colors"
              >
                Dismiss
              </button>
            </>
          ) : (
            <p className="text-xs text-muted font-medium">Drag your finger or mouse across the card</p>
          )}
        </div>
      </div>
    </div>
  );
}
