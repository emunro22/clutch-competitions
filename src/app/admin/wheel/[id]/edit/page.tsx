'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { formatPrice } from '@/lib/utils';

interface WheelGame {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  pricePerSpin: number;
  profitTarget: number;
  revenuePence: number;
  prizeName: string;
  prizeValue: number;
  status: 'live' | 'won' | 'closed';
}

export default function EditWheelGamePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [game, setGame] = useState<WheelGame | null>(null);

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pricePerSpin, setPricePerSpin] = useState('');
  const [profitTarget, setProfitTarget] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [prizeValue, setPrizeValue] = useState('');

  const load = useCallback(() => {
    fetch(`/api/admin/wheel/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const g: WheelGame = data.game;
        setGame(g);
        setTitle(g.title);
        setImageUrl(g.imageUrl || '');
        setPricePerSpin((g.pricePerSpin / 100).toFixed(2));
        setProfitTarget((g.profitTarget / 100).toFixed(2));
        setPrizeName(g.prizeName);
        setPrizeValue((g.prizeValue / 100).toFixed(2));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

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
      const res = await fetch(`/api/admin/wheel/${id}`, {
        method: 'PUT',
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
        setError(data.error || 'Failed to update wheel game');
        setSaving(false);
        return;
      }

      router.push('/admin/wheel');
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  };

  const handleCloseGame = async () => {
    if (!confirm('Close this game without a winner? Spins will no longer be purchasable.')) return;

    try {
      const res = await fetch(`/api/admin/wheel/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      });
      if (res.ok) load();
    } catch (err) {
      console.error('Failed to close game:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16 text-muted">Wheel game not found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-muted mb-6 font-medium">
          <Link href="/admin/wheel" className="hover:text-foreground transition-colors">
            Wheel Games
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-foreground">Edit</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">Edit Wheel Game</h1>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
            game.status === 'live' ? 'bg-success/10 text-success' :
            game.status === 'won' ? 'bg-primary/10 text-primary' :
            'bg-muted/10 text-muted'
          }`}>
            {game.status === 'live' ? 'Live' : game.status === 'won' ? 'Won' : 'Closed'}
          </span>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-black text-primary">{formatPrice(game.revenuePence)}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mt-0.5">Revenue So Far</p>
          </div>
          <div>
            <p className="text-lg font-black text-foreground">{formatPrice(game.profitTarget)}</p>
            <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mt-0.5">Profit Target</p>
          </div>
        </div>

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
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Image (optional)</label>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />

              {imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-3 max-w-xs">
                  <Image src={imageUrl} alt="Wheel game" fill className="object-cover" sizes="300px" />
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
                <input type="number" required step="0.01" value={pricePerSpin} onChange={(e) => setPricePerSpin(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Profit Target (£)</label>
                <input type="number" required step="0.01" value={profitTarget} onChange={(e) => setProfitTarget(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-foreground">Prize</h2>
              <p className="text-xs text-muted font-medium mt-0.5">
                Never shown to customers &mdash; they only ever see the price per spin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Name</label>
                <input type="text" required value={prizeName} onChange={(e) => setPrizeName(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Value (£, admin-only)</label>
                <input type="number" required step="0.01" value={prizeValue} onChange={(e) => setPrizeValue(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            {game.status === 'live' ? (
              <button
                type="button"
                onClick={handleCloseGame}
                className="px-5 py-2.5 text-sm font-bold text-danger hover:text-danger/80 transition-colors"
              >
                Close Game
              </button>
            ) : <span />}
            <div className="flex items-center gap-4">
              <Link href="/admin/wheel" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold text-sm rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
