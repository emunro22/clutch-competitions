'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { competitions } from '@/lib/mock-data';

export default function EditCompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const competition = competitions.find((c) => c.id === id);
  const [threshold, setThreshold] = useState(competition?.minimumSoldPercentage ?? 85);

  if (!competition) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black text-foreground mb-4">Competition Not Found</h1>
        <Link href="/admin/competitions" className="text-primary hover:text-primary-light font-bold transition-colors">
          Back to Competitions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-muted mb-6 font-medium">
          <Link href="/admin/competitions" className="hover:text-foreground transition-colors">
            Competitions
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">Edit</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-8">
          Edit: {competition.title}
        </h1>

        <form className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
              <input type="text" defaultValue={competition.title} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea defaultValue={competition.description} rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select defaultValue={competition.category} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  <option value="cars">Cars</option>
                  <option value="cash">Cash</option>
                  <option value="tech">Tech</option>
                  <option value="holidays">Holidays</option>
                  <option value="experiences">Experiences</option>
                  <option value="home">Home</option>
                  <option value="watches-jewellery">Watches & Jewellery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
                <select defaultValue={competition.status} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="sold_out">Sold Out</option>
                  <option value="drawn">Drawn</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Ticket & Prize</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ticket Price (pence)</label>
                <input type="number" defaultValue={competition.ticketPrice} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Total Tickets</label>
                <input type="number" defaultValue={competition.totalTickets} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Tickets Sold</label>
                <input type="number" defaultValue={competition.ticketsSold} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" disabled />
              </div>
            </div>

            {/* Minimum Sold Threshold */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Minimum Sold Threshold: <span className="text-primary">{threshold}%</span>
              </label>
              <p className="text-xs text-muted mb-3 font-medium">
                The competition won&apos;t go ahead unless this percentage of tickets are sold.
              </p>
              <input
                type="range"
                min={50}
                max={100}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-background rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted mt-1 font-medium">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="px-5 py-2.5 text-sm font-bold text-danger hover:bg-danger/10 rounded-xl transition-colors">
              Delete Competition
            </button>
            <div className="flex items-center gap-4">
              <Link href="/admin/competitions" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
                Cancel
              </Link>
              <button type="submit" className="px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
