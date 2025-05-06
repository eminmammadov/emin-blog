import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Middleware üçün statik mətnlər
const MIDDLEWARE_TEXTS = {
  AUTH: {
    REALM: 'Admin Panel',
    CHARSET: 'UTF-8',
    ERROR: 'Unauthorized'
  },
  CREDENTIALS: {
    USERNAME: 'eminx',
    PASSWORD: '0xAdmin#321'
  }
};

// Admin paneli və API-lər üçün giriş məlumatları
// Real bir tətbiqdə bu dəyərlər .env faylında saxlanmalıdır
const ADMIN_USERNAME = MIDDLEWARE_TEXTS.CREDENTIALS.USERNAME;
const ADMIN_PASSWORD = MIDDLEWARE_TEXTS.CREDENTIALS.PASSWORD;

// Basic Auth üçün lazım olan credential-ı yarat
const BASIC_AUTH_CREDENTIAL = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`).toString('base64');

console.log('Expected credential:', BASIC_AUTH_CREDENTIAL);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log(`Middleware processing path: ${pathname}`);

  // Admin səhifələri üçün identifikasiya
  if (pathname === '/a/0x/admin' || pathname.startsWith('/a/0x/admin/')) {
    console.log(`Admin route detected: ${pathname}`);

    // Authorization header-ını yoxla
    const authHeader = request.headers.get('Authorization');
    console.log(`Auth header: ${authHeader || 'Missing'}`);

    // Credential-ı çıxar və yoxla
    let isAuthorized = false;
    if (authHeader?.startsWith('Basic ')) {
      const credential = authHeader.substring(6); // 'Basic ' sonrası
      console.log('Received credential:', credential);
      isAuthorized = credential === BASIC_AUTH_CREDENTIAL;
    }

    // Header yoxdursa və ya etibarsızdırsa, identifikasiya tələb et
    if (!isAuthorized) {
      console.log('Authentication failed, requesting credentials');

      // Identifikasiya pəncərəsi göstər
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': `Basic realm="${MIDDLEWARE_TEXTS.AUTH.REALM}", charset="${MIDDLEWARE_TEXTS.AUTH.CHARSET}"`,
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

  // Qorunan API-lər üçün identifikasiya
  if (pathname.startsWith('/api/blogs') &&
      (pathname.includes('/create') ||
       pathname.includes('/delete') ||
       pathname.includes('/update'))) {

    console.log(`Protected API route detected: ${pathname}`);

    // Authorization header-ını yoxla
    const authHeader = request.headers.get('Authorization');
    console.log(`API Auth header: ${authHeader || 'Missing'}`);

    // Credential-ı çıxar və yoxla
    let isAuthorized = false;
    if (authHeader?.startsWith('Basic ')) {
      const credential = authHeader.substring(6); // 'Basic ' sonrası
      console.log('API received credential:', credential);
      isAuthorized = credential === BASIC_AUTH_CREDENTIAL;
    }

    // Header yoxdursa və ya etibarsızdırsa, 401 xətası qaytar
    if (!isAuthorized) {
      console.log('API authentication failed');

      return new NextResponse(
        JSON.stringify({ error: MIDDLEWARE_TEXTS.AUTH.ERROR }),
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

// Middleware-in işləyəcəyi path-lər
export const config = {
  matcher: [
    '/a/0x/admin/:path*',
    '/a/0x/admin',
    '/api/blogs/:path*',
  ],
};
