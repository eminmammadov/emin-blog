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

export async function GET() {
  try {
    await connectDB();

    // Sadece yayınlanmış blog yazılarını getir
    const blogs = await Blog.find({
      $or: [
        { published: true }, // Yayınlanmış blog yazıları
        { published: { $exists: false } } // Eski blog yazıları (published alanı olmayan)
      ]
    }).sort({ date: -1 });
    console.log(`Found ${blogs.length} published blogs in database`);

    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch published blogs' },
      { status: 500 }
    );
  }
}
