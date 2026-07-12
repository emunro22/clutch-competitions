import { db } from '@/lib/db';
import { wheelGames } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [game] = await db
    .select({
      id: wheelGames.id,
      title: wheelGames.title,
      slug: wheelGames.slug,
      imageUrl: wheelGames.imageUrl,
      pricePerSpin: wheelGames.pricePerSpin,
      status: wheelGames.status,
    })
    .from(wheelGames)
    .where(eq(wheelGames.slug, slug))
    .limit(1);

  if (!game) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  return Response.json({ game });
}
