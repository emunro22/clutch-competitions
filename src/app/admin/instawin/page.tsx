'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Competition {
  id: string;
  title: string;
  slug: string;
  ticketPrice: number;
  prizeValue: number | null;
  drawDate: string;
  status: string;
  instaWin: boolean;
  instaWinDisplayMode: 'countdown' | 'prize_count' | 'jackpot';
}

const displayModeLabels: Record<Competition['instaWinDisplayMode'], string> = {
  countdown: 'Countdown',
  prize_count: 'Prize Count',
  jackpot: 'Rolling Jackpot',
};

export default function AdminInstaWinPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/competitions')
      .then((r) => r.json())
      .then((data) => setCompetitions((data.competitions || []).filter((c: Competition) => c.instaWin)))
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
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">InstaWin Competitions</h1>
          <p className="text-muted font-medium">
            Competitions listed on the public /instawin page. Toggle &quot;Show on the InstaWin page&quot; on any competition&apos;s edit screen to add it here.
          </p>
        </div>
        <Link
          href="/admin/competitions/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Competition
        </Link>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Competition</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Ticket Price</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Prize Pot</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Display Mode</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-muted">
                    No InstaWin competitions yet. Create one or edit an existing competition and check &quot;Show on the InstaWin page&quot;.
                  </td>
                </tr>
              ) : (
                competitions.map((comp) => (
                  <tr key={comp.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{comp.title}</p>
                      <p className="text-xs text-muted font-medium">Draw: {new Date(comp.drawDate).toLocaleDateString('en-GB')}</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-foreground">{formatPrice(comp.ticketPrice)}</td>
                    <td className="px-5 py-4 hidden sm:table-cell text-sm font-bold text-foreground">
                      {comp.prizeValue != null ? formatPrice(comp.prizeValue) : '—'}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-bold bg-background border border-border rounded-lg px-2.5 py-1">
                        {displayModeLabels[comp.instaWinDisplayMode]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        comp.status === 'live' ? 'bg-success/10 text-success' :
                        comp.status === 'coming_soon' ? 'bg-primary/10 text-primary' :
                        comp.status === 'sold_out' ? 'bg-danger/10 text-danger' :
                        'bg-muted/10 text-muted'
                      }`}>
                        {comp.status === 'live' ? 'Live' :
                         comp.status === 'coming_soon' ? 'Soon' :
                         comp.status === 'sold_out' ? 'Sold Out' :
                         comp.status === 'draft' ? 'Draft' : 'Drawn'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/competitions/${comp.id}/edit`}
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
