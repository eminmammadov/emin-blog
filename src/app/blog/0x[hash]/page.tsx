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

export default async function ShortLinkRedirect({ params }: { params: { hash: string } }) {
  try {
    await connectDB();
    
    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const hash = `0x${resolvedParams.hash}`;
    
    console.log(`Resolving short link: ${hash}`);
    
    // Tüm blog yazılarını getir
    const blogs = await Blog.find({});
    
    // Her blog için kısa link oluştur ve eşleşeni bul
    for (const blog of blogs) {
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
    console.error(`Error resolving short link: ${params.hash}`, error);
    redirect('/blog');
  }
}
