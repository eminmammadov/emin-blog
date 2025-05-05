import { NextResponse } from 'next/server';
import { getAllBlogs } from '@/lib/mdx';

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching MDX blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MDX blogs' },
      { status: 500 }
    );
  }
}
