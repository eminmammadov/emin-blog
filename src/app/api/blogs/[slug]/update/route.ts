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

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'categories'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Parse categories string to array if it's a string
    let categoriesArray = body.categories;
    if (typeof body.categories === 'string') {
      categoriesArray = body.categories
        .split(',')
        .map((cat: string) => cat.trim())
        .filter((cat: unknown) => cat);
    }
    
    // Set the first category as the main category
    const mainCategory = Array.isArray(categoriesArray) && categoriesArray.length > 0 
      ? categoriesArray[0] 
      : 'Digər';
    
    // Find and update blog
    const updatedBlog = await Blog.findOneAndUpdate(
      { slug },
      {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        category: mainCategory,
        categories: categoriesArray,
        author: body.author || 'Emin Mammadov',
        // Don't update date and slug to preserve original values
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    console.log(`Updated blog: ${updatedBlog.title}`);
    
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error(`Error updating blog with slug: ${params.slug}`, error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Next.js 15.3.1 requires awaiting params object itself
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Find blog by slug
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error(`Error fetching blog with slug: ${params.slug}`, error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}
