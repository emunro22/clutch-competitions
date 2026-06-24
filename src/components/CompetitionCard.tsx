import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, formatPriceShort } from '@/lib/utils';
import CountdownTimer from './CountdownTimer';
import ProgressBar from './ProgressBar';
import type { Competition } from '@/lib/mock-data';

interface CompetitionCardProps {
  competition: Competition;
  index?: number;
}

export default function CompetitionCard({ competition, index = 0 }: CompetitionCardProps) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link href={`/competitions/${competition.slug}`} className="group block">
        <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 card-shine">
          <div className="relative aspect-[4/3] bg-background overflow-hidden">
            <Image
              src={competition.imageUrl}
              alt={competition.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
            {competition.featured && (
              <div className="absolute top-3 left-3 bg-primary text-background text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                Featured
              </div>
            )}
            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-border/50">
              {competition.category}
            </div>
            <div className="absolute bottom-0 left-0 right-0 pb-3 px-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Prize Worth</p>
                  <p className="text-2xl font-black text-primary drop-shadow-lg">
                    {formatPriceShort(competition.prizeValue)}
                  </p>
                </div>
                {competition.cashAlternative && (
                  <div className="text-right">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Cash Alt.</p>
                    <p className="text-sm font-bold text-foreground drop-shadow-lg">
                      {formatPriceShort(competition.cashAlternative)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {competition.title}
            </h3>

            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success pulse-live" />
              <CountdownTimer endDate={competition.drawDate} compact />
            </div>

            <ProgressBar
              sold={competition.ticketsSold}
              total={competition.totalTickets}
              threshold={competition.minimumSoldPercentage}
            />

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Ticket Price</p>
                <p className="text-lg font-black text-foreground">
                  {formatPrice(competition.ticketPrice)}
                </p>
              </div>
              <div className="bg-primary hover:bg-primary-light text-background font-bold text-sm px-5 py-2.5 rounded-xl transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/20">
                Enter Now
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
