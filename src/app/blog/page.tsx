import React from 'react';
import { getAllBlogs } from '@/lib/mdx';
import BlogList from '@/components/BlogList';

export default function BlogPage() {
  const allPosts = getAllBlogs();

  return (
    <main>
      <BlogList
        posts={allPosts}
      />
    </main>
  );
}
