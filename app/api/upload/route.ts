import { NextResponse } from 'next/server';
import {
  uploadImage,
  deleteImage,
  isUploadModule,
  isCloudinaryConfigured,
  publicIdFromUrl,
  folderFor,
  kindForMimeType,
  DOCUMENT_MIME_TYPES,
  type AssetKind,
} from '@/lib/cloudinary';

export const runtime = 'nodejs';

/** Hard cap so a stray file can't tie up the route. */
const MAX_BYTES = 10 * 1024 * 1024; // 10MB

const fail = (message: string, status = 500) =>
  NextResponse.json({ error: message }, { status });

/**
 * POST /api/upload
 * multipart form: `file` (image or document), `module` (optional, defaults to "misc")
 * -> { url, publicId, name, width, height, format, bytes, folder }
 */
export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return fail('Cloudinary is not configured. Set CLOUDINARY_* in .env', 500);
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const moduleName = String(formData.get('module') || 'misc');

    if (!file || typeof file === 'string') {
      return fail('No file received.', 400);
    }
    if (!isUploadModule(moduleName)) {
      return fail(`Unknown module "${moduleName}".`, 400);
    }
    const kind = kindForMimeType(file.type);
    if (!kind) {
      return fail(`Unsupported file type "${file.type}". Allowed: images, ${DOCUMENT_MIME_TYPES.join(', ')}.`, 400);
    }
    if (file.size > MAX_BYTES) {
      return fail(`File is too large. Maximum is ${MAX_BYTES / 1024 / 1024}MB.`, 413);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadImage(buffer, file.name, moduleName, kind);

    return NextResponse.json({ ...uploaded, folder: folderFor(moduleName), kind });
  } catch (error) {
    console.error('Upload failed:', error);
    return fail(`Error uploading file: ${(error as Error).message}`);
  }
}

/**
 * DELETE /api/upload?publicId=...   (or ?url=... for records that only stored a URL)
 * Deleting an asset that is not ours, or already gone, is reported rather than thrown.
 */
export async function DELETE(request: Request) {
  if (!isCloudinaryConfigured()) {
    return fail('Cloudinary is not configured. Set CLOUDINARY_* in .env', 500);
  }

  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const explicitId = searchParams.get('publicId');
    const fromUrl = url ? publicIdFromUrl(url) : null;

    const publicId = explicitId || fromUrl?.publicId || null;
    const kind: AssetKind = (searchParams.get('kind') as AssetKind) || fromUrl?.kind || 'image';

    if (!publicId) {
      return fail(
        url ? 'That URL is not a Cloudinary asset owned by this site.' : 'publicId or url is required.',
        400
      );
    }

    const removed = await deleteImage(publicId, kind);
    if (!removed) {
      return NextResponse.json({ message: 'Asset not found on Cloudinary', publicId }, { status: 404 });
    }

    return NextResponse.json({ message: 'Asset deleted', publicId });
  } catch (error) {
    console.error('Delete failed:', error);
    return fail(`Error deleting file: ${(error as Error).message}`);
  }
}
