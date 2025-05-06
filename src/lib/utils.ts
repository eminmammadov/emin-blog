/**
 * Site URL'sini döndər
 * @returns Site URL'si
 */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';
}

/**
 * Tam URL yarad
 * @param path URL yolu
 * @returns Tam URL
 */
export function getFullUrl(path: string): string {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
