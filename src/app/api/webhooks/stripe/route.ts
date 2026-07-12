import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { orders, tickets, competitions, users, wheelSpins, wheelGames } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { sendOrderNotification, sendSpinOrderNotification } from '@/lib/email';
import { claimInstantWins } from '@/lib/instant-wins';
import { resolveSpin } from '@/lib/wheel';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { userId, orderIds, spinId } = session.metadata || {};

    if (spinId) {
      const [spin] = await db.select().from(wheelSpins).where(eq(wheelSpins.id, spinId)).limit(1);

      if (spin && spin.status !== 'paid') {
        await db
          .update(wheelSpins)
          .set({ status: 'paid', stripeSessionId: session.id })
          .where(eq(wheelSpins.id, spinId));

        const [game] = await db.select().from(wheelGames).where(eq(wheelGames.id, spin.gameId)).limit(1);
        const [user] = await db
          .select({ name: users.name, email: users.email })
          .from(users)
          .where(eq(users.id, spin.userId))
          .limit(1);

        if (game && user) {
          try {
            await sendSpinOrderNotification({
              customerName: user.name,
              customerEmail: user.email,
              gameTitle: game.title,
              pricePence: spin.pricePence,
            });
          } catch (emailError) {
            console.error('Failed to send spin order notification email:', emailError);
          }
        }

        try {
          await resolveSpin(spin.gameId, spin.id, spin.userId, spin.pricePence);
        } catch (spinError) {
          console.error('Failed to resolve wheel spin:', spinError);
        }
      }

      return Response.json({ received: true });
    }

    if (!userId || !orderIds) {
      console.error('Missing metadata in checkout session');
      return Response.json({ received: true });
    }

    const orderIdList = orderIds.split(',');

    for (const orderId of orderIdList) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      if (!order || order.status === 'paid') continue;

      // Mark order as paid
      await db
        .update(orders)
        .set({ status: 'paid', stripeSessionId: session.id })
        .where(eq(orders.id, orderId));

      // Get competition to find current ticket count
      const [comp] = await db
        .select()
        .from(competitions)
        .where(eq(competitions.id, order.competitionId))
        .limit(1);

      if (!comp) continue;

      // Create individual ticket records
      const startNumber = comp.ticketsSold + 1;
      const issuedTickets: { ticketId: string; ticketNumber: number; userId: string }[] = [];
      for (let i = 0; i < order.quantity; i++) {
        const ticketId = uuid();
        const ticketNumber = startNumber + i;
        await db.insert(tickets).values({
          id: ticketId,
          userId: order.userId,
          competitionId: order.competitionId,
          ticketNumber,
          orderId: order.id,
        });
        issuedTickets.push({ ticketId, ticketNumber, userId: order.userId });
      }

      // Update tickets sold count on competition first, so the instant win
      // activation check below sees the up-to-date revenue for this competition.
      await db
        .update(competitions)
        .set({
          ticketsSold: sql`${competitions.ticketsSold} + ${order.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(competitions.id, order.competitionId));

      try {
        await claimInstantWins(order.competitionId, issuedTickets);
      } catch (instantWinError) {
        console.error('Failed to process instant wins:', instantWinError);
      }

      // Check if competition is now sold out
      const newSold = comp.ticketsSold + order.quantity;
      if (newSold >= comp.totalTickets) {
        await db
          .update(competitions)
          .set({ status: 'sold_out' })
          .where(eq(competitions.id, order.competitionId));
      }

      // Get user info for email
      const [user] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, order.userId))
        .limit(1);

      // Send notification emails
      if (user) {
        try {
          await sendOrderNotification({
            customerName: user.name,
            customerEmail: user.email,
            competitionTitle: comp.title,
            quantity: order.quantity,
            totalPence: order.totalPence,
            orderId: order.id,
          });
        } catch (emailError) {
          console.error('Failed to send order notification email:', emailError);
        }
      }
    }
  }

  return Response.json({ received: true });
}
