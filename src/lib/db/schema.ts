import { pgTable, text, integer, timestamp, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';

export const competitionStatusEnum = pgEnum('competition_status', [
  'draft',
  'live',
  'coming_soon',
  'sold_out',
  'drawn',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'refunded',
]);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const verificationCodeTypeEnum = pgEnum('verification_code_type', [
  'email_verification',
  'password_reset',
]);

export const instaWinDisplayModeEnum = pgEnum('insta_win_display_mode', [
  'countdown',
  'prize_count',
  'jackpot',
]);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  addressLine1: varchar('address_line1', { length: 255 }),
  addressLine2: varchar('address_line2', { length: 255 }),
  city: varchar('city', { length: 100 }),
  postcode: varchar('postcode', { length: 20 }),
  dateOfBirth: varchar('date_of_birth', { length: 10 }),
  emailVerified: boolean('email_verified').default(false).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verificationCodes = pgTable('verification_codes', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  type: verificationCodeTypeEnum('type').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 10 }).default('🏆').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const competitions = pgTable('competitions', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  prizeValue: integer('prize_value'),
  cashAlternative: integer('cash_alternative'),
  ticketPrice: integer('ticket_price').notNull(),
  totalTickets: integer('total_tickets').notNull(),
  ticketsSold: integer('tickets_sold').default(0).notNull(),
  drawDate: timestamp('draw_date').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  status: competitionStatusEnum('status').default('draft').notNull(),
  featured: boolean('featured').default(false).notNull(),
  maxPerPerson: integer('max_per_person').default(100).notNull(),
  minimumSoldPercentage: integer('minimum_sold_percentage').default(85).notNull(),
  instaWin: boolean('insta_win').default(false).notNull(),
  instaWinDisplayMode: instaWinDisplayModeEnum('insta_win_display_mode').default('countdown').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tickets = pgTable('tickets', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  competitionId: text('competition_id').references(() => competitions.id, { onDelete: 'cascade' }).notNull(),
  ticketNumber: integer('ticket_number').notNull(),
  orderId: text('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  competitionId: text('competition_id').references(() => competitions.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull(),
  totalPence: integer('total_pence').notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const winners = pgTable('winners', {
  id: text('id').primaryKey(),
  competitionId: text('competition_id').references(() => competitions.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id).notNull(),
  ticketId: text('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  prizeChosen: varchar('prize_chosen', { length: 50 }),
  announcedAt: timestamp('announced_at').defaultNow().notNull(),
});

// Instant win prizes: a fixed ticket number is pre-designated as a winner when
// created. Once a ticket with that number is issued, it is "matched" (matchedAt).
// It only becomes "claimed" (claimedAt, winner notified) once the competition's
// ticket revenue has reached activationThreshold - which defaults to the prize's
// value, but can be set higher to bank a profit margin before the prize is
// awarded. A prize is never awarded before its threshold has actually been earned.
export const instantWins = pgTable('instant_wins', {
  id: text('id').primaryKey(),
  competitionId: text('competition_id').references(() => competitions.id, { onDelete: 'cascade' }).notNull(),
  ticketNumber: integer('ticket_number').notNull(),
  prizeName: varchar('prize_name', { length: 255 }).notNull(),
  prizeValue: integer('prize_value').notNull(),
  activationThreshold: integer('activation_threshold').notNull(),
  ticketId: text('ticket_id').references(() => tickets.id, { onDelete: 'set null' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  matchedAt: timestamp('matched_at'),
  claimedAt: timestamp('claimed_at'),
  revealedAt: timestamp('revealed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
