'use client';

import { useState } from 'react';
import { competitions } from '@/lib/mock-data';
import { percentSold } from '@/lib/utils';

export default function AdminDrawsPage() {
  const [selectedComp, setSelectedComp] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState<{ ticket: number; competition: string } | null>(null);

  const eligibleComps = competitions.filter((c) => c.status === 'live');

  const runDraw = async () => {
    if (!selectedComp) return;
    const comp = competitions.find((c) => c.id === selectedComp);
    if (!comp) return;

    const pct = percentSold(comp.ticketsSold, comp.totalTickets);
    if (pct < comp.minimumSoldPercentage) {
      alert(`Cannot run draw — only ${pct}% sold. Minimum threshold is ${comp.minimumSoldPercentage}%.`);
      return;
    }

    setDrawing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 3000));

    const winningTicket = Math.floor(Math.random() * comp.ticketsSold) + 1;
    setResult({ ticket: winningTicket, competition: comp.title });
    setDrawing(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-1">Draw Manager</h1>
        <p className="text-muted font-medium">Run verified draws for completed competitions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Run a Draw</h2>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Select Competition
              </label>
              <select
                value={selectedComp || ''}
                onChange={(e) => {
                  setSelectedComp(e.target.value || null);
                  setResult(null);
                }}
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer font-medium"
              >
                <option value="">Choose a competition...</option>
                {eligibleComps.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({percentSold(c.ticketsSold, c.totalTickets)}% sold)
                  </option>
                ))}
              </select>
            </div>

            {selectedComp && (() => {
              const comp = competitions.find((c) => c.id === selectedComp);
              if (!comp) return null;
              const pct = percentSold(comp.ticketsSold, comp.totalTickets);
              const thresholdMet = pct >= comp.minimumSoldPercentage;
              return (
                <div className="bg-background rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Tickets Sold</span>
                    <span className="text-foreground font-bold">{comp.ticketsSold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Total Tickets</span>
                    <span className="text-foreground font-bold">{comp.totalTickets.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Threshold</span>
                    <span className={`font-bold ${thresholdMet ? 'text-success' : 'text-primary'}`}>
                      {comp.minimumSoldPercentage}% {thresholdMet ? '✓ Met' : '— Not met'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-medium">Draw Date</span>
                    <span className="text-foreground font-bold">
                      {new Date(comp.drawDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  {!thresholdMet && (
                    <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg p-3">
                      <p className="text-xs text-primary font-bold">
                        Draw blocked — {comp.minimumSoldPercentage}% threshold not reached ({pct}% sold)
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <button
              onClick={runDraw}
              disabled={!selectedComp || drawing}
              className="w-full py-4 bg-primary hover:bg-primary-light text-background font-black text-lg rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 glow-primary"
            >
              {drawing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Drawing winner...
                </span>
              ) : (
                'Run Draw'
              )}
            </button>

            {result && (
              <div className="animate-fade-in-up mt-6 bg-success/10 border border-success/30 rounded-xl p-6 text-center">
                <p className="text-sm text-success font-bold mb-2">Winner Selected!</p>
                <p className="text-3xl font-black text-foreground font-mono mb-1">
                  Ticket #{String(result.ticket).padStart(4, '0')}
                </p>
                <p className="text-sm text-muted font-medium">{result.competition}</p>
                <p className="text-xs text-muted mt-3 font-medium">
                  Demo draw — connect database to match ticket to user
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-bold text-foreground mb-4">Upcoming Draws</h2>
          <div className="space-y-3">
            {eligibleComps
              .sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime())
              .map((comp) => {
                const pct = percentSold(comp.ticketsSold, comp.totalTickets);
                const thresholdMet = pct >= comp.minimumSoldPercentage;
                return (
                  <div key={comp.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-foreground line-clamp-1">{comp.title}</h3>
                        <p className="text-xs text-muted mt-0.5 font-medium">
                          {new Date(comp.drawDate).toLocaleDateString('en-GB', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {thresholdMet && (
                          <span className="text-[10px] text-success font-bold">✓</span>
                        )}
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
                          pct >= 80 ? 'bg-danger/10 text-danger' : pct >= 50 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div className="relative w-full h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 80 ? 'bg-danger' : pct >= 50 ? 'bg-primary' : 'bg-success'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary/60"
                        style={{ left: `${comp.minimumSoldPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted mt-2 font-medium">
                      {comp.ticketsSold.toLocaleString()} / {comp.totalTickets.toLocaleString()} tickets sold
                      <span className="text-muted/60"> · {comp.minimumSoldPercentage}% threshold</span>
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
