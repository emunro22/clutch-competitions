'use client';

import { useCompetitions } from '@/lib/store';
import CompetitionCard from './CompetitionCard';

interface CompetitionGridProps {
  filter: 'featured' | 'live';
  limit?: number;
}

export default function CompetitionGrid({ filter, limit }: CompetitionGridProps) {
  const competitions = useCompetitions();

  let filtered = filter === 'featured'
    ? competitions.filter((c) => c.featured)
    : competitions.filter((c) => c.status === 'live');

  if (limit) filtered = filtered.slice(0, limit);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filtered.map((comp, i) => (
        <CompetitionCard key={comp.id} competition={comp} index={i} />
      ))}
    </div>
  );
}
