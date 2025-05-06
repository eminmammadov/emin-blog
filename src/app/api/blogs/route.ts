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

    // Get all blogs sorted by date (newest first)
    const blogs = await Blog.find({}).sort({ date: -1 });
    console.log(`Found ${blogs.length} blogs in database`);

    // Blog verilerini detaylı olarak logla
    if (blogs.length > 0) {
      console.log('First blog sample:', JSON.stringify(blogs[0]));
    }

    // Admin paneli için cache'leme yapmayalım
    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
