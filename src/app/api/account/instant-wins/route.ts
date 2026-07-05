import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { instantWins, competitions } from '@/lib/db/schema';
import { eq, and, isNotNull, sql } from 'drizzle-orm';

export async function GET() {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const wins = await db
      .select({
        id: instantWins.id,
        prizeName: instantWins.prizeName,
        prizeValue: instantWins.prizeValue,
        ticketNumber: instantWins.ticketNumber,
        claimedAt: instantWins.claimedAt,
        revealedAt: instantWins.revealedAt,
        competitionTitle: competitions.title,
        competitionSlug: competitions.slug,
      })
      .from(instantWins)
      .innerJoin(competitions, eq(instantWins.competitionId, competitions.id))
      .where(and(eq(instantWins.userId, user.id), isNotNull(instantWins.claimedAt)))
      .orderBy(sql`${instantWins.claimedAt} desc`);

    return Response.json({ wins });
  } catch (error) {
    console.error('Instant wins fetch error:', error);
    return Response.json({ wins: [] });
  }
}
