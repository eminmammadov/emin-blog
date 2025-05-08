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

/**
 * Blog içeriğinden ilk resmi çıkar
 * @param content Blog içeriği
 * @returns İlk resmin URL'si veya undefined
 */
export function extractFirstImageFromContent(content: string): string | undefined {
  // Markdown resim sözdizimini ara: ![alt text](image-url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = content.match(markdownImageRegex);

  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }

  // HTML img etiketini ara: <img src="image-url" ... />
  const htmlImageRegex = /<img.*?src=["'](.*?)["'].*?>/;
  const htmlMatch = content.match(htmlImageRegex);

  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  return undefined;
}
