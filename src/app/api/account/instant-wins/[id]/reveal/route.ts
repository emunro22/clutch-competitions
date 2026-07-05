import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { instantWins } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;

  try {
    const [win] = await db
      .select()
      .from(instantWins)
      .where(and(eq(instantWins.id, id), eq(instantWins.userId, user.id)))
      .limit(1);

    if (!win) {
      return Response.json({ error: 'Instant win not found' }, { status: 404 });
    }

    if (!win.revealedAt) {
      await db.update(instantWins).set({ revealedAt: new Date() }).where(eq(instantWins.id, id));
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Reveal instant win error:', error);
    return Response.json({ error: 'Failed to reveal instant win' }, { status: 500 });
  }
}
