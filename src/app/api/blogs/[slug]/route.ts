import { type NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    console.log(`Fetching blog with slug: ${slug}`);

    // Find blog by slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      console.log(`Blog with slug ${slug} not found`);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    console.log(`Found blog: ${blog.title}`);
    return NextResponse.json(blog);
  } catch (error) {
    console.error(`Error fetching blog with slug: ${params.slug}`, error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}
