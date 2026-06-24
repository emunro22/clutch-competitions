'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';

const navLinks = [
  { href: '/competitions', label: 'Competitions' },
  { href: '/winners', label: 'Winners' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

function CartButton() {
  const { cartCount, setCartOpen } = useStore();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="relative p-2 text-muted hover:text-foreground transition-colors"
      aria-label="Open cart"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-background text-[10px] font-black rounded-full flex items-center justify-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-background text-lg tracking-tight">
              VC
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Vault<span className="text-primary">Comps</span>
              </span>
              <span className="text-[10px] text-muted -mt-1 hidden sm:block tracking-widest uppercase font-medium">
                Premium Prize Competitions
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <CartButton />
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 text-sm font-bold bg-primary hover:bg-primary-light text-background rounded-xl transition-all hover:scale-105 glow-primary"
              >
                Sign Up
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-muted hover:text-foreground"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-200 ease-in-out bg-surface border-t border-border ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-muted hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex gap-3">
            <Link
              href="/auth/login"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-3 text-sm font-semibold text-foreground border border-border rounded-xl hover:bg-white/5 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center px-4 py-3 text-sm font-bold bg-primary text-background rounded-xl hover:bg-primary-light transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
