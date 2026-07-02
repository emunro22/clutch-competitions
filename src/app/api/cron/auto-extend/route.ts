import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, and, lt, sql } from 'drizzle-orm';

// Vercel Cron runs this daily. If a live competition's draw date has passed
// but it hasn't reached its minimum sold percentage, extend by 7 days.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    const liveComps = await db
      .select()
      .from(competitions)
      .where(
        and(
          eq(competitions.status, 'live'),
          lt(competitions.drawDate, now)
        )
      );

    let extended = 0;

    for (const comp of liveComps) {
      const soldPercent = Math.round((comp.ticketsSold / comp.totalTickets) * 100);

      if (soldPercent < comp.minimumSoldPercentage) {
        const newDrawDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        await db
          .update(competitions)
          .set({
            drawDate: newDrawDate,
            updatedAt: now,
          })
          .where(eq(competitions.id, comp.id));

        extended++;
        console.log(
          `Extended "${comp.title}", ${soldPercent}% sold (needs ${comp.minimumSoldPercentage}%). New draw date: ${newDrawDate.toISOString()}`
        );
      }
    }

    return Response.json({
      checked: liveComps.length,
      extended,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error('Auto-extend cron error:', error);
    return Response.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
