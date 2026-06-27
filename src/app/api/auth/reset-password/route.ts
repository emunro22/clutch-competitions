import { db } from '@/lib/db';
import { users, verificationCodes } from '@/lib/db/schema';
import { rateLimit } from '@/lib/rate-limit';
import { eq, and, gt, isNull } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`reset-check:${normalizedEmail}`, 5, 5 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Response.json({ error: 'Invalid reset code' }, { status: 400 });
    }

    const [validCode] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, user.id),
          eq(verificationCodes.code, code),
          eq(verificationCodes.type, 'password_reset'),
          gt(verificationCodes.expiresAt, new Date()),
          isNull(verificationCodes.usedAt)
        )
      )
      .limit(1);

    if (!validCode) {
      return Response.json({ error: 'Invalid or expired reset code' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.update(verificationCodes)
      .set({ usedAt: new Date() })
      .where(eq(verificationCodes.id, validCode.id));

    await db.update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
