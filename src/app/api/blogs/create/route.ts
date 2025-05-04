import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'slug', 'date', 'excerpt', 'content', 'categories'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if blog with same slug already exists
    const existingBlog = await Blog.findOne({ slug: body.slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: `Blog with slug "${body.slug}" already exists` },
        { status: 409 }
      );
    }

    // Format current date in the required format: YYYY.MM.DD - HH:MM AM/PM
    const formatDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // getMonth() returns 0-11
      const day = now.getDate();
      const dateStr = `${year}.${month}.${day}`;

      // Get hours and minutes directly to avoid duplicate AM/PM in some browsers
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Format time as HH:MM
      const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const ampm = hours >= 12 ? 'PM' : 'AM';

      return `${dateStr} - ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Parse categories string to array if it's a string
    let categoriesArray = body.categories;
    if (typeof body.categories === 'string') {
      categoriesArray = body.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);
    }

    // Set the first category as the main category
    const mainCategory = Array.isArray(categoriesArray) && categoriesArray.length > 0
      ? categoriesArray[0]
      : 'Digər';

    // Create new blog with current date
    const newBlog = await Blog.create({
      title: body.title,
      slug: body.slug,
      date: formatDate(), // Use current date instead of the one from the form
      category: mainCategory,
      excerpt: body.excerpt,
      content: body.content,
      author: body.author || 'Emin Mammadov',
      readingTime: body.readingTime || `${Math.ceil(body.content.length / 1000)} min read`,
      categories: categoriesArray,
    });

    console.log(`Created new blog: ${newBlog.title}`);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
