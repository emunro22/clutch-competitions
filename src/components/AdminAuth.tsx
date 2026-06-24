'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'VaultComps2026!';
const STORAGE_KEY = 'vc-admin-auth';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-background text-2xl mx-auto mb-4">
              VC
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Admin Access</h1>
            <p className="text-muted text-sm font-medium">Enter the admin password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-5">
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm font-semibold rounded-xl p-3 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full h-12 bg-background border border-border rounded-xl px-4 text-foreground placeholder-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-[1.02]"
            >
              Access Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
