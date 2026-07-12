'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface WheelGame {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  pricePerSpin: number;
}

export default function InstaWinPage() {
  const [games, setGames] = useState<WheelGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wheel-games')
      .then((r) => r.json())
      .then((data) => setGames(data.games || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-primary font-bold text-sm">🎰 Instant Win</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
          Play the Slots, Win Instantly
        </h1>
        <p className="text-muted text-lg font-medium max-w-2xl mx-auto">
          Pay a small fee to play. No tickets, no waiting for a draw &mdash; line up 3 logos to win, instantly.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/instawin/${game.slug}`}
              className="group block bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              {game.imageUrl && (
                <div className="relative aspect-video">
                  <Image src={game.imageUrl} alt={game.title} fill className="object-cover" sizes="300px" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {game.title}
                </h3>
                <p className="text-sm font-bold text-primary mb-3">{formatPrice(game.pricePerSpin)} per spin</p>
                <div className="bg-primary group-hover:bg-primary-light text-background font-bold text-sm text-center py-2.5 rounded-xl transition-all group-hover:scale-105">
                  Play Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🎰</p>
          <h3 className="text-xl font-bold text-foreground mb-2">No InstaWin Games Yet</h3>
          <p className="text-muted font-medium">Check back soon, new InstaWin games are added regularly.</p>
        </div>
      )}
    </div>
  );
}
