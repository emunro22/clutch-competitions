import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Competition } from '@/lib/mock-data';

function daysRemaining(drawDate: string) {
  const diff = new Date(drawDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function InstaWinCard({ competition }: { competition: Competition }) {
  const mode = competition.instaWinDisplayMode || 'countdown';
  const remaining = competition.instantWinsCount ?? 0;
  const days = daysRemaining(competition.drawDate);

  return (
    <Link href={`/competitions/${competition.slug}`} className="group block">
      <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 p-5">
        <p className="text-2xl font-black text-foreground mb-2">{formatPrice(competition.ticketPrice)}</p>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
          {competition.title}
        </h3>

        {mode === 'prize_count' && (
          <p className="text-sm font-bold text-primary mb-3">
            {remaining.toLocaleString()} Prize{remaining === 1 ? '' : 's'}
          </p>
        )}

        {mode === 'countdown' && (
          <p className="text-xs text-muted font-semibold">
            {days > 0 ? `Ends in ${days} day${days === 1 ? '' : 's'}` : 'Draw Complete'}
          </p>
        )}

        <div className="mt-4 bg-primary group-hover:bg-primary-light text-background font-bold text-sm text-center py-2.5 rounded-xl transition-all group-hover:scale-105">
          Enter Now
        </div>
      </div>
    </Link>
  );
}
