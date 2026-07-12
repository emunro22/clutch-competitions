'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';
import WheelSpin from '@/components/WheelSpin';

interface WheelGame {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  pricePerSpin: number;
  status: 'live' | 'won' | 'closed';
}

type SpinPhase = 'idle' | 'waiting-for-payment' | 'spinning' | 'result';

export default function WheelGamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [game, setGame] = useState<WheelGame | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState<SpinPhase>(() => (searchParams.get('spin') ? 'waiting-for-payment' : 'idle'));
  const [isWinner, setIsWinner] = useState(false);
  const [prizeName, setPrizeName] = useState<string | null>(null);
  const pollTimer = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/wheel-games/${slug}`)
      .then((r) => r.json())
      .then((data) => setGame(data.game || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const spinId = searchParams.get('spin');
    if (!spinId) return;

    router.replace(`/instawin/${slug}`, { scroll: false });
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(`/api/wheel/spins/${spinId}`);
        const data = await res.json();
        if (data.status && data.status !== 'pending') {
          if (!cancelled) {
            setIsWinner(!!data.isWinner);
            setPrizeName(data.prizeName ?? null);
            setPhase('spinning');
          }
          return;
        }
      } catch (err) {
        console.error('Failed to poll spin status:', err);
      }
      if (!cancelled) pollTimer.current = window.setTimeout(check, 1500);
    };

    check();

    return () => {
      cancelled = true;
      if (pollTimer.current) clearTimeout(pollTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpin = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    if (!game) return;

    setError('');
    setStarting(true);
    try {
      const res = await fetch('/api/wheel/spins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to start spin');
        setStarting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Something went wrong');
      setStarting(false);
    }
  };

  const handleSpinAgain = () => {
    setPhase('idle');
    setIsWinner(false);
    setPrizeName(null);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-4">🎡</p>
        <h1 className="text-xl font-bold text-foreground mb-2">Wheel Game Not Found</h1>
        <Link href="/instawin" className="text-primary hover:text-primary-light font-bold text-sm">
          Back to Wheel Games
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 lg:py-16">
      <div className="animate-fade-in-up text-center mb-8">
        {game.imageUrl && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border mb-6">
            <Image src={game.imageUrl} alt={game.title} fill className="object-cover" sizes="600px" />
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">{game.title}</h1>
        {game.status === 'live' ? (
          <p className="text-muted font-medium">{formatPrice(game.pricePerSpin)} per spin</p>
        ) : (
          <p className="text-danger font-bold">This game has ended.</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center">
        <WheelSpin
          spinning={phase === 'spinning'}
          isWinner={isWinner}
          onDone={() => setPhase('result')}
        />

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mt-6 w-full text-center">
            {error}
          </div>
        )}

        <div className="mt-8 w-full max-w-xs text-center">
          {phase === 'idle' && game.status === 'live' && (
            <button
              onClick={handleSpin}
              disabled={starting}
              className="w-full px-6 py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {starting ? 'Starting...' : `Spin for ${formatPrice(game.pricePerSpin)}`}
            </button>
          )}

          {phase === 'idle' && game.status !== 'live' && (
            <Link
              href="/instawin"
              className="inline-block w-full px-6 py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
            >
              See Other Wheel Games
            </Link>
          )}

          {phase === 'waiting-for-payment' && (
            <p className="text-sm text-muted font-semibold">Confirming your payment...</p>
          )}

          {phase === 'spinning' && (
            <p className="text-sm text-muted font-semibold">Spinning...</p>
          )}

          {phase === 'result' && (
            <div className="animate-fade-in-up">
              {isWinner ? (
                <>
                  <p className="text-lg font-black text-foreground mb-1">🎉 You won{prizeName ? `: ${prizeName}` : '!'}</p>
                  <p className="text-xs text-muted font-medium mb-4">Our team will be in touch to arrange your prize.</p>
                </>
              ) : (
                <p className="text-lg font-black text-foreground mb-4">Not this time &mdash; try again!</p>
              )}
              <button
                onClick={handleSpinAgain}
                className="w-full px-6 py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105"
              >
                Spin Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
