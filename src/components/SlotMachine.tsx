'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type ReelSymbol = string;

const EMOJI_SYMBOLS: ReelSymbol[] = ['🍒', '🍋', '🔔', '⭐', '💎', '🍀'];
const LOGO: ReelSymbol = 'LOGO';

const CELL_HEIGHT = 88;
const CYCLES = 4;
const REEL_COUNT = 3;
const BASE_DURATION = 2200;
const STAGGER = 550;

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildStrip(target: ReelSymbol): ReelSymbol[] {
  const strip: ReelSymbol[] = [];
  for (let c = 0; c < CYCLES; c++) {
    strip.push(...shuffled([...EMOJI_SYMBOLS, LOGO]));
  }
  strip.push(target);
  return strip;
}

function pickLosingTargets(): ReelSymbol[] {
  const all = [...EMOJI_SYMBOLS, LOGO];
  const targets = Array.from({ length: REEL_COUNT }, () => all[Math.floor(Math.random() * all.length)]);
  if (targets.every((t) => t === LOGO)) {
    const forceIndex = Math.floor(Math.random() * REEL_COUNT);
    targets[forceIndex] = EMOJI_SYMBOLS[Math.floor(Math.random() * EMOJI_SYMBOLS.length)];
  }
  return targets;
}

function ReelCell({ value }: { value: ReelSymbol }) {
  return (
    <div className="w-full flex items-center justify-center" style={{ height: CELL_HEIGHT }}>
      {value === LOGO ? (
        <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain" />
      ) : (
        <span className="text-4xl">{value}</span>
      )}
    </div>
  );
}

interface SlotMachineProps {
  spinning: boolean;
  isWinner: boolean;
  onDone?: () => void;
}

export default function SlotMachine({ spinning, isWinner, onDone }: SlotMachineProps) {
  const [strips, setStrips] = useState<ReelSymbol[][] | null>(null);
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0]);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!spinning || startedRef.current) return;
    startedRef.current = true;

    const targets = isWinner ? [LOGO, LOGO, LOGO] : pickLosingTargets();
    const builtStrips = targets.map((t) => buildStrip(t));
    setStrips(builtStrips);
    setOffsets(builtStrips.map(() => 0));

    const raf = requestAnimationFrame(() => {
      setOffsets(builtStrips.map((strip) => -(strip.length - 1) * CELL_HEIGHT));
    });

    const totalDuration = BASE_DURATION + (REEL_COUNT - 1) * STAGGER + 300;
    const timer = setTimeout(() => onDone?.(), totalDuration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [spinning, isWinner, onDone]);

  const displayStrips = strips ?? Array.from({ length: REEL_COUNT }, () => [EMOJI_SYMBOLS[0]]);

  return (
    <div className="mx-auto bg-background border-4 border-border rounded-2xl p-4 shadow-xl" style={{ width: 300 }}>
      <div className="relative flex gap-2 bg-card rounded-xl border border-border" style={{ height: CELL_HEIGHT }}>
        {displayStrips.map((strip, i) => (
          <div key={i} className="flex-1 overflow-hidden rounded-lg" style={{ height: CELL_HEIGHT }}>
            <div
              style={{
                transform: `translateY(${offsets[i]}px)`,
                transitionProperty: 'transform',
                transitionDuration: `${BASE_DURATION + i * STAGGER}ms`,
                transitionTimingFunction: 'cubic-bezier(0.15, 0.7, 0.3, 1)',
              }}
            >
              {strip.map((s, j) => (
                <ReelCell key={j} value={s} />
              ))}
            </div>
          </div>
        ))}
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 h-0.5 bg-primary/70 pointer-events-none z-10" />
      </div>
    </div>
  );
}
