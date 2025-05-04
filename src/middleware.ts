import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Admin paneli ve API'ler için erişim bilgileri
// Gerçek bir uygulamada bu değerler .env dosyasında saklanmalıdır
const ADMIN_USERNAME = 'eminx';
const ADMIN_PASSWORD = '0xAdmin#321';

// Basic Auth için gerekli header'ı oluştur
const BASIC_AUTH_HEADER = `Basic ${Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64')}`;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware processing path: ${pathname}`);

  // Admin sayfaları veya korumalı API'ler için kimlik doğrulama gerekli
  const isProtectedRoute =
    pathname.startsWith('/a/0x/admin') ||
    (pathname.startsWith('/api/blogs') &&
     (pathname.includes('/create') ||
      pathname.includes('/delete') ||
      pathname.includes('/update')));

  if (isProtectedRoute) {
    console.log(`Protected route detected: ${pathname}`);

    // Authorization header'ını kontrol et
    const authHeader = request.headers.get('Authorization');
    console.log(`Auth header: ${authHeader ? 'Present' : 'Missing'}`);

    // Header yoksa veya geçersizse, kimlik doğrulama iste
    if (!authHeader || authHeader !== BASIC_AUTH_HEADER) {
      console.log('Authentication failed, requesting credentials');

      // Admin sayfaları için kimlik doğrulama penceresi göster
      if (pathname.startsWith('/a/0x/admin')) {

        console.log('Returning 401 with WWW-Authenticate header');
        return new NextResponse(null, {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Panel", charset="UTF-8"',
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }

      // API istekleri için 401 hatası döndür
      console.log('Returning 401 for API request');
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    console.log('Authentication successful');
  }

  return NextResponse.next();
}

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: [
    '/a/0x/admin/:path*',
    '/a/0x/admin',
    '/api/blogs/:path*',
  ],
};
