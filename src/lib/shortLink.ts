/**
 * Verilən bir string üçün qısa bir hash yaradır
 * @param text Hash ediləcək mətn
 * @returns "0x" ilə başlayan 8 simvolluq bir hash
 */
export function generateShortHash(text: string): string {
  // Sadə bir hash alqoritmi
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer-ə çevrilir
  }
  
  // Müsbət ədədə çevrilir və 16-lıq sistemdə stringə çevrilir
  const positiveHash = Math.abs(hash);
  const hexString = positiveHash.toString(16).substring(0, 8);
  
  // "0x" prefiksi əlavə edilir
  return `0x${hexString}`;
}

/**
 * Tam URL-dən qısa link yaradır
 * @param slug Blog yazısının slug-ı
 * @returns Qısa link
 */
export function generateShortLink(slug: string): string {
  return generateShortHash(slug);
}

/**
 * Tam URL-i qısa URL-ə çevirir
 * @param baseUrl Saytın URL-i
 * @param slug Blog yazısının slug-ı
 * @returns Qısa URL
 */
export function getShortUrl(baseUrl: string, slug: string): string {
  const shortHash = generateShortLink(slug);
  return `${baseUrl}/blog/${shortHash}`;
}
