'use client';

import { useMemo } from 'react';
import InstaWinCard from '@/components/InstaWinCard';
import { useCompetitions } from '@/lib/store';

export default function InstaWinPage() {
  const competitions = useCompetitions();

  const instaWinCompetitions = useMemo(
    () => competitions.filter((c) => c.instaWin && c.status === 'live'),
    [competitions]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-primary font-bold text-sm">⚡ InstaWin Competitions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
          Win Instantly, No Draw Required
        </h1>
        <p className="text-muted text-lg font-medium max-w-2xl mx-auto">
          Every InstaWin ticket has a chance to win the moment it&apos;s bought. Find out straight away, no waiting for a draw date.
        </p>
      </div>

      {instaWinCompetitions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {instaWinCompetitions.map((comp) => (
            <InstaWinCard key={comp.id} competition={comp} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">⚡</p>
          <h3 className="text-xl font-bold text-foreground mb-2">No InstaWin Competitions Yet</h3>
          <p className="text-muted font-medium">Check back soon, new InstaWin competitions are added regularly.</p>
        </div>
      )}
    </div>
  );
}
