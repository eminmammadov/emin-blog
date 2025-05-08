export interface BlogPost {
  _id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  readingTime?: string;
  category?: string;
  categories?: string[];
  scheduledDate?: string | Date; // Yayınlanma zamanı
  published?: boolean; // Yayınlanma durumu
}
