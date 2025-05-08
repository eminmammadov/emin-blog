import { NextResponse } from 'next/server';
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

// Bu API, mevcut blog yazılarını güncellemek için kullanılır
// published alanı olmayan blog yazılarına published: true ekler
export async function GET() {
  try {
    await connectDB();

    // published alanı olmayan blog yazılarını bul
    const unpublishedBlogs = await Blog.find({
      published: { $exists: false }
    });

    console.log(`Found ${unpublishedBlogs.length} blogs without published field`);

    if (unpublishedBlogs.length === 0) {
      return NextResponse.json({ message: 'No blogs to update' });
    }

    // Her bir blog yazısını güncelle
    const updatedBlogs = [];
    for (const blog of unpublishedBlogs) {
      blog.published = true;
      await blog.save();
      updatedBlogs.push({
        slug: blog.slug,
        title: blog.title,
      });
    }

    return NextResponse.json({
      message: `Updated ${updatedBlogs.length} blogs`,
      updatedBlogs,
    });
  } catch (error) {
    console.error('Error updating existing blogs:', error);
    return NextResponse.json(
      { error: 'Failed to update existing blogs' },
      { status: 500 }
    );
  }
}
