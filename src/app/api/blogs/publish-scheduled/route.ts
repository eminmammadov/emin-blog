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

// Bu API, zamanlanmış blog yazılarını yayınlamak için kullanılır
// Cron job veya benzeri bir servis tarafından düzenli olarak çağrılabilir
export async function GET() {
  try {
    console.log('API: Starting to check scheduled blog posts...');
    await connectDB();
    console.log('API: Connected to MongoDB');

    // Şu anki zamanı al
    const now = new Date();
    console.log(`API: Current time: ${now.toISOString()}`);

    // Tüm zamanlanmış ve yayınlanmamış blog yazılarını bul
    const allScheduledBlogs = await Blog.find({
      scheduledDate: { $exists: true }, // scheduledDate alanı var
      published: false, // Henüz yayınlanmamış
    });

    console.log(`API: Found ${allScheduledBlogs.length} total scheduled blogs`);

    // Şu anki zamandan önce veya şu anki zamanda olan blog yazılarını filtrele
    const scheduledBlogs = allScheduledBlogs.filter(blog => {
      if (!blog.scheduledDate) return false;

      // Blog'un zamanlanmış tarihini al
      const blogDate = new Date(blog.scheduledDate);

      // Şu anki zamanla karşılaştır
      const shouldPublish = blogDate <= now;

      console.log(`API: Blog "${blog.title}" scheduled for ${blogDate.toISOString()}, should publish: ${shouldPublish}`);

      return shouldPublish;
    });

    console.log(`API: Found ${scheduledBlogs.length} scheduled blogs to publish`);

    // Daha ayrıntılı günlük kaydı
    if (scheduledBlogs.length > 0) {
      for (const blog of scheduledBlogs) {
        console.log(`API: Scheduled blog to publish: ${blog.title}, scheduledDate: ${blog.scheduledDate}, current time: ${now.toISOString()}`);
      }
    } else {
      console.log('API: No scheduled blogs to publish at this time');
    }

    if (scheduledBlogs.length === 0) {
      return NextResponse.json({ message: 'No scheduled blogs to publish' });
    }

    // Her bir blog yazısını yayınla
    const publishedBlogs = [];
    for (const blog of scheduledBlogs) {
      try {
        console.log(`Publishing blog: ${blog.title}, ID: ${blog._id}`);

        // Blog yazısını güncelle
        blog.published = true;
        blog.date = formatDate(); // Yayınlanma tarihini güncelle

        // Değişiklikleri kaydet
        await blog.save();
        console.log(`Successfully published blog: ${blog.title}`);

        // Yayınlanan blog yazısını listeye ekle
        publishedBlogs.push({
          slug: blog.slug,
          title: blog.title,
          publishedAt: new Date(),
        });
      } catch (error) {
        console.error(`Error publishing blog ${blog.title}:`, error);
      }
    }

    return NextResponse.json({
      message: `Published ${publishedBlogs.length} scheduled blogs`,
      publishedBlogs,
    });
  } catch (error) {
    console.error('Error publishing scheduled blogs:', error);
    return NextResponse.json(
      { error: 'Failed to publish scheduled blogs' },
      { status: 500 }
    );
  }
}
