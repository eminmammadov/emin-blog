import { redirect } from 'next/navigation';
import { generateShortLink } from '@/lib/shortLink';
import mongoose from 'mongoose';
import Blog from '@/models/Blog';

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

// This prevents Next.js from trying to statically generate this page during build
export const dynamic = 'force-dynamic';

export default async function ShortLinkRedirect({ params }: { params: { hash: string } }) {
  // Validate hash parameter to prevent undefined errors
  if (!params || !params.hash) {
    console.error('Invalid hash parameter:', params);
    redirect('/blog');
  }

  try {
    await connectDB();

    const hash = `0x${params.hash}`;

    console.log(`Resolving short link: ${hash}`);

    // Tüm blog yazılarını getir
    const blogs = await Blog.find({});

    if (!blogs || blogs.length === 0) {
      console.log('No blogs found when resolving short link');
      redirect('/blog');
    }

    // Her blog için kısa link oluştur ve eşleşeni bul
    for (const blog of blogs) {
      if (!blog || !blog.slug) continue; // Skip invalid blog entries

      const blogShortLink = generateShortLink(blog.slug);

      if (blogShortLink === hash) {
        // Eşleşen blog bulundu, yönlendir
        console.log(`Short link ${hash} resolved to: ${blog.slug}`);
        redirect(`/blog/${blog.slug}`);
      }
    }

    // Eşleşen blog bulunamadı
    console.log(`Short link not found: ${hash}`);
    redirect('/blog');
  } catch (error) {
    console.error(`Error resolving short link: ${params?.hash}`, error);
    redirect('/blog');
  }
}
