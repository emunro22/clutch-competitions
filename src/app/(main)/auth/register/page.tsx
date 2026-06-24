'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1000));
    setError('Registration requires database connection. Please configure your .env file.');
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="animate-fade-in-up w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-background text-xl">
              VC
            </div>
          </Link>
          <h1 className="text-2xl font-black text-foreground mb-2">Create Your Account</h1>
          <p className="text-muted font-medium">Join Vault Competitions and start winning today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-5">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">First Name</label>
              <input type="text" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Last Name</label>
              <input type="text" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="Smith" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Email Address</label>
            <input type="email" required className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Phone Number</label>
            <input type="tel" className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="07xxx xxxxxx" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
            <input type="password" required minLength={8} className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors" placeholder="Min 8 characters" />
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" required id="age-check" className="mt-1 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
            <label htmlFor="age-check" className="text-sm text-muted leading-snug font-medium">
              I confirm I am 18 years or older and agree to the{' '}
              <a href="/terms" className="text-primary hover:text-primary-light font-bold">Terms & Conditions</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:text-primary-light font-bold">Privacy Policy</a>.
            </label>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6 font-medium">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-light font-bold transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
