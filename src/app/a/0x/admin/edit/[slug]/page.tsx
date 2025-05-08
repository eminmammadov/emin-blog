'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../admin.module.css';
import dynamic from 'next/dynamic';

// Edit sayfası için statik metinler
const EDIT_TEXTS = {
  LOADING: {
    EDITOR: 'Editör yükleniyor...',
    BLOG: 'Yükleniyor...'
  },
  TITLE: {
    PAGE: 'Blog Yazısını Düzenle',
    BACK: '← Admin Panelinə Get'
  },
  FORM: {
    FIELDS: {
      TITLE: 'Başlıq',
      EXCERPT: 'Qısa Açıqlama',
      CATEGORIES: 'Kategoriya (vergüllə ayırın)',
      AUTHOR: 'Yazan',
      CONTENT: 'Content (Markdown)',
      CONTENT_HELP: 'Markdown formatında yazın. Şəkil əlavə etmək üçün 🖼️ düyməsinə klikləyin. Link əlavə etmək üçün 🔗 düyməsini sıxın. Başlıqlar üçün # işarəsi istifadə edin.',
      CONTENT_PLACEHOLDER: 'Blog içeriğinizi Markdown formatında buraya yazın...',
      SUBMIT: 'Bloq Yazısını Yeniləyin'
    }
  },
  STATUS: {
    UPDATING: 'Güncelleniyor...',
    SUCCESS: 'Blog yazısı başarıyla güncellendi!',
    ERROR_DEFAULT: 'Bir hata oluştu',
    ERROR_FETCH: 'Blog yazısı yüklenirken bir hata oluştu'
  }
};

// Dinamik olarak import ediyoruz çünkü bu bileşen sadece client tarafında çalışabilir
const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className={styles.loading}>{EDIT_TEXTS.LOADING.EDITOR}</div>
});

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
          throw new Error(EDIT_TEXTS.STATUS.ERROR_FETCH);
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
          message: error instanceof Error ? error.message : EDIT_TEXTS.STATUS.ERROR_DEFAULT,
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

  // Zengin metin düzenleyici için özel değişiklik işleyicisi
  const handleEditorChange = (value: string) => {
    setFormData(prev => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus({ message: EDIT_TEXTS.STATUS.UPDATING, type: 'info' });

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
        throw new Error(data.error || EDIT_TEXTS.STATUS.ERROR_DEFAULT);
      }

      setStatus({ message: EDIT_TEXTS.STATUS.SUCCESS, type: 'success' });

      // Redirect to admin page after 2 seconds
      setTimeout(() => {
        router.push('/a/0x/admin');
      }, 2000);
    } catch (error) {
      console.error('Error updating blog:', error);
      setStatus({
        message: error instanceof Error ? error.message : EDIT_TEXTS.STATUS.ERROR_DEFAULT,
        type: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.adminContainer}>
        <h1 className={styles.adminTitle}>{EDIT_TEXTS.TITLE.PAGE}</h1>
        <div className={styles.loading}>{EDIT_TEXTS.LOADING.BLOG}</div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.editHeader}>
        <h1 className={styles.adminTitle}>{EDIT_TEXTS.TITLE.PAGE}</h1>
        <Link href="/a/0x/admin" className={styles.backLink}>
          {EDIT_TEXTS.TITLE.BACK}
        </Link>
      </div>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type || '']}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">{EDIT_TEXTS.FORM.FIELDS.TITLE}</label>
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
          <label htmlFor="excerpt">{EDIT_TEXTS.FORM.FIELDS.EXCERPT}</label>
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
            <label htmlFor="categories">{EDIT_TEXTS.FORM.FIELDS.CATEGORIES}</label>
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
            <label htmlFor="author">{EDIT_TEXTS.FORM.FIELDS.AUTHOR}</label>
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
          <label htmlFor="content">{EDIT_TEXTS.FORM.FIELDS.CONTENT}</label>
          <MarkdownEditor
            value={formData.content}
            onChange={handleEditorChange}
            placeholder={EDIT_TEXTS.FORM.FIELDS.CONTENT_PLACEHOLDER}
          />
          <small className={styles.helpText}>
            {EDIT_TEXTS.FORM.FIELDS.CONTENT_HELP}
          </small>
        </div>

        <button type="submit" className={styles.submitButton}>
          {EDIT_TEXTS.FORM.FIELDS.SUBMIT}
        </button>
      </form>
    </div>
  );
}
