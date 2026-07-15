import { db } from '@/lib/db';
import { wheelGames } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

const getCachedGames = unstable_cache(
  async () =>
    db
      .select({
        id: wheelGames.id,
        title: wheelGames.title,
        slug: wheelGames.slug,
        imageUrl: wheelGames.imageUrl,
        pricePerSpin: wheelGames.pricePerSpin,
      })
      .from(wheelGames)
      .where(eq(wheelGames.status, 'live')),
  ['wheel-games-list'],
  { revalidate: 30 }
);

export async function GET() {
  const games = await getCachedGames();
  return Response.json({ games });
}
