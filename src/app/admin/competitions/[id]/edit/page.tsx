'use client';

import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

interface Competition {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  prizeValue: number;
  cashAlternative: number | null;
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  drawDate: string;
  category: string;
  status: string;
  featured: boolean;
  maxPerPerson: number;
  minimumSoldPercentage: number;
}

export default function EditCompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [comp, setComp] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prizeValue, setPrizeValue] = useState('');
  const [cashAlternative, setCashAlternative] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');
  const [maxPerPerson, setMaxPerPerson] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const [threshold, setThreshold] = useState(85);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    fetch('/api/admin/competitions')
      .then((r) => r.json())
      .then((data) => {
        const found = (data.competitions || []).find((c: Competition) => c.id === id);
        if (found) {
          setComp(found);
          setTitle(found.title);
          setDescription(found.description);
          setCategory(found.category);
          setStatus(found.status);
          setImageUrl(found.imageUrl || '');
          setPrizeValue((found.prizeValue / 100).toFixed(2));
          setCashAlternative(found.cashAlternative ? (found.cashAlternative / 100).toFixed(2) : '');
          setTicketPrice((found.ticketPrice / 100).toFixed(2));
          setTotalTickets(found.totalTickets.toString());
          setMaxPerPerson(found.maxPerPerson.toString());
          setThreshold(found.minimumSoldPercentage);
          setFeatured(found.featured);
          const d = new Date(found.drawDate);
          setDrawDate(d.toISOString().slice(0, 16));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
      else setError(data.error || 'Upload failed');
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/competitions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          status,
          imageUrl: imageUrl || null,
          prizeValue: Math.round(parseFloat(prizeValue) * 100),
          cashAlternative: cashAlternative ? Math.round(parseFloat(cashAlternative) * 100) : null,
          ticketPrice: Math.round(parseFloat(ticketPrice) * 100),
          totalTickets: parseInt(totalTickets),
          maxPerPerson: parseInt(maxPerPerson),
          drawDate: new Date(drawDate).toISOString(),
          minimumSoldPercentage: threshold,
          featured,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        setSaving(false);
        return;
      }

      router.push('/admin/competitions');
    } catch {
      setError('Something went wrong');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/competitions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/competitions');
      }
    } catch {
      setError('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!comp) {
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

        <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
          Edit Competition
        </h1>
        <p className="text-muted text-sm font-medium mb-8">
          {comp.ticketsSold.toLocaleString()} tickets sold &middot; {formatPrice(comp.ticketPrice)} per ticket
        </p>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Basic Information</h2>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
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
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer">
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
            <h2 className="text-lg font-bold text-foreground">Prize & Image</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Prize Value (£)</label>
                <input type="number" required step="0.01" value={prizeValue} onChange={(e) => setPrizeValue(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Cash Alternative (£)</label>
                <input type="number" step="0.01" value={cashAlternative} onChange={(e) => setCashAlternative(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="Optional" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Image</label>
              <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />
              {imageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                  <Image src={imageUrl} alt="Prize" fill className="object-cover" sizes="600px" />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); if (fileRef.current) fileRef.current.value = ''; }}
                    className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-danger hover:bg-danger hover:text-background transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-muted font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-10 h-10 mx-auto text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted font-medium">Click to upload image</p>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">Ticket Settings</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Ticket Price (£)</label>
                <input type="number" required step="0.01" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Total Tickets</label>
                <input type="number" required value={totalTickets} onChange={(e) => setTotalTickets(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Tickets Sold</label>
                <input type="number" value={comp.ticketsSold} disabled className="w-full h-12 bg-background border border-border rounded-xl px-4 text-muted focus:outline-none transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Max Per Person</label>
              <input type="number" required value={maxPerPerson} onChange={(e) => setMaxPerPerson(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Draw Date & Time</label>
              <input type="datetime-local" required value={drawDate} onChange={(e) => setDrawDate(e.target.value)} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Minimum Sold Threshold: <span className="text-primary">{threshold}%</span>
              </label>
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
              <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
              <label htmlFor="featured" className="text-sm text-foreground font-medium">
                Feature this competition on the homepage
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="px-5 py-2.5 text-sm font-bold text-danger hover:bg-danger/10 rounded-xl transition-colors"
            >
              Delete Competition
            </button>
            <div className="flex items-center gap-4">
              <Link href="/admin/competitions" className="px-5 py-2.5 text-sm font-bold text-muted hover:text-foreground transition-colors">
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
