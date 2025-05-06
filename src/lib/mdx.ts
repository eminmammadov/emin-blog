import type { BlogPost } from '@/types/blog';

// Statik generasiya üçün bütün blog slug-larını əldə etmək funksiyası
export async function getAllBlogSlugs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Blogları əldə etmək alınmadı: ${response.statusText}`);
    }

    const blogs = await response.json();
    return blogs.map((blog: BlogPost) => ({
      params: {
        slug: blog.slug,
      },
    }));
  } catch (error) {
    console.error('Blog slug-larını əldə edərkən xəta baş verdi:', error);
    return [];
  }
}

// MongoDB-dən slug-a görə blog əldə etmək funksiyası
export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    // Server tərəfli render üçün mütləq URL istifadə edilir
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
      throw new Error(`Blogı əldə etmək alınmadı: ${response.statusText}`);
    }

    const blog = await response.json();
    return blog;
  } catch (error) {
    console.error(`Slug ilə blogı əldə edərkən xəta baş verdi: ${slug}`, error);
    return undefined;
  }
}

// MongoDB-dən bütün blogları əldə etmək funksiyası
export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    // Server tərəfli render üçün mütləq URL istifadə edilir
    const baseUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : process.env.NEXT_PUBLIC_SITE_URL;

    // Add retry logic with exponential backoff
    const MAX_RETRIES = 3;
    let retries = 0;
    let lastError: unknown;

    while (retries < MAX_RETRIES) {
      try {
        const response = await fetch(`${baseUrl}/api/blogs`, {
          cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
          next: { revalidate: 3600 } // Revalidate every hour in production
        });

        if (!response.ok) {
          if (response.status === 429) { // Too Many Requests
            const backoffTime = 2 ** retries * 1000; // Exponential backoff
            console.log(`Rate limited, retrying in ${backoffTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
            retries++;
            continue;
          }
          throw new Error(`Blogları əldə etmək alınmadı: ${response.statusText}`);
        }

        const blogs = await response.json();
        console.log('Bloglar əldə edildi:', blogs.length);
        return blogs;
      } catch (error) {
        lastError = error;
        if (retries < MAX_RETRIES - 1) {
          const backoffTime = 2 ** retries * 1000;
          console.log(`Error fetching blogs, retrying in ${backoffTime}ms (attempt ${retries + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
        retries++;
      }
    }

    // If we've exhausted all retries, throw the last error
    console.error('Blogları əldə edərkən xəta baş verdi (all retries failed):', lastError);
    return [];
  } catch (error) {
    console.error('Blogları əldə edərkən xəta baş verdi:', error);
    return [];
  }
}

// MongoDB-dən son blogları əldə etmək funksiyası
export async function getRecentBlogs(count = 5): Promise<BlogPost[]> {
  try {
    console.log(`Son ${count} blogları əldə edilir...`);
    const blogs = await getAllBlogs();
    console.log(`Cəmi ${blogs.length} blog əldə edildi, qaytarılır: ${Math.min(blogs.length, count)}`);
    return blogs.slice(0, count);
  } catch (error) {
    console.error('Son blogları əldə edərkən xəta baş verdi:', error);
    return [];
  }
}
