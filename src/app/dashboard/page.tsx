'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // 404 sayfasına yönlendir
    router.push('/not-found');
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Yönlendiriliyor...</p>
    </div>
  );
}

/*
function DashboardPage() {
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
          throw new Error('Blog yazıları yüklenirken bir hata oluştu');
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
        throw new Error('Blog yazıları yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a blog
  const deleteBlog = async (slug: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/blogs/${slug}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa('admin:emin123')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı silinirken bir hata oluştu');
      }

      setStatus({ message: 'Blog yazısı başarıyla silindi!', type: 'success' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
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
          'Authorization': `Basic ${btoa('admin:emin123')}`
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

      // Refresh blog list if we're in list view
      if (activeTab === 'list') {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
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
          Yeni Blog Yazısı
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('list')}
        >
          Blog Yazıları
        </button>
      </div>

      {status.message && (
        <div className={`${styles.statusMessage} ${styles[status.type || '']}`}>
          {status.message}
        </div>
      )}

      {activeTab === 'create' ? (
        <>
          <h1 className={styles.adminTitle}>Yeni Blog Yazısı Ekle</h1>
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
              Oluştur
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="date">Tarih (Otomatik oluşturulur)</label>
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
            Blog yazısı eklendiğinde otomatik olarak güncel tarih ve saat kullanılacaktır.
          </small>
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
          Blog Yazısını Yayınla
        </button>
      </form>
      </>
      ) : (
        <>
          <h1 className={styles.adminTitle}>Blog Yazıları</h1>

          {loading ? (
            <div className={styles.loading}>Yükleniyor...</div>
          ) : blogs.length === 0 ? (
            <div className={styles.emptyState}>
              Henüz blog yazısı bulunmuyor.
            </div>
          ) : (
            <div className={styles.blogList}>
              <table className={styles.blogTable}>
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Tarih</th>
                    <th>Kateqori</th>
                    <th>İşlemler</th>
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
                          Görüntüle
                        </Link>
                        <Link href={`/dashboard/edit/${blog.slug}`} className={styles.editButton}>
                          Düzenle
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
*/