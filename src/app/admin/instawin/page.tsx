'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface WheelGame {
  id: string;
  title: string;
  slug: string;
  pricePerSpin: number;
  profitTarget: number;
  revenuePence: number;
  prizeName: string;
  prizeValue: number;
  status: 'live' | 'won' | 'closed';
}

export default function AdminInstaWinPage() {
  const [games, setGames] = useState<WheelGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/wheel')
      .then((r) => r.json())
      .then((data) => setGames(data.games || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">InstaWin</h1>
          <p className="text-muted font-medium">
            Pay-per-spin instant win games shown on the public /instawin page.
          </p>
        </div>
        <Link
          href="/admin/instawin/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New InstaWin Game
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Game</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Price/Spin</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Revenue / Target</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Prize Value</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    No InstaWin games yet. Create one to list it on the public /instawin page.
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{game.title}</p>
                      <p className="text-xs text-muted font-medium">{game.prizeName}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-foreground">{formatPrice(game.pricePerSpin)}</td>
                    <td className="px-5 py-4 hidden sm:table-cell text-sm font-bold text-foreground">
                      {formatPrice(game.revenuePence)} / {formatPrice(game.profitTarget)}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm font-bold text-foreground">
                      {formatPrice(game.prizeValue)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        game.status === 'live' ? 'bg-success/10 text-success' :
                        game.status === 'won' ? 'bg-primary/10 text-primary' :
                        'bg-muted/10 text-muted'
                      }`}>
                        {game.status === 'live' ? 'Live' : game.status === 'won' ? 'Won' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/instawin/${game.id}/edit`}
                        className="text-xs text-primary hover:text-primary-light font-bold transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
