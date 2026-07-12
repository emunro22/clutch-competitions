import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { wheelGames } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { slugify } from '@/lib/utils';

export async function GET() {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const games = await db.select().from(wheelGames).orderBy(sql`${wheelGames.createdAt} desc`);

  return Response.json({ games });
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, imageUrl, pricePerSpin, profitTarget, prizeName, prizeValue } = body;

    if (!title || !pricePerSpin || !profitTarget || !prizeName || !prizeValue) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (profitTarget < pricePerSpin) {
      return Response.json({ error: 'Profit target must be at least the price per spin' }, { status: 400 });
    }

    const id = uuid();
    const slug = slugify(title);

    await db.insert(wheelGames).values({
      id,
      title,
      slug,
      imageUrl: imageUrl || null,
      pricePerSpin,
      profitTarget,
      prizeName,
      prizeValue,
    });

    return Response.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error('Create wheel game error:', error);
    return Response.json({ error: 'Failed to create wheel game' }, { status: 500 });
  }
}
