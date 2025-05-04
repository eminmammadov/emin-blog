import type { BlogPost } from '@/types/blog';

// Function to get all blog slugs for static generation
export async function getAllBlogSlugs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`);
    }

    const blogs = await response.json();
    return blogs.map((blog: BlogPost) => ({
      params: {
        slug: blog.slug,
      },
    }));
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return [];
  }
}

// Function to fetch a blog by slug from MongoDB
export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    // Use absolute URL for server-side rendering
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL;

    const response = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return undefined;
      }
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    const blog = await response.json();
    return blog;
  } catch (error) {
    console.error(`Error fetching blog with slug: ${slug}`, error);
    return undefined;
  }
}

// Function to fetch all blogs from MongoDB
export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    // Use absolute URL for server-side rendering
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL;

    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`);
    }

    const blogs = await response.json();
    console.log('Fetched blogs:', blogs.length);
    return blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Function to fetch recent blogs from MongoDB
export async function getRecentBlogs(count = 5): Promise<BlogPost[]> {
  try {
    console.log(`Fetching ${count} recent blogs...`);
    const blogs = await getAllBlogs();
    console.log(`Got ${blogs.length} blogs, returning ${Math.min(blogs.length, count)}`);
    return blogs.slice(0, count);
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
    return [];
  }
}
