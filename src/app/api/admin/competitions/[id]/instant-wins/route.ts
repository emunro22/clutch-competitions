import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions, instantWins, tickets } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { claimInstantWins } from '@/lib/instant-wins';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  const rows = await db
    .select()
    .from(instantWins)
    .where(eq(instantWins.competitionId, id))
    .orderBy(sql`${instantWins.ticketNumber} asc`);

  return Response.json({ instantWins: rows });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = await request.json();
    const { ticketNumber, prizeName, prizeValue } = body;

    if (!ticketNumber || !prizeName || !prizeValue) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [comp] = await db.select().from(competitions).where(eq(competitions.id, id)).limit(1);
    if (!comp) {
      return Response.json({ error: 'Competition not found' }, { status: 404 });
    }

    if (ticketNumber < 1 || ticketNumber > comp.totalTickets) {
      return Response.json({ error: `Ticket number must be between 1 and ${comp.totalTickets}` }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(instantWins)
      .where(and(eq(instantWins.competitionId, id), eq(instantWins.ticketNumber, ticketNumber)))
      .limit(1);

    if (existing) {
      return Response.json({ error: `Ticket #${ticketNumber} already has an instant win prize assigned` }, { status: 400 });
    }

    const winId = uuid();
    await db.insert(instantWins).values({
      id: winId,
      competitionId: id,
      ticketNumber,
      prizeName,
      prizeValue,
    });

    // That ticket number may already have been sold - claim it immediately if so.
    const [soldTicket] = await db
      .select({ id: tickets.id, ticketNumber: tickets.ticketNumber, userId: tickets.userId })
      .from(tickets)
      .where(and(eq(tickets.competitionId, id), eq(tickets.ticketNumber, ticketNumber)))
      .limit(1);

    if (soldTicket) {
      await claimInstantWins(id, [
        { ticketId: soldTicket.id, ticketNumber: soldTicket.ticketNumber, userId: soldTicket.userId },
      ]);
    }

    return Response.json({ id: winId }, { status: 201 });
  } catch (error) {
    console.error('Create instant win error:', error);
    return Response.json({ error: 'Failed to create instant win prize' }, { status: 500 });
  }
}
