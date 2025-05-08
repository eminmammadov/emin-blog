import { type NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Blog from '@/models/Blog';
import { generateShortLink } from '@/lib/shortLink';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    console.log('Connecting to MongoDB:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    await connectDB();

    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const hash = resolvedParams.hash;
    
    // Hash "0x" ile başlamalı
    if (!hash.startsWith('0x')) {
      return NextResponse.json(
        { error: 'Invalid short link format' },
        { status: 400 }
      );
    }
    
    // Tüm blog yazılarını getir
    const blogs = await Blog.find({});
    
    // Her blog için kısa link oluştur ve eşleşeni bul
    for (const blog of blogs) {
      const blogShortLink = generateShortLink(blog.slug);
      
      if (blogShortLink === hash) {
        // Eşleşen blog bulundu, yönlendir
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/blog/${blog.slug}`);
      }
    }
    
    // Eşleşen blog bulunamadı
    return NextResponse.json(
      { error: 'Short link not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Error resolving short link: ${params.hash}`, error);
    return NextResponse.json(
      { error: 'Failed to resolve short link' },
      { status: 500 }
    );
  }
}
