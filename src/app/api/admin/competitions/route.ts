import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { competitions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { slugify } from '@/lib/utils';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const allComps = await db
    .select()
    .from(competitions)
    .orderBy(sql`${competitions.createdAt} desc`);

  return Response.json({ competitions: allComps });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      cashAlternative,
      ticketPrice,
      totalTickets,
      drawDate,
      category,
      status,
      featured,
      maxPerPerson,
      minimumSoldPercentage,
    } = body;

    if (!title || !description || !ticketPrice || !totalTickets || !drawDate || !category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuid();
    const slug = slugify(title);

    await db.insert(competitions).values({
      id,
      title,
      slug,
      description,
      imageUrl: imageUrl || null,
      cashAlternative: cashAlternative || null,
      ticketPrice,
      totalTickets,
      drawDate: new Date(drawDate),
      category,
      status: status || 'draft',
      featured: featured || false,
      maxPerPerson: maxPerPerson || 100,
      minimumSoldPercentage: minimumSoldPercentage || 85,
    });

    return Response.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error('Create competition error:', error);
    return Response.json({ error: 'Failed to create competition' }, { status: 500 });
  }
}
