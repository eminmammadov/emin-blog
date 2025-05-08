import { type NextRequest, NextResponse } from 'next/server';

// Bu API, zamanlanmış blog yazılarını yayınlamak için kullanılır
// Vercel Cron Jobs tarafından düzenli olarak çağrılabilir
export async function GET(request: NextRequest) {
  try {
    // API key kontrolü
    const apiKey = request.headers.get('x-api-key');
    const expectedApiKey = process.env.CRON_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Zamanlanmış blog yazılarını yayınla
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL;

    const response = await fetch(`${baseUrl}/api/blogs/publish-scheduled`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to publish scheduled blogs: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Failed to run cron job' },
      { status: 500 }
    );
  }
}
