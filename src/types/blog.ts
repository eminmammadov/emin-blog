export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  type: 'BLOG' | 'VIDEO';
  excerpt: string;
  content: string;
  author: string;
  readingTime: string;
  categories: string[];
}
