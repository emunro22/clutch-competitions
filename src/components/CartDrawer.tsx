'use client';

import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateCartQuantity, cartTotal, cartCount, checkout } = useStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise((r) => setTimeout(r, 1500));
    checkout();
    setCheckingOut(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  if (!cartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface border-l border-border z-50 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-black text-foreground">
            Your Cart {cartCount > 0 && <span className="text-primary">({cartCount})</span>}
          </h2>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-foreground mb-2">Order Complete!</h3>
              <p className="text-muted font-medium mb-6">Your tickets have been confirmed. Good luck!</p>
              <Link
                href="/account/tickets"
                onClick={() => setCartOpen(false)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-colors"
              >
                View My Tickets
              </Link>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-bold text-foreground mb-2">Cart is empty</h3>
              <p className="text-muted font-medium mb-6">Browse competitions and add tickets to get started.</p>
              <Link
                href="/competitions"
                onClick={() => setCartOpen(false)}
                className="px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-colors"
              >
                Browse Competitions
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.competitionId} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.competitionTitle}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
                        {item.competitionTitle}
                      </h4>
                      <p className="text-xs text-muted font-medium mt-1">
                        {formatPrice(item.ticketPrice)} per ticket
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.competitionId)}
                      className="p-1 text-muted hover:text-danger transition-colors shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.competitionId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-background border border-border text-foreground text-sm font-bold flex items-center justify-center hover:border-primary/50 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-black text-foreground w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.competitionId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-background border border-border text-foreground text-sm font-bold flex items-center justify-center hover:border-primary/50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-black text-foreground">
                      {formatPrice(item.ticketPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !success && (
          <div className="border-t border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted font-semibold">Total</span>
              <span className="text-xl font-black text-foreground">{formatPrice(cartTotal)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full py-4 bg-primary hover:bg-primary-light text-background font-black text-lg rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 glow-primary"
            >
              {checkingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Checkout — ${formatPrice(cartTotal)}`
              )}
            </button>
            <p className="text-xs text-muted text-center font-medium">
              Secure checkout powered by Stripe. You must be 18+ to enter.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
