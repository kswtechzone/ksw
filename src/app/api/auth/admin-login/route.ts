import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { sendVerificationCode } from '@/lib/email';
import { apiHandler, createApiError } from '@/lib/api-handler';
import { createAuditLog } from '@/lib/audit-log';

const JWT_SECRET = (process as unknown as { env: Record<string, string | undefined> }).env.JWT_SECRET || 'secret';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

type LoginResponse =
  | { message: string; user: { id: string; username: string }; token: string }
  | { requiresVerification: boolean; message: string };

export const POST = apiHandler<LoginResponse>(async (req: Request) => {
  const { username, password, code, deviceId, email: formEmail } = await req.json();

  if (!username || !password) {
    throw createApiError('Username and password are required', 400);
  }

  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    throw createApiError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw createApiError('Invalid credentials', 401);
  }

  if (code) {
    if (!admin.verificationCode || !admin.verificationCodeExpires) {
      throw createApiError('No verification code pending. Please login again.', 400);
    }

    if (new Date() > admin.verificationCodeExpires) {
      throw createApiError('Verification code expired. Please login again.', 400);
    }

    const codeValid = await bcrypt.compare(code, admin.verificationCode);
    if (!codeValid) {
      throw createApiError('Invalid verification code', 401);
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        verificationCode: null,
        verificationCodeExpires: null,
        lastDeviceFingerprint: deviceId || null,
      },
    });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    await createAuditLog({
      userId: admin.id,
      action: 'ADMIN_LOGIN',
      entity: 'Admin',
      entityId: admin.id,
      metadata: { method: '2FA', username: admin.username },
      ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
      userAgent: req.headers.get('user-agent') || null,
    });

    return NextResponse.json({
      message: 'Login successful',
      user: { id: admin.id, username: admin.username, role: (admin as { role?: string }).role || 'ADMIN' },
      token,
    });
  }

  const needsVerification =
    !admin.lastDeviceFingerprint || admin.lastDeviceFingerprint !== (deviceId || '');

  if (needsVerification) {
    const verificationCode = generateCode();
    const hashedCode = await bcrypt.hash(verificationCode, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        verificationCode: hashedCode,
        verificationCodeExpires: expiresAt,
      },
    });

    const targetEmail = admin.email || formEmail;
    const emailSent = targetEmail
      ? await sendVerificationCode(targetEmail, verificationCode, admin.username)
      : false;

    if (targetEmail && emailSent) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { email: targetEmail },
      });
    }

    if (!emailSent) {
      console.warn('Verification code not sent to', username);
    }

    return NextResponse.json({
      requiresVerification: true,
      message: emailSent
        ? 'Verification code sent to your email.'
        : 'Verification code generated. Check server console.',
    });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  cookies().set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: (process as unknown as { env: Record<string, string | undefined> }).env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  await createAuditLog({
    userId: admin.id,
    action: 'ADMIN_LOGIN',
    entity: 'Admin',
    entityId: admin.id,
    metadata: { method: 'direct', username: admin.username },
    ipAddress: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
    userAgent: req.headers.get('user-agent') || null,
  });

  return NextResponse.json({
    message: 'Login successful',
    user: { id: admin.id, username: admin.username, role: (admin as { role?: string }).role || 'ADMIN' },
    token,
  });
});
