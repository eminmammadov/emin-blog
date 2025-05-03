import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types/blog';

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export function getAllBlogSlugs() {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames.map((fileName) => {
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        params: {
          slug: data.slug,
        },
      };
    });
  } catch (error) {
    console.error('Error getting blog slugs:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    // First try with the exact slug
    let fullPath = path.join(contentDirectory, `${slug}.mdx`);

    // If file doesn't exist, try to find a matching file
    if (!fs.existsSync(fullPath)) {
      const fileNames = fs.readdirSync(contentDirectory);
      const matchingFile = fileNames.find(fileName => {
        const filePath = path.join(contentDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);
        return data.slug === slug;
      });

      if (matchingFile) {
        fullPath = path.join(contentDirectory, matchingFile);
      } else {
        throw new Error(`No matching file found for slug: ${slug}`);
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug,
      title: data.title,
      date: data.date,
      type: data.type,
      excerpt: data.excerpt,
      content: content,
      author: data.author,
      readingTime: data.readingTime,
      categories: data.categories,
    };
  } catch (error) {
    console.error(`Error reading blog post with slug: ${slug}`, error);
    return undefined;
  }
}

export async function getAllBlogs(): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(contentDirectory);
  const allBlogsData = fileNames.map((fileName) => {
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug,
      title: data.title,
      date: data.date,
      type: data.type,
      excerpt: data.excerpt,
      content: content,
      author: data.author,
      readingTime: data.readingTime,
      categories: data.categories,
    };
  });

  // Sort blogs by date (newest first)
  return allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    return -1;
  });
}

export async function getRecentBlogs(count = 5): Promise<BlogPost[]> {
  const blogs = await getAllBlogs();
  return blogs.slice(0, count);
}
