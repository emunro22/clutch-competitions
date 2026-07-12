import { db } from '@/lib/db';
import { wheelGames } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const games = await db
    .select({
      id: wheelGames.id,
      title: wheelGames.title,
      slug: wheelGames.slug,
      imageUrl: wheelGames.imageUrl,
      pricePerSpin: wheelGames.pricePerSpin,
    })
    .from(wheelGames)
    .where(eq(wheelGames.status, 'live'));

  return Response.json({ games });
}
