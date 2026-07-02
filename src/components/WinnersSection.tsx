import Link from 'next/link';
import { winners } from '@/lib/mock-data';
import FadeIn from './FadeIn';

export default function WinnersSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-foreground mb-4">
            Recent Winners
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto font-medium">
            Real people, real prizes. Check out some of our latest winners from across the UK.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.slice(0, 6).map((winner, i) => (
            <FadeIn
              key={winner.id}
              delay={i * 100}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-background font-black text-lg">
                  {winner.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{winner.name}</h3>
                  <p className="text-sm text-muted font-medium">{winner.location}</p>
                </div>
              </div>
              <div className="bg-background rounded-xl p-4">
                <p className="text-sm text-muted font-semibold mb-1">Won</p>
                <p className="text-lg font-black text-primary">{winner.prize}</p>
              </div>
              <p className="text-xs text-muted mt-3 font-medium">
                {new Date(winner.wonDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="text-center mt-10">
          <Link
            href="/winners"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:border-primary/50 text-foreground font-bold rounded-xl transition-all hover:scale-105"
          >
            View All Winners
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
