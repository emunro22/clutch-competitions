import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { wheelSpins, wheelGames } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const [spin] = await db.select().from(wheelSpins).where(eq(wheelSpins.id, id)).limit(1);

  if (!spin || spin.userId !== user.id) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  let prizeName: string | null = null;
  if (spin.isWinner && spin.status === 'paid') {
    const [game] = await db.select({ prizeName: wheelGames.prizeName }).from(wheelGames).where(eq(wheelGames.id, spin.gameId)).limit(1);
    prizeName = game?.prizeName ?? null;
  }

  return Response.json({ status: spin.status, isWinner: spin.isWinner, prizeName });
}
