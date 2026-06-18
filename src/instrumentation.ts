import prisma from './lib/prisma';

export async function register() {
  console.log('[Server] Starting KSW TechZone...');
  try {
    await prisma.$connect();
    console.log('[DB] ✅ PostgreSQL connected successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[DB] ❌ PostgreSQL connection failed:', message);
  }
}
