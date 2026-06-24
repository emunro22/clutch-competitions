'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewCompetitionPage() {
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState(85);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    alert('Competition created! (Demo - requires database connection)');
  };

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
          <span className="text-foreground">New Competition</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-8">Create Competition</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Competition Title</label>
              <input type="text" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="e.g., Win a BMW M4 or £60,000 Cash" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea required rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Describe the prize and competition details..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
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
                <select className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
                  <option value="draft">Draft</option>
                  <option value="live">Live</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prize Details */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Prize Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Value (£)</label>
                <input type="number" required step="0.01" className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="75000.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Cash Alternative (£, optional)</label>
                <input type="number" step="0.01" className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="60000.00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Image</label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <svg className="w-10 h-10 mx-auto text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-muted font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-muted mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Ticket Settings */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Ticket Settings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ticket Price (£)</label>
                <input type="number" required step="0.01" className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="1.99" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Total Tickets</label>
                <input type="number" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="4999" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Max Per Person</label>
                <input type="number" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="100" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Draw Date & Time</label>
              <input type="datetime-local" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            {/* Minimum Sold Threshold */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Minimum Sold Threshold: <span className="text-primary">{threshold}%</span>
              </label>
              <p className="text-xs text-muted mb-3 font-medium">
                The competition won&apos;t go ahead unless this percentage of tickets are sold. All ticket holders will be refunded if the threshold is not met.
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

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
              <label htmlFor="featured" className="text-sm text-foreground font-medium">
                Feature this competition on the homepage
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/competitions" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? 'Creating...' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
