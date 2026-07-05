import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { instantWins } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; winId: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, winId } = await params;

  try {
    const [win] = await db
      .select()
      .from(instantWins)
      .where(and(eq(instantWins.id, winId), eq(instantWins.competitionId, id)))
      .limit(1);

    if (!win) {
      return Response.json({ error: 'Instant win not found' }, { status: 404 });
    }
    if (win.claimedAt) {
      return Response.json({ error: 'Cannot delete a prize that has already been claimed' }, { status: 400 });
    }

    await db.delete(instantWins).where(eq(instantWins.id, winId));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete instant win error:', error);
    return Response.json({ error: 'Failed to delete instant win prize' }, { status: 500 });
  }
}
