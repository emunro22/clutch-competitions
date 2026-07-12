import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { wheelGames } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [game] = await db.select().from(wheelGames).where(eq(wheelGames.id, id)).limit(1);

  if (!game) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ game });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title) {
      updates.title = body.title;
      updates.slug = slugify(body.title);
    }
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl || null;
    if (body.pricePerSpin !== undefined) updates.pricePerSpin = body.pricePerSpin;
    if (body.profitTarget !== undefined) updates.profitTarget = body.profitTarget;
    if (body.prizeName !== undefined) updates.prizeName = body.prizeName;
    if (body.prizeValue !== undefined) updates.prizeValue = body.prizeValue;
    if (body.status !== undefined) updates.status = body.status;

    await db.update(wheelGames).set(updates).where(eq(wheelGames.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update wheel game error:', error);
    return Response.json({ error: 'Failed to update wheel game' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(wheelGames).where(eq(wheelGames.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete wheel game error:', error);
    return Response.json({ error: 'Failed to delete wheel game' }, { status: 500 });
  }
}
