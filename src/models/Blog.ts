import mongoose, { Schema, type Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  author?: string;
  readingTime?: string;
  category: string;
  categories: string[];
  scheduledDate?: Date; // Yayınlanma zamanı
  published: boolean; // Yayınlanma durumu
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String },
    readingTime: { type: String },
    category: { type: String, required: true },
    categories: { type: [String], required: true },
    scheduledDate: { type: Date }, // Yayınlanma zamanı
    published: { type: Boolean, default: true }, // Varsayılan olarak hemen yayınla
  },
  { timestamps: true }
);

// İnkişaf mühitində isti yükləmə səbəbindən modelin yenidən yazılmasının qarşısını alın
export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
