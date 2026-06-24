'use client';

import { useState } from 'react';
import Link from 'next/link';
import { competitions } from '@/lib/mock-data';
import { formatPrice, formatPriceShort, percentSold } from '@/lib/utils';

export default function AdminCompetitionsPage() {
  const [filter, setFilter] = useState<'all' | 'live' | 'draft' | 'drawn'>('all');

  const filtered = filter === 'all' ? competitions : competitions.filter((c) => c.status === filter);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="animate-fade-in-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Competitions</h1>
          <p className="text-muted font-medium">Manage all your competitions in one place.</p>
        </div>
        <Link
          href="/admin/competitions/new"
          className="px-5 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Competition
        </Link>
      </div>

      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 w-fit">
        {(['all', 'live', 'draft', 'drawn'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors capitalize ${
              filter === f ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Competition</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Sold</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Threshold</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Prize</th>
                <th className="text-left text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-bold text-muted uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comp) => {
                const pct = percentSold(comp.ticketsSold, comp.totalTickets);
                const thresholdMet = pct >= comp.minimumSoldPercentage;
                return (
                  <tr key={comp.id} className="border-b border-border/50 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-foreground truncate max-w-[250px]">{comp.title}</p>
                      <p className="text-xs text-muted font-medium">Draw: {new Date(comp.drawDate).toLocaleDateString('en-GB')}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs font-bold bg-background border border-border rounded-lg px-2.5 py-1 capitalize">
                        {comp.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-foreground">{formatPrice(comp.ticketPrice)}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? 'bg-danger' : pct >= 50 ? 'bg-primary' : 'bg-success'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted font-bold">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${thresholdMet ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                        {comp.minimumSoldPercentage}%{thresholdMet ? ' ✓' : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground hidden lg:table-cell font-bold">
                      {formatPriceShort(comp.prizeValue)}
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
                         comp.status === 'sold_out' ? 'Sold Out' : 'Drawn'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/competitions/${comp.id}/edit`}
                        className="text-xs text-primary hover:text-primary-light font-bold transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
