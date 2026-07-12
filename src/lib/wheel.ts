import { db } from './db';
import { wheelGames, wheelSpins, users } from './db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { sendWheelWinNotification } from './email';

// Resolves a paid spin against its wheel game. The neon-http driver doesn't
// support multi-statement transactions, so race-safety for "only one spin
// can ever win" comes from a single conditional UPDATE ... WHERE status =
// 'live' acting as a compare-and-swap: whichever concurrent spin's update
// actually flips the row from 'live' to 'won' is the winner, even if several
// spins independently observe that revenue has crossed the profit target.
export async function resolveSpin(gameId: string, spinId: string, userId: string, pricePence: number) {
  const [game] = await db
    .update(wheelGames)
    .set({ revenuePence: sql`${wheelGames.revenuePence} + ${pricePence}`, updatedAt: new Date() })
    .where(and(eq(wheelGames.id, gameId), eq(wheelGames.status, 'live')))
    .returning();

  if (!game || game.revenuePence < game.profitTarget) {
    return { isWinner: false };
  }

  const [won] = await db
    .update(wheelGames)
    .set({ status: 'won', winningSpinId: spinId, winnerUserId: userId, wonAt: new Date() })
    .where(and(eq(wheelGames.id, gameId), eq(wheelGames.status, 'live')))
    .returning();

  if (!won) {
    return { isWinner: false };
  }

  await db.update(wheelSpins).set({ isWinner: true }).where(eq(wheelSpins.id, spinId));

  const [user] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, userId)).limit(1);

  if (user) {
    try {
      await sendWheelWinNotification({
        customerName: user.name,
        customerEmail: user.email,
        gameTitle: game.title,
        prizeName: game.prizeName,
      });
    } catch (error) {
      console.error('Failed to send wheel win email:', error);
    }
  }

  return { isWinner: true };
}
