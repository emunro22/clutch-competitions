'use client';

import { useState, useEffect, useCallback } from 'react';

const messages = [
  '🎉 Tickets from just £1 — enter now',
  '🚗 New competition live: Win an Audi RS6 Avant',
  '🏆 100% Verified Draws — real winners every week',
  '⭐ Rated 5 stars by thousands of UK entrants',
];

export default function AnnouncementBanner() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % messages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  if (dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary-light to-accent">
      <div className="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 pr-10 sm:pr-12">
        <div className="relative h-9 sm:h-10">
          {messages.map((msg, i) => (
            <p
              key={i}
              aria-hidden={i !== current}
              className={`absolute inset-0 flex items-center justify-center px-2 text-center text-xs sm:text-sm font-bold text-background truncate transition-opacity duration-700 ${
                i === current ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {msg}
            </p>
          ))}
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 text-background/80 hover:text-background transition-colors"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
