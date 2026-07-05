import { db } from '@/lib/db';
import { competitions, instantWins } from '@/lib/db/schema';
import { eq, and, sql, isNull, isNotNull } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const featured = searchParams.get('featured');
  const instaWin = searchParams.get('instaWin');

  try {
    const conditions = [];

    if (category && category !== 'all') {
      conditions.push(eq(competitions.category, category));
    }
    if (status) {
      conditions.push(eq(competitions.status, status as 'live' | 'draft' | 'coming_soon' | 'sold_out' | 'drawn'));
    }
    if (featured === 'true') {
      conditions.push(eq(competitions.featured, true));
    }
    if (instaWin === 'true') {
      conditions.push(eq(competitions.instaWin, true));
    }

    const result = await db
      .select()
      .from(competitions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`${competitions.createdAt} desc`);

    const instantWinCounts = await db
      .select({
        competitionId: instantWins.competitionId,
        count: sql<number>`count(*)::int`,
      })
      .from(instantWins)
      .where(isNull(instantWins.claimedAt))
      .groupBy(instantWins.competitionId);

    const paidOutSums = await db
      .select({
        competitionId: instantWins.competitionId,
        total: sql<number>`coalesce(sum(${instantWins.prizeValue}), 0)::int`,
      })
      .from(instantWins)
      .where(isNotNull(instantWins.claimedAt))
      .groupBy(instantWins.competitionId);

    const countsByCompetition = new Map(instantWinCounts.map((row) => [row.competitionId, row.count]));
    const paidOutByCompetition = new Map(paidOutSums.map((row) => [row.competitionId, row.total]));

    return Response.json({
      competitions: result.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        imageUrl: c.imageUrl || 'https://images.unsplash.com/photo-1642961597907-fc6fbff01720?w=800&h=600&fit=crop&q=80',
        prizeValue: c.prizeValue,
        cashAlternative: c.cashAlternative,
        ticketPrice: c.ticketPrice,
        totalTickets: c.totalTickets,
        ticketsSold: c.ticketsSold,
        drawDate: c.drawDate.toISOString(),
        category: c.category,
        status: c.status,
        featured: c.featured,
        maxPerPerson: c.maxPerPerson,
        minimumSoldPercentage: c.minimumSoldPercentage,
        instaWin: c.instaWin,
        instaWinDisplayMode: c.instaWinDisplayMode,
        instantWinsCount: countsByCompetition.get(c.id) ?? 0,
        instantWinsPaidOut: paidOutByCompetition.get(c.id) ?? 0,
      })),
      total: result.length,
    });
  } catch (error) {
    console.error('Competitions fetch error:', error);
    return Response.json({ competitions: [], total: 0 });
  }
}
