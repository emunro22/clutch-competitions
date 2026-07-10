'use client';

import { useState } from 'react';

export default function AnnouncementMarquee({ messages }: { messages: string[] }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || messages.length === 0) return null;

  const track = [...messages, ...messages];

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary-light to-accent">
      <div className="h-9 sm:h-10 overflow-hidden pr-10 sm:pr-12">
        <div className="flex h-full w-max items-center whitespace-nowrap animate-marquee">
          {track.map((msg, i) => (
            <span key={i} className="flex items-center text-xs sm:text-sm font-bold text-background">
              {msg}
              <span className="mx-6 sm:mx-8 opacity-50">•</span>
            </span>
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
