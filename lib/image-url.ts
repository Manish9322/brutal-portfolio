const CLOUDINARY_UPLOAD = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;
const TRANSFORM_SEGMENT = /^[a-z]{1,3}_[^/,]+(,[a-z]{1,3}_[^/,]+)*\//;

export interface CdnOptions {
  width?: number;
  quality?: string | number;
}

export function cdn(url?: string, { width, quality = 'auto' }: CdnOptions = {}): string {
  if (!url) return '';

  const match = url.match(CLOUDINARY_UPLOAD);
  if (!match) return url;

  const [, prefix, rest] = match;
  if (TRANSFORM_SEGMENT.test(rest)) return url;

  const transforms = ['f_auto', `q_${quality}`];
  if (width) transforms.push(`w_${width}`, 'c_limit');
  return `${prefix}${transforms.join(',')}/${rest}`;
}

export function cdnSrcSet(url: string | undefined, width: number): string | undefined {
  if (!url || !CLOUDINARY_UPLOAD.test(url)) return undefined;
  if (cdn(url) === url) return undefined;
  return `${cdn(url, { width })} 1x, ${cdn(url, { width: width * 2 })} 2x`;
}
