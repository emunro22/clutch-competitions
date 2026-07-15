'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useCompetitions, useStore } from '@/lib/store';
import CompetitionCard from './CompetitionCard';

export default function CompetitionsCarousel() {
  const competitions = useCompetitions();
  const { competitionsLoading } = useStore();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const items = [...competitions]
    .filter((c) => c.status === 'live')
    .sort((a, b) => Number(b.featured) - Number(a.featured));

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 260;
    el.scrollBy({ left: direction === 'left' ? -(cardWidth + 16) * 2 : (cardWidth + 16) * 2, behavior: 'smooth' });
  };

  if (!competitionsLoading && items.length === 0) return null;

  return (
    <section className="py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Swipe to Browse</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border hover:border-primary/50 text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border hover:border-primary/50 text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        >
          {competitionsLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="snap-start shrink-0 w-[45vw] sm:w-[220px] rounded-xl bg-card border border-border animate-pulse aspect-[4/3]"
              />
            ))}

          {!competitionsLoading &&
            items.map((comp, i) => (
              <div key={comp.id} className="snap-start shrink-0 w-[45vw] sm:w-[220px]">
                <CompetitionCard competition={comp} index={i} />
              </div>
            ))}
        </div>

        <div className="text-center mt-4">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-1 text-primary hover:text-primary-light font-bold text-sm transition-colors"
          >
            See All Competitions
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
