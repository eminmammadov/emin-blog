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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    console.log(`Deleting blog with slug: ${slug}`);

    // Find and delete blog by slug
    const result = await Blog.deleteOne({ slug });
    
    if (result.deletedCount === 0) {
      console.log(`Blog with slug ${slug} not found for deletion`);
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    console.log(`Successfully deleted blog with slug: ${slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting blog with slug: ${params.slug}`, error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
