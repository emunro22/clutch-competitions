import { db } from '@/lib/db';
import { users, verificationCodes } from '@/lib/db/schema';
import { sendPasswordResetCode } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`reset:${normalizedEmail}`, 3, 5 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const [user] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return Response.json({ success: true });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(verificationCodes).values({
      id: uuid(),
      userId: user.id,
      code,
      type: 'password_reset',
      expiresAt,
    });

    await sendPasswordResetCode({
      email: normalizedEmail,
      name: user.name,
      code,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
