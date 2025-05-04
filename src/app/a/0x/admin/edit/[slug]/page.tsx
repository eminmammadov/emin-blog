'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';

export default function EditBlogPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Artık erişim kontrolü middleware tarafından yapılıyor
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    categories: '',
    author: '',
  });

  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({
    message: '',
    type: null,
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${params.slug}/update`, {
          headers: {
            'Authorization': `Basic ${btoa('eminx:0xAdmin#321')}`
          }
        });

        if (!response.ok) {
          throw new Error('Blog yazısı yüklenirken bir hata oluştu');
        }

        const blog = await response.json();

        setFormData({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          categories: Array.isArray(blog.categories) ? blog.categories.join(', ') : blog.categories,
          author: blog.author || 'Emin Mammadov',
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
        setStatus({
          message: error instanceof Error ? error.message : 'Bir hata oluştu',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus({ message: 'Güncelleniyor...', type: 'info' });

      // Convert categories string to array
      const categoriesArray = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

      const response = await fetch(`/api/blogs/${params.slug}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('eminx:0xAdmin#321')}`
        },
        body: JSON.stringify({
          ...formData,
          categories: categoriesArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      setStatus({ message: 'Blog yazısı başarıyla güncellendi!', type: 'success' });

      // Redirect to admin page after 2 seconds
      setTimeout(() => {
        router.push('/a/0x/admin');
      }, 2000);
    } catch (error) {
      console.error('Error updating blog:', error);
      setStatus({
        message: error instanceof Error ? error.message : 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>Blog Yazısını Düzenle</h1>
        <div className={styles.loading}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.editHeader}>
        <h1 className={styles.adminTitle}>Blog Yazısını Düzenle</h1>
        <Link href="/a/0x/admin" className={styles.backLink}>
          ← Admin Paneline Dön
        </Link>
      </div>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type || '']}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Özet</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="categories">Kategoriler (virgülle ayırın)</label>
          <input
            type="text"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="author">Yazar</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">İçerik (Markdown)</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Blog Yazısını Güncelle
        </button>
      </form>
    </div>
  );
}
