import Link from 'next/link';
import { formatPrice, formatPriceShort } from '@/lib/utils';
import type { Competition } from '@/lib/mock-data';

function daysRemaining(drawDate: string) {
  const diff = new Date(drawDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function InstaWinCard({ competition }: { competition: Competition }) {
  const mode = competition.instaWinDisplayMode || 'countdown';
  const remaining = competition.instantWinsCount ?? 0;
  const paidOut = competition.instantWinsPaidOut ?? 0;
  const potRemaining = competition.prizeValue != null ? Math.max(0, competition.prizeValue - paidOut) : null;
  const days = daysRemaining(competition.drawDate);

  return (
    <Link href={`/competitions/${competition.slug}`} className="group block">
      <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 p-5">
        {mode === 'jackpot' && (
          <div className="mb-4 pb-4 border-b border-border grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg sm:text-xl font-black text-primary leading-tight">
                {potRemaining != null ? formatPrice(potRemaining) : '—'}
              </p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mt-0.5">Pot Remaining</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-foreground leading-tight">
                {formatPrice(paidOut)}
              </p>
              <p className="text-[10px] text-muted uppercase tracking-wider font-semibold mt-0.5">Already Won</p>
            </div>
          </div>
        )}

        <p className="text-2xl font-black text-foreground mb-2">{formatPrice(competition.ticketPrice)}</p>
        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
          {competition.title}
        </h3>

        {mode === 'prize_count' ? (
          <p className="text-sm font-bold text-primary mb-3">
            {remaining.toLocaleString()} Prize{remaining === 1 ? '' : 's'}
          </p>
        ) : (
          competition.prizeValue != null && (
            <p className="text-sm font-bold text-primary mb-3">
              {formatPriceShort(competition.prizeValue)} Prize Pot
            </p>
          )
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
