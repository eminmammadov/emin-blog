'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';

// Notification tipi için arayüz
interface NotificationType {
  id: string;
  message: string;
  date: string;
  read: boolean;
  readAt?: number;
  slug: string;
}
import dynamic from 'next/dynamic';

// Admin sayfası için statik metinler
const ADMIN_TEXTS = {
  LOADING: {
    EDITOR: 'Editör yüklənir...',
    BLOGS: 'Yüklənir...'
  },
  TABS: {
    CREATE: 'Yeni Bloq Yaz',
    LIST: 'Bütün Bloqlar'
  },
  FORM: {
    TITLE: 'Yeni Bloq Yazısı Yaz',
    FIELDS: {
      TITLE: 'Başlıq',
      SLUG: 'Slug',
      GENERATE_SLUG: 'Yarad',
      DATE: 'Tarixçə (Avtomatik)',
      DATE_HELP: 'Blog yazısı əlavə edilərkən avtomatik olaraq o anki tarix və saat istifadə ediləcəkdir.',
      EXCERPT: 'Qısa Açıqlama',
      CATEGORIES: 'Kateqoriya (vergüllə ayırın)',
      AUTHOR: 'Yazan',
      CONTENT: 'Content (Markdown)',
      CONTENT_HELP: 'Markdown formatında yazın. Şəkil əlavə etmək üçün 🖼️ düyməsinə klikləyin. Link əlavə etmək üçün 🔗 düyməsini sıxın. Başlıqlar üçün # işarəsi istifadə edin.',
      CONTENT_PLACEHOLDER: 'Blog içeriğinizi Markdown formatında buraya yazın...',
      SCHEDULER: {
        LABEL: 'Yayınlama Zamanı',
        HELP: 'Blog yazısını belirli bir zamanda otomatik olarak yayınlamak için tarih ve saat seçin. Boş bırakırsanız, blog yazısı hemen yayınlanacaktır.',
        PLACEHOLDER: 'Tarih ve saat seçin',
        PUBLISH_NOW: 'Hemen Yayınla',
        SCHEDULE: 'Zamanla'
      },
      SUBMIT: 'Blog Yazısını Yayınla'
    }
  },
  BLOG_LIST: {
    TITLE: 'Bloq Yazıları',
    EMPTY: 'Bloq yazısı tapılmadı.',
    TABLE: {
      TITLE: 'Başlıq',
      DATE: 'Tarixçə',
      CATEGORY: 'Kateqoriya',
      ACTIONS: 'Əməliyyatlar'
    },
    ACTIONS: {
      VIEW: 'Bloqa Bax',
      EDIT: 'Düzəlt',
      DELETE: 'Sil'
    }
  },
  STATUS: {
    SENDING: 'Gönderiliyor...',
    SUCCESS_CREATE: 'Blog yazısı başarıyla oluşturuldu!',
    SUCCESS_DELETE: 'Blog yazısı başarıyla silindi!',
    ERROR_DEFAULT: 'Bir hata oluştu',
    ERROR_FETCH: 'Bloq yazıları yüklənərkən bir xəta baş verdi',
    ERROR_DELETE: 'Blog yazısı silinirken bir hata oluştu'
  },
  CONFIRM: {
    DELETE: 'Bu bloq yazısını silmek istediğinizden emin misiniz?'
  }
};

// Dinamik olarak import ediyoruz çünkü bu bileşen sadece client tarafında çalışabilir
const MarkdownEditor = dynamic(() => import('@/components/MarkdownEditor'), {
  ssr: false,
  loading: () => <div className={styles.loading}>{ADMIN_TEXTS.LOADING.EDITOR}</div>
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
    scheduledDate: '', // Yayınlanma zamanı
    publishNow: true, // Hemen yayınla
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
    if (activeTab === 'list') {
      fetchBlogs(); // Dışarıda tanımladığımız güncellenmiş fetchBlogs fonksiyonunu kullan
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
      // Cache'i devre dışı bırakmak için no-cache ve no-store parametrelerini ekleyelim
      const response = await fetch('/api/blogs', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(ADMIN_TEXTS.STATUS.ERROR_FETCH);
      }

      const data = await response.json();
      console.log('Fetched blogs:', data); // Gelen verileri kontrol edelim

      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        console.error('API did not return an array:', data);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a bloq
  const deleteBlog = async (slug: string) => {
    if (!confirm(ADMIN_TEXTS.CONFIRM.DELETE)) {
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
        throw new Error(data.error || ADMIN_TEXTS.STATUS.ERROR_DELETE);
      }

      // Blog silindikten sonra bildirimleri güncelle
      updateNotificationsAfterDelete(slug);

      // Önbelleği temizlemek için API'leri yeniden çağır
      try {
        console.log('Refreshing blog cache after deletion...');

        // Tüm blog API'lerini yeniden çağır
        const baseUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000'
          : process.env.NEXT_PUBLIC_SITE_URL || 'https://emin-blog.vercel.app';

        // API'leri çağır
        await fetch(`${baseUrl}/api/blogs/public`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });

        console.log('Blog cache refreshed successfully');
      } catch (refreshError) {
        console.error('Error refreshing blog cache:', refreshError);
      }

      setStatus({ message: ADMIN_TEXTS.STATUS.SUCCESS_DELETE, type: 'success' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting bloq:', error);
      setStatus({
        message: error instanceof Error ? error.message : ADMIN_TEXTS.STATUS.ERROR_DEFAULT,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Silinen blog yazısı için bildirimleri güncelle
  const updateNotificationsAfterDelete = (slug: string) => {
    try {
      // localStorage'dan mevcut bildirimleri al
      const storedNotificationsJSON = localStorage.getItem('notifications');
      if (!storedNotificationsJSON) return;

      const storedNotifications = JSON.parse(storedNotificationsJSON) as NotificationType[];

      // Silinen blog yazısına ait bildirimleri filtrele
      const updatedNotifications = storedNotifications.filter(
        (notification: NotificationType) => notification.slug !== slug && notification.id !== slug
      );

      console.log(`Removed notifications for deleted blog: ${slug}`);
      console.log('Updated notifications:', updatedNotifications);

      // Güncellenmiş bildirimleri localStorage'a kaydet
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

      // Eğer bildirim sayısı değiştiyse, kullanıcıya bildir
      if (updatedNotifications.length !== storedNotifications.length) {
        console.log(`Removed ${storedNotifications.length - updatedNotifications.length} notifications for deleted blog`);

        // Özel olay tetikle - NotificationSystem bileşeni bu olayı dinleyecek
        const event = new CustomEvent('blogDeleted', {
          detail: {
            slug,
            updatedNotifications
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error updating notifications after blog delete:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus({ message: ADMIN_TEXTS.STATUS.SENDING, type: 'info' });

      // Convert categories string to array
      const categoriesArray = formData.categories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat);

      // Zamanlama bilgisini hazırla
      let scheduledDateObj = null;
      let published = true;

      if (!formData.publishNow && formData.scheduledDate) {
        // Tarih string'ini Date nesnesine çevir
        const scheduledDate = new Date(formData.scheduledDate);

        // Tarih geçerli mi kontrol et
        const timestamp = scheduledDate.getTime();
        if (Number.isNaN(timestamp)) {
          throw new Error('Geçersiz tarih formatı. Lütfen geçerli bir tarih seçin.');
        }

        // Şu anki zamandan sonra mı kontrol et
        const now = new Date();
        if (scheduledDate <= now) {
          throw new Error('Zamanlanmış tarih, şu anki zamandan sonra olmalıdır.');
        }

        // Zamanlanmış tarihi ISO string formatında gönder
        scheduledDateObj = scheduledDate.toISOString();
        console.log(`Scheduling blog "${formData.title}" for: ${scheduledDateObj}`);

        published = false; // Zamanlanmış blog yazısı başlangıçta yayınlanmamış olacak
      }

      const response = await fetch('/api/blogs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('eminx:0xAdmin#321')}`
        },
        body: JSON.stringify({
          ...formData,
          categories: categoriesArray,
          scheduledDate: scheduledDateObj,
          published: published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || ADMIN_TEXTS.STATUS.ERROR_DEFAULT);
      }

      setStatus({ message: ADMIN_TEXTS.STATUS.SUCCESS_CREATE, type: 'success' });

      // Reset form after successful submission
      setFormData({
        title: '',
        slug: '',
        date: formatDate(),
        excerpt: '',
        content: '',
        categories: '',
        author: 'Emin Mammadov',
        scheduledDate: '',
        publishNow: true,
      });

      // Refresh bloq list if we're in list view
      if (activeTab === 'list') {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating bloq:', error);
      setStatus({
        message: error instanceof Error ? error.message : ADMIN_TEXTS.STATUS.ERROR_DEFAULT,
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
          {ADMIN_TEXTS.TABS.CREATE}
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('list')}
        >
          {ADMIN_TEXTS.TABS.LIST}
        </button>
      </div>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type || '']}`}>
          {status.message}
        </div>
      )}

      {activeTab === 'create' ? (
        <>
          <h1 className={styles.adminTitle}>{ADMIN_TEXTS.FORM.TITLE}</h1>
          <form onSubmit={handleSubmit} className={styles.blogForm}>
        <div className={styles.formGroup}>
          <label htmlFor="title">{ADMIN_TEXTS.FORM.FIELDS.TITLE}</label>
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
            <label htmlFor="slug">{ADMIN_TEXTS.FORM.FIELDS.SLUG}</label>
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
                {ADMIN_TEXTS.FORM.FIELDS.GENERATE_SLUG}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">{ADMIN_TEXTS.FORM.FIELDS.DATE}</label>
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
              {ADMIN_TEXTS.FORM.FIELDS.DATE_HELP}
            </small>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="excerpt">{ADMIN_TEXTS.FORM.FIELDS.EXCERPT}</label>
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
            <label htmlFor="categories">{ADMIN_TEXTS.FORM.FIELDS.CATEGORIES}</label>
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
            <label htmlFor="author">{ADMIN_TEXTS.FORM.FIELDS.AUTHOR}</label>
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
          <label htmlFor="content">{ADMIN_TEXTS.FORM.FIELDS.CONTENT}</label>
          <MarkdownEditor
            value={formData.content}
            onChange={handleEditorChange}
            placeholder={ADMIN_TEXTS.FORM.FIELDS.CONTENT_PLACEHOLDER}
          />
          <small className={styles.helpText}>
            {ADMIN_TEXTS.FORM.FIELDS.CONTENT_HELP}
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="schedulerOptions">{ADMIN_TEXTS.FORM.FIELDS.SCHEDULER.LABEL}</label>
          <div id="schedulerOptions" className={styles.schedulerContainer}>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="publishNow"
                  checked={formData.publishNow}
                  onChange={() => setFormData(prev => ({ ...prev, publishNow: true }))}
                />
                {ADMIN_TEXTS.FORM.FIELDS.SCHEDULER.PUBLISH_NOW}
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="publishNow"
                  checked={!formData.publishNow}
                  onChange={() => setFormData(prev => ({ ...prev, publishNow: false }))}
                />
                {ADMIN_TEXTS.FORM.FIELDS.SCHEDULER.SCHEDULE}
              </label>
            </div>
            {!formData.publishNow && (
              <input
                type="datetime-local"
                id="scheduledDate"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className={styles.dateTimeInput}
                placeholder={ADMIN_TEXTS.FORM.FIELDS.SCHEDULER.PLACEHOLDER}
                min={new Date().toISOString().slice(0, 16)}
              />
            )}
          </div>
          <small className={styles.helpText}>
            {ADMIN_TEXTS.FORM.FIELDS.SCHEDULER.HELP}
          </small>
        </div>

        <button type="submit" className={styles.submitButton}>
          {ADMIN_TEXTS.FORM.FIELDS.SUBMIT}
        </button>
      </form>
      </>
      ) : (
        <>
          <h1 className={styles.adminTitle}>{ADMIN_TEXTS.BLOG_LIST.TITLE}</h1>

          {loading ? (
            <div className={styles.loading}>{ADMIN_TEXTS.LOADING.BLOGS}</div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              {ADMIN_TEXTS.BLOG_LIST.EMPTY}
            </div>
          ) : (
            <div className={styles.blogList}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    <th>{ADMIN_TEXTS.BLOG_LIST.TABLE.TITLE}</th>
                    <th>{ADMIN_TEXTS.BLOG_LIST.TABLE.DATE}</th>
                    <th>{ADMIN_TEXTS.BLOG_LIST.TABLE.CATEGORY}</th>
                    <th>Durum</th>
                    <th>{ADMIN_TEXTS.BLOG_LIST.TABLE.ACTIONS}</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => {
                    // Zamanlanmış blog yazısı için durum bilgisi
                    const isScheduled = blog.scheduledDate && !blog.published;
                    const scheduledDate = isScheduled && blog.scheduledDate ? new Date(blog.scheduledDate as string | Date) : null;
                    const isScheduledInFuture = scheduledDate && scheduledDate > new Date();

                    return (
                      <tr key={blog.slug || blog._id}>
                        <td>{blog.title || 'Başlıksız'}</td>
                        <td>{blog.date || 'Tarih yok'}</td>
                        <td>{blog.category || (blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Kategori yok')}</td>
                        <td>
                          {isScheduled ? (
                            <span className={styles.scheduledStatus}>
                              {isScheduledInFuture ? (
                                <>
                                  Zamanlandı: {scheduledDate?.toLocaleDateString()} {scheduledDate?.toLocaleTimeString()}
                                </>
                              ) : (
                                <>Zamanı geçmiş</>
                              )}
                            </span>
                          ) : (
                            <span className={styles.publishedStatus}>Yayında</span>
                          )}
                        </td>
                        <td className={styles.actions}>
                          {blog.published && (
                            <Link href={`/blog/${blog.slug}`} target="_blank" className={styles.viewButton}>
                              {ADMIN_TEXTS.BLOG_LIST.ACTIONS.VIEW}
                            </Link>
                          )}
                          <Link href={`/a/0x/admin/edit/${blog.slug}`} className={styles.editButton}>
                            {ADMIN_TEXTS.BLOG_LIST.ACTIONS.EDIT}
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteBlog(blog.slug)}
                            className={styles.deleteButton}
                          >
                            {ADMIN_TEXTS.BLOG_LIST.ACTIONS.DELETE}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
