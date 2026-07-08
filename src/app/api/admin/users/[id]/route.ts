import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, orders, tickets, winners, verificationCodes, competitions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (session.id === id) {
    return Response.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  try {
    const [targetUser] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!targetUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'admin') {
      return Response.json({ error: 'Cannot delete an admin account' }, { status: 400 });
    }

    const ticketCounts = await db
      .select({
        competitionId: tickets.competitionId,
        count: sql<number>`count(*)::int`,
      })
      .from(tickets)
      .where(eq(tickets.userId, id))
      .groupBy(tickets.competitionId);

    await db.delete(winners).where(eq(winners.userId, id));
    await db.delete(verificationCodes).where(eq(verificationCodes.userId, id));
    await db.delete(tickets).where(eq(tickets.userId, id));
    await db.delete(orders).where(eq(orders.userId, id));
    await db.delete(users).where(eq(users.id, id));

    for (const { competitionId, count } of ticketCounts) {
      await db
        .update(competitions)
        .set({ ticketsSold: sql`greatest(${competitions.ticketsSold} - ${count}, 0)` })
        .where(eq(competitions.id, competitionId));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
