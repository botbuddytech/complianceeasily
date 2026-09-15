import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'ce_session';
export const SESSION_DAYS = 7;

export type SessionRole = 'client_user' | 'professional' | 'staff';

export type SessionPayload = {
  sub: string;
  email: string;
  role: SessionRole;
  fullName: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set to a string of at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export function isSessionSecretConfigured(): boolean {
  const secret = process.env.SESSION_SECRET;
  return Boolean(secret && secret.length >= 32);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    if (!isSessionSecretConfigured()) return null;
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role as SessionRole,
      fullName: typeof payload.fullName === 'string' ? payload.fullName : '',
    };
  } catch {
    return null;
  }
}
