import Link from 'next/link';
import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

async function getLiveCompetitionCount() {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(competitions)
      .where(eq(competitions.status, 'live'));
    return row?.count ?? 0;
  } catch (error) {
    console.error('Live competition count error:', error);
    return 0;
  }
}

export default async function HeroSection() {
  const liveCount = await getLiveCompetitionCount();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 lg:pt-7 lg:pb-4 text-center">
        <div className="animate-fade-in-up inline-flex items-center gap-2 bg-card border border-primary/20 rounded-full px-4 py-1.5 mb-3">
          <div className="w-2 h-2 rounded-full bg-success pulse-live" />
          <span className="text-sm text-muted font-medium">
            {liveCount > 0 ? (
              <>
                <span className="text-primary font-bold">
                  {liveCount} competition{liveCount === 1 ? '' : 's'}
                </span>{' '}
                live now
              </>
            ) : (
              'New competitions launching soon'
            )}
          </span>
        </div>

        <h1 className="animate-fade-in-up text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3" style={{ animationDelay: '100ms' }}>
          Win Your <span className="gradient-text">Dream Prize</span>{' '}
          <span className="text-foreground">Starting From £1</span>
        </h1>

        <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '200ms' }}>
          <Link
            href="/competitions"
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-all hover:scale-105 glow-primary text-center"
          >
            Browse Competitions
          </Link>
          <Link
            href="/how-it-works"
            className="w-full sm:w-auto px-6 py-3 bg-card border border-border hover:border-primary/50 text-foreground font-bold rounded-xl transition-all hover:scale-105 text-center"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
