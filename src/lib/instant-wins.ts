import { db } from './db';
import { instantWins, users, competitions } from './db/schema';
import { eq, and, inArray, isNull } from 'drizzle-orm';
import { sendInstantWinNotification } from './email';

interface IssuedTicket {
  ticketId: string;
  ticketNumber: number;
  userId: string;
}

// Matches newly-issued tickets against pre-designated instant win ticket
// numbers for a competition, claims any matches, and emails the winner.
export async function claimInstantWins(competitionId: string, issuedTickets: IssuedTicket[]) {
  if (issuedTickets.length === 0) return;
  const ticketNumbers = issuedTickets.map((t) => t.ticketNumber);

  const matches = await db
    .select()
    .from(instantWins)
    .where(
      and(
        eq(instantWins.competitionId, competitionId),
        isNull(instantWins.claimedAt),
        inArray(instantWins.ticketNumber, ticketNumbers)
      )
    );

  if (matches.length === 0) return;

  const [comp] = await db
    .select({ title: competitions.title })
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  for (const match of matches) {
    const issued = issuedTickets.find((t) => t.ticketNumber === match.ticketNumber);
    if (!issued) continue;

    await db
      .update(instantWins)
      .set({ ticketId: issued.ticketId, userId: issued.userId, claimedAt: new Date() })
      .where(eq(instantWins.id, match.id));

    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, issued.userId))
      .limit(1);

    if (user && comp) {
      try {
        await sendInstantWinNotification({
          customerName: user.name,
          customerEmail: user.email,
          competitionTitle: comp.title,
          prizeName: match.prizeName,
          ticketNumber: match.ticketNumber,
        });
      } catch (error) {
        console.error('Failed to send instant win email:', error);
      }
    }
  }
}
