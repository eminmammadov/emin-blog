'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import dynamic from 'next/dynamic';

// Dinamik olarak import ediyoruz çünkü bu bileşen sadece client tarafında çalışabilir
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Editör yüklənir...</div>
});

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  // Artık erişim kontrolü middleware tarafından yapılıyor

  // Format date in the required format: YYYY.MM.DD - HH:MM AM/PM
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

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: formatDate(),
    excerpt: '',
    content: '',
    categories: '',
    author: 'Emin Mammadov',
  });

  const [status, setStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({
    message: '',
    type: null,
  });

  // Fetch all blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Bloq yazıları yüklənərkən bir xəta baş verdi');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'list') {
      fetchBlogs();
    }
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Zengin metin düzenleyici için özel değişiklik işleyicisi
  const handleEditorChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    setFormData(prev => ({ ...prev, slug }));
  };

  // Function to fetch blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Bloq yazıları yüklənərkən bir xəta baş verdi');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a bloq
  const deleteBlog = async (slug: string) => {
    if (!confirm('Bu bloq yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa('eminx:0xAdmin#321')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı silinirken bir hata oluştu');
      }

      setStatus({ message: 'Blog yazısı başarıyla silindi!', type: 'success' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting bloq:', error);
      setStatus({
        message: error instanceof Error ? error.message : 'Bir hata oluştu',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus({ message: 'Gönderiliyor...', type: 'info' });

      // Convert categories string to array
      const categoriesArray = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

      const response = await fetch('/api/blogs/create', {
        method: 'POST',
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

      setStatus({ message: 'Blog yazısı başarıyla oluşturuldu!', type: 'success' });

      // Reset form after successful submission
      setFormData({
        title: '',
        slug: '',
        date: formatDate(),
        excerpt: '',
        content: '',
        categories: '',
        author: 'Emin Mammadov',
      });

      // Refresh bloq list if we're in list view
      if (activeTab === 'list') {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating bloq:', error);
      setStatus({
        message: error instanceof Error ? error.message : 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'create' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Yeni Bloq Yaz
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Bütün Bloqlar
        </button>
      </div>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type || '']}`}>
          {status.message}
        </div>
      )}

      {activeTab === 'create' ? (
        <>
          <h1 className={styles.adminTitle}>Yeni Bloq Yazısı Yaz</h1>
          <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Başlıq</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="slug">Slug</label>
            <div className={styles.slugContainer}>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className={styles.generateButton}
              >
                Yarad
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Tarixçə (Avtomatik)</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              readOnly
              className={styles.readOnlyInput}
            />
            <small className={styles.helpText}>
              Blog yazısı əlavə edilərkən avtomatik olaraq o anki tarix və saat istifadə ediləcəkdir.
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">Qısa Açıqlama</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="categories">Kateqoriya (vergüllə ayırın)</label>
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
            <label htmlFor="author">Yazan</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">Content</label>
          <RichTextEditor
            value={formData.content}
            onChange={handleEditorChange}
            placeholder="Blog içeriğinizi buraya yazın..."
          />
          <small className={styles.helpText}>
            Şəkil əlavə etmək üçün 🖼️ düyməsinə klikləyin və şəklin URL-ni daxil edin. Link əlavə etmək üçün mətni seçin və 🔗 düyməsini sıxın.
          </small>
        </div>

        <button type="submit" className={styles.submitButton}>
          Blog Yazısını Yayınla
        </button>
      </form>
      </>
      ) : (
        <>
          <h1 className={styles.adminTitle}>Bloq Yazıları</h1>

          {loading ? (
            <div className={styles.loading}>Yüklənir...</div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              Bloq yazısı tapılmadı.
            </div>
          ) : (
            <div className={styles.blogList}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    <th>Başlıq</th>
                    <th>Tarixçə</th>
                    <th>Kateqoriya</th>
                    <th>Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.slug}>
                      <td>{blog.title}</td>
                      <td>{blog.date}</td>
                      <td>{blog.category}</td>
                      <td className={styles.actions}>
                        <Link href={`/blog/${blog.slug}`} target="_blank" className={styles.viewButton}>
                          Bloqa Bax
                        </Link>
                        <Link href={`/a/0x/admin/edit/${blog.slug}`} className={styles.editButton}>
                          Düzəlt
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteBlog(blog.slug)}
                          className={styles.deleteButton}
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
