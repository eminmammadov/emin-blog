/**
 * Verilen bir string için kısa bir hash oluşturur
 * @param text Hash'lenecek metin
 * @returns "0x" ile başlayan 8 karakterlik bir hash
 */
export function generateShortHash(text: string): string {
  // Basit bir hash algoritması
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit integer'a dönüştür
  }
  
  // Pozitif sayıya dönüştür ve 16'lık tabanda stringe çevir
  const positiveHash = Math.abs(hash);
  const hexString = positiveHash.toString(16).substring(0, 8);
  
  // "0x" prefix'i ekle
  return `0x${hexString}`;
}

/**
 * Tam URL'den kısa link oluşturur
 * @param slug Blog yazısının slug'ı
 * @returns Kısa link
 */
export function generateShortLink(slug: string): string {
  return generateShortHash(slug);
}

/**
 * Tam URL'yi kısa URL'ye dönüştürür
 * @param baseUrl Site URL'si
 * @param slug Blog yazısının slug'ı
 * @returns Kısa URL
 */
export function getShortUrl(baseUrl: string, slug: string): string {
  const shortHash = generateShortLink(slug);
  return `${baseUrl}/blog/${shortHash}`;
}
