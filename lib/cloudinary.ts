import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from '@/config/config';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/** Root folder for everything this site uploads. */
const ROOT = 'brutal-portfolio';

/**
 * Every module that can own an image maps to its own Cloudinary subfolder, so
 * assets stay sorted by where they are used:
 *
 *   brutal-portfolio/projects/…      project cover images
 *   brutal-portfolio/projects/screenshots/…
 *   brutal-portfolio/gallery/…       behind-the-scenes frames
 *   brutal-portfolio/blogs/…         post cover images
 *   brutal-portfolio/media/…         the media vault
 *   brutal-portfolio/profile/…       avatar / OG image
 *   brutal-portfolio/misc/…          fallback for anything unmapped
 */
export const UPLOAD_MODULES = {
  projects: 'projects',
  'projects/screenshots': 'projects/screenshots',
  gallery: 'gallery',
  blogs: 'blogs',
  media: 'media',
  profile: 'profile',
  seo: 'profile',
  experience: 'experience',
  education: 'education',
  testimonials: 'testimonials',
  resources: 'resources',
  misc: 'misc',
} as const;

export type UploadModule = keyof typeof UPLOAD_MODULES;

export const isUploadModule = (value: unknown): value is UploadModule =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(UPLOAD_MODULES, value);

/** Full Cloudinary folder path for a module. */
export const folderFor = (module: UploadModule): string => `${ROOT}/${UPLOAD_MODULES[module]}`;

export const isCloudinaryConfigured = (): boolean =>
  Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

/** Strips path traversal and anything awkward out of a user-supplied filename. */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
}

/** Document types accepted alongside images (resume, archives, decks). */
export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export type AssetKind = 'image' | 'raw';

/** Images go through Cloudinary's image pipeline; everything else is raw. */
export const kindForMimeType = (mimeType: string): AssetKind | null => {
  if (mimeType.startsWith('image/')) return 'image';
  if (DOCUMENT_MIME_TYPES.includes(mimeType)) return 'raw';
  return null;
};

export interface UploadedImage {
  url: string;
  publicId: string;
  name: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

/** Uploads a buffer into the folder that belongs to `module`. */
export function uploadImage(
  buffer: Buffer,
  originalName: string,
  module: UploadModule,
  kind: AssetKind = 'image'
): Promise<UploadedImage> {
  const extension = originalName.includes('.') ? originalName.split('.').pop()! : '';
  const base = sanitizeFilename(extension ? originalName.slice(0, -(extension.length + 1)) : originalName);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  // Raw assets keep their extension, otherwise the delivery URL has none and
  // browsers can't infer the file type on download.
  const publicId =
    kind === 'raw'
      ? `${uniqueSuffix}-${base || 'file'}${extension ? '.' + extension : ''}`
      : `${uniqueSuffix}-${base || 'image'}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: kind,
          public_id: publicId,
          folder: folderFor(module),
          overwrite: false,
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload returned no result'));
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            name: base,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      )
      .end(buffer);
  });
}

/** Removes an asset. Returns false when Cloudinary reports it was not found. */
export async function deleteImage(publicId: string, kind: AssetKind = 'image'): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: kind });
  return result.result === 'ok';
}

/**
 * Recovers the public id from a Cloudinary URL, so images stored before this
 * utility existed (which only have a URL on the record) can still be deleted.
 * Returns null for anything that is not a Cloudinary URL we own.
 */
export function publicIdFromUrl(url: string): { publicId: string; kind: AssetKind } | null {
  const match = url.match(/\/(image|raw)\/upload\/(?:v\d+\/)?(.+)$/);
  if (!match) return null;

  const kind = match[1] as AssetKind;
  // Raw public ids include the extension; image ids do not.
  const id = kind === 'raw' ? match[2] : match[2].replace(/\.[a-z0-9]+$/i, '');
  return id.startsWith(`${ROOT}/`) ? { publicId: id, kind } : null;
}

export default cloudinary;
