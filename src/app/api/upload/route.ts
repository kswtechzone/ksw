import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { apiHandler, createApiError } from '@/lib/api-handler';

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  document: ['application/pdf', 'text/plain'],
};

const MAX_SIZE = 10 * 1024 * 1024;

function getMimeCategory(mime: string): string {
  for (const [category, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mime)) return category;
  }
  return 'unknown';
}

export const POST = apiHandler(async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    throw createApiError('No file provided', 400);
  }

  if (file.size > MAX_SIZE) {
    throw createApiError('File too large (max 10MB)', 400);
  }

  const category = getMimeCategory(file.type);
  if (category === 'unknown') {
    throw createApiError(`File type ${file.type} not allowed`, 400);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public/uploads');
  await mkdir(uploadDir, { recursive: true });

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '');
  const ext = cleanName.split('.').pop() || 'png';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  console.log('File uploaded:', filename, file.size, file.type);
  return NextResponse.json({
    url: `/uploads/${filename}`,
    message: 'Upload successful',
  });
});
