'use client';

import { useState, useMemo } from 'react';
import CompetitionCard from '@/components/CompetitionCard';
import CategoryFilter from '@/components/CategoryFilter';
import { useCompetitions } from '@/lib/store';

type SortOption = 'ending-soon' | 'price-low' | 'price-high' | 'popularity';

export default function CompetitionsPage() {
  const competitions = useCompetitions();
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('ending-soon');

  const filtered = useMemo(() => {
    let result = competitions.filter((c) => c.status === 'live');

    if (activeCategory !== 'all') {
      result = result.filter((c) => c.category === activeCategory);
    }

    switch (sortBy) {
      case 'ending-soon':
        result.sort((a, b) => new Date(a.drawDate).getTime() - new Date(b.drawDate).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.ticketPrice - b.ticketPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.ticketPrice - a.ticketPrice);
        break;
      case 'popularity':
        result.sort((a, b) => (b.ticketsSold / b.totalTickets) - (a.ticketsSold / a.totalTickets));
        break;
    }

    return result;
  }, [activeCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="animate-fade-in-up mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-2">
          All Competitions
        </h1>
        <p className="text-muted text-lg font-medium">
          Browse our full range of live competitions. Tickets from just £0.49.
        </p>
      </div>

      <div className="animate-fade-in-up flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8" style={{ animationDelay: '100ms' }}>
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-card border border-border rounded-xl px-4 py-2 text-sm text-foreground font-semibold focus:outline-none focus:border-primary cursor-pointer"
        >
          <option value="ending-soon">Ending Soon</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      <p className="text-sm text-muted mb-6 font-semibold">
        Showing {filtered.length} competition{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((comp, i) => (
            <CompetitionCard key={comp.id} competition={comp} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏆</p>
          <h3 className="text-xl font-bold text-foreground mb-2">No Competitions Found</h3>
          <p className="text-muted font-medium">Try selecting a different category or check back soon for new competitions.</p>
        </div>
      )}
    </div>
  );
}
