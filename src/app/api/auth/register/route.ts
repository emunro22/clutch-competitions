import { db } from '@/lib/db';
import { users, verificationCodes } from '@/lib/db/schema';
import { sendSignupNotification, sendVerificationCode } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, phone, dateOfBirth } = body;

    if (!email || !password || !firstName || !lastName || !dateOfBirth) {
      return Response.json(
        { error: 'All required fields must be filled in' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`register:${normalizedEmail}`, 3, 5 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const dob = new Date(dateOfBirth);
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    if (age < 18) {
      return Response.json(
        { error: 'You must be 18 or older to register' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const id = uuid();
    const name = `${firstName} ${lastName}`;
    const passwordHash = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      id,
      email: normalizedEmail,
      passwordHash,
      name,
      phone: phone || null,
      dateOfBirth: dateOfBirth,
      emailVerified: false,
      role: 'user',
    });

    // Send signup notification emails (non-blocking)
    sendSignupNotification({
      customerName: name,
      customerEmail: normalizedEmail,
      phone: phone || undefined,
      dateOfBirth,
    }).catch((err) => console.error('Signup notification email failed:', err));

    // Generate and send verification code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(verificationCodes).values({
      id: uuid(),
      userId: id,
      code,
      type: 'email_verification',
      expiresAt,
    });

    await sendVerificationCode({ email: normalizedEmail, name, code });

    return Response.json(
      { requiresVerification: true, email: normalizedEmail },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
