import { NextRequest, NextResponse } from 'next/server';

// Admin paneli ve API'ler için erişim bilgileri
// Gerçek bir uygulamada bu değerler .env dosyasında saklanmalıdır
const ADMIN_USERNAME = 'eminx';
const ADMIN_PASSWORD = '0xAdmin#321';

// Basic Auth için gerekli credential'ı oluştur
const BASIC_AUTH_CREDENTIAL = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

console.log('Expected credential:', BASIC_AUTH_CREDENTIAL);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware processing path: ${pathname}`);

  // Admin sayfaları için kimlik doğrulama
  if (pathname === '/a/0x/admin' || pathname.startsWith('/a/0x/admin/')) {
    console.log(`Admin route detected: ${pathname}`);

    // Authorization header'ını kontrol et
    const authHeader = request.headers.get('Authorization');
    console.log(`Auth header: ${authHeader || 'Missing'}`);

    // Credential'ı çıkar ve kontrol et
    let isAuthorized = false;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credential = authHeader.substring(6); // 'Basic ' sonrası
      console.log('Received credential:', credential);
      isAuthorized = credential === BASIC_AUTH_CREDENTIAL;
    }

    // Header yoksa veya geçersizse, kimlik doğrulama iste
    if (!isAuthorized) {
      console.log('Authentication failed, requesting credentials');

      // Kimlik doğrulama penceresi göster
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

    console.log('Admin authentication successful');
    return NextResponse.next();
  }

  // Korumalı API'ler için kimlik doğrulama
  if (pathname.startsWith('/api/blogs') &&
      (pathname.includes('/create') ||
       pathname.includes('/delete') ||
       pathname.includes('/update'))) {

    console.log(`Protected API route detected: ${pathname}`);

    // Authorization header'ını kontrol et
    const authHeader = request.headers.get('Authorization');
    console.log(`API Auth header: ${authHeader || 'Missing'}`);

    // Credential'ı çıkar ve kontrol et
    let isAuthorized = false;
    if (authHeader && authHeader.startsWith('Basic ')) {
      const credential = authHeader.substring(6); // 'Basic ' sonrası
      console.log('API received credential:', credential);
      isAuthorized = credential === BASIC_AUTH_CREDENTIAL;
    }

    // Header yoksa veya geçersizse, 401 hatası döndür
    if (!isAuthorized) {
      console.log('API authentication failed');

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

    console.log('API authentication successful');
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
