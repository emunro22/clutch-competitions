'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';

export default function NewInstaWinGamePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [title, setTitle] = useState('');
  const [pricePerSpin, setPricePerSpin] = useState('');
  const [profitTarget, setProfitTarget] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [prizeValue, setPrizeValue] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const blob = await upload(`wheel/${Date.now()}-${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        multipart: true,
      });
      setImageUrl(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/admin/wheel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          imageUrl: imageUrl || null,
          pricePerSpin: Math.round(parseFloat(pricePerSpin) * 100),
          profitTarget: Math.round(parseFloat(profitTarget) * 100),
          prizeName,
          prizeValue: Math.round(parseFloat(prizeValue) * 100),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create InstaWin game');
        setSaving(false);
        return;
      }

      router.push('/admin/instawin');
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-muted mb-6 font-medium">
          <Link href="/admin/instawin" className="hover:text-foreground transition-colors">
            InstaWin
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">New InstaWin Game</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-8">Create InstaWin Game</h1>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Game Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="e.g., Spin to Win a PS5" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Image (optional)</label>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />

              {imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-3 max-w-xs">
                  <Image src={imageUrl} alt="InstaWin game" fill className="object-cover" sizes="300px" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted font-medium">Uploading...</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted font-medium">
                    {imageUrl ? 'Click to replace image' : 'Click to upload an image'}
                  </p>
                )}
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Pricing & Profit Target</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Price Per Spin (£)</label>
                <input type="number" required min="0" step="0.01" value={pricePerSpin} onChange={(e) => setPricePerSpin(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="1.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Profit Target (£)</label>
                <input type="number" required min="0" step="0.01" value={profitTarget} onChange={(e) => setProfitTarget(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="500.00" />
              </div>
            </div>
            <p className="text-xs text-muted font-medium">
              Spins are unlimited. Every spin is a &quot;no win&quot; until cumulative spin revenue reaches this target, at which point that spin wins and the game closes automatically. Set to 0 for testing.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Prize</h2>
              <p className="text-xs text-muted font-medium mt-0.5">
                Never shown to customers &mdash; they only ever see the price per spin, never the prize value or the profit target.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Name</label>
                <input type="text" required value={prizeName} onChange={(e) => setPrizeName(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="PlayStation 5" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Value (£, admin-only)</label>
                <input type="number" required min="0" step="0.01" value={prizeValue} onChange={(e) => setPrizeValue(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="450.00" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/instawin" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? 'Creating...' : 'Create InstaWin Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
