import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { slugify } from '@/lib/utils';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
    if (body.description !== undefined) updates.description = body.description;
    if (body.imageUrl !== undefined) updates.imageUrl = body.imageUrl;
    if (body.cashAlternative !== undefined) updates.cashAlternative = body.cashAlternative;
    if (body.ticketPrice !== undefined) updates.ticketPrice = body.ticketPrice;
    if (body.totalTickets !== undefined) updates.totalTickets = body.totalTickets;
    if (body.drawDate !== undefined) updates.drawDate = new Date(body.drawDate);
    if (body.category !== undefined) updates.category = body.category;
    if (body.status !== undefined) updates.status = body.status;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.maxPerPerson !== undefined) updates.maxPerPerson = body.maxPerPerson;
    if (body.minimumSoldPercentage !== undefined) updates.minimumSoldPercentage = body.minimumSoldPercentage;

    await db
      .update(competitions)
      .set(updates)
      .where(eq(competitions.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Update competition error:', error);
    return Response.json({ error: 'Failed to update competition' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(competitions).where(eq(competitions.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete competition error:', error);
    return Response.json({ error: 'Failed to delete competition' }, { status: 500 });
  }
}
