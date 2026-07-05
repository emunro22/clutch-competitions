import { db } from './db';
import { instantWins, users, competitions } from './db/schema';
import { eq, and, inArray, isNull, isNotNull } from 'drizzle-orm';
import { sendInstantWinNotification } from './email';

interface IssuedTicket {
  ticketId: string;
  ticketNumber: number;
  userId: string;
}

// Matches newly-issued tickets against pre-designated instant win ticket
// numbers for a competition (matchedAt). A matched prize only becomes
// claimed (winner notified) once the competition's ticket revenue has
// covered that prize's value - so it's never awarded at a loss. Every call
// also rechecks any prizes matched earlier that were still waiting on
// revenue, since a later sale (even of a non-winning ticket) can be what
// finally covers the cost.
export async function claimInstantWins(competitionId: string, issuedTickets: IssuedTicket[]) {
  if (issuedTickets.length > 0) {
    const ticketNumbers = issuedTickets.map((t) => t.ticketNumber);

    const newMatches = await db
      .select()
      .from(instantWins)
      .where(
        and(
          eq(instantWins.competitionId, competitionId),
          isNull(instantWins.matchedAt),
          inArray(instantWins.ticketNumber, ticketNumbers)
        )
      );

    for (const match of newMatches) {
      const issued = issuedTickets.find((t) => t.ticketNumber === match.ticketNumber);
      if (!issued) continue;

      await db
        .update(instantWins)
        .set({ ticketId: issued.ticketId, userId: issued.userId, matchedAt: new Date() })
        .where(eq(instantWins.id, match.id));
    }
  }

  const [comp] = await db
    .select({ title: competitions.title, ticketsSold: competitions.ticketsSold, ticketPrice: competitions.ticketPrice })
    .from(competitions)
    .where(eq(competitions.id, competitionId))
    .limit(1);

  if (!comp) return;
  const revenuePence = comp.ticketsSold * comp.ticketPrice;

  const pendingActivation = await db
    .select()
    .from(instantWins)
    .where(
      and(
        eq(instantWins.competitionId, competitionId),
        isNotNull(instantWins.matchedAt),
        isNull(instantWins.claimedAt)
      )
    );

  for (const win of pendingActivation) {
    if (!win.userId || revenuePence < win.prizeValue) continue;

    await db.update(instantWins).set({ claimedAt: new Date() }).where(eq(instantWins.id, win.id));

    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, win.userId))
      .limit(1);

    if (user) {
      try {
        await sendInstantWinNotification({
          customerName: user.name,
          customerEmail: user.email,
          competitionTitle: comp.title,
          prizeName: win.prizeName,
          ticketNumber: win.ticketNumber,
        });
      } catch (error) {
        console.error('Failed to send instant win email:', error);
      }
    }
  }
}
