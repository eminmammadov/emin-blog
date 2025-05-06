'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, CheckCheck } from 'lucide-react';
import styles from './NotificationSystem.module.css';

// NotificationSystem bileşeni için statik metinler
const NOTIFICATION_TEXTS = {
  BUTTON: {
    ARIA_LABEL: 'Bildirimlər',
    TITLE: 'Bildirimlər'
  },
  DROPDOWN: {
    HEADER: 'Bildirimlər',
    NO_NOTIFICATIONS: 'Bloq yazısı yoxdur',
    NEW_LABEL: 'Yeni: ',
    MARK_ALL_READ: 'Oxundu işarələ',
    MARKED_READ: 'Oxundu',
    VIEW_ALL: 'Bütün blog yazılarını göstər'
  },
  DATE_FORMAT: {
    LAST_POST: 'Son paylaşım',
    MINUTES_AGO: '{minutes} dakika önce',
    HOURS_AGO: '{hours} saat önce'
  }
};

// Define blog post type
export type BlogPostType = {
  _id?: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  author?: string;
  readingTime?: string;
  category?: string;
  categories?: string[];
};

// Define notification type
export type NotificationType = {
  id: string;
  message: string;
  date: string;
  read: boolean;
  readAt?: number; // Okunma zamanı (timestamp)
  slug: string;
};

interface NotificationSystemProps {
  className?: string;
}

export default function NotificationSystem({ className }: NotificationSystemProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [areAllNotificationsRead, setAreAllNotificationsRead] = useState(true); // Gerçek okunma durumu için
  const router = useRouter();

  // Eski bildirimleri temizleme fonksiyonu
  const cleanupOldNotifications = useCallback(() => {
    try {
      // localStorage'dan mevcut bildirimleri al
      const storedNotificationsJSON = localStorage.getItem('notifications');
      if (!storedNotificationsJSON) return;

      const storedNotifications = JSON.parse(storedNotificationsJSON) as NotificationType[];
      const currentTime = Date.now();
      const oneHourInMs = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

      // 1. Okunmuş ve 1 saatten eski bildirimleri filtrele
      // 2. Geçersiz blog yazılarına ait bildirimleri filtrele (API'den kontrol et)
      const filteredNotifications = storedNotifications.filter((notification) => {
        // Okunmamış bildirimler kalsın
        if (!notification.read) return true;

        // Okunma zamanı yoksa kalsın
        if (!notification.readAt) return true;

        // Okunma zamanından bu yana 1 saatten az geçtiyse kalsın
        return (currentTime - notification.readAt) < oneHourInMs;
      });

      // Eğer bildirim sayısı değiştiyse, localStorage'ı güncelle
      if (filteredNotifications.length !== storedNotifications.length) {
        console.log(`Cleanup: Removed ${storedNotifications.length - filteredNotifications.length} old notifications`);
        localStorage.setItem('notifications', JSON.stringify(filteredNotifications));

        // Eğer bileşen yüklendiyse, state'i de güncelle
        setNotifications(filteredNotifications);

        // Okunmamış bildirim var mı kontrol et
        const hasUnread = filteredNotifications.some(notification => !notification.read);
        setHasUnreadNotifications(hasUnread);

        // Tüm bildirimlerin okunma durumunu kontrol et
        const allRead = filteredNotifications.every(notification => notification.read);
        setAreAllNotificationsRead(allRead);
      }
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      console.log('Formatting date:', dateString);

      // Eğer tarih string değilse veya boşsa, son paylaşım tarihi olarak göster
      if (!dateString || typeof dateString !== 'string') {
        console.log('Invalid date string:', dateString);
        return NOTIFICATION_TEXTS.DATE_FORMAT.LAST_POST;
      }

      // Eğer tarih zaten "YYYY.MM.DD - HH:MM AM/PM" formatındaysa, doğrudan kullan
      if (dateString.includes(' - ') && (dateString.includes('AM') || dateString.includes('PM'))) {
        console.log('Already formatted date detected, using as is');
        return dateString;
      }

      // MongoDB'den gelen ISODate formatını kontrol et
      if (dateString.includes('T') && dateString.includes('Z')) {
        console.log('ISO date format detected');

        // ISO formatını ayrıştır
        const date = new Date(dateString);

        // Geçerli bir tarih değilse veya NaN ise, son paylaşım tarihi olarak göster
        if (Number.isNaN(date.getTime())) {
          console.log('Invalid ISO date (NaN)');
          return NOTIFICATION_TEXTS.DATE_FORMAT.LAST_POST;
        }

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        console.log('Hours difference:', diffHours);

        // 24 saat içinde paylaşıldıysa, "X saat önce" veya "X dakika önce" göster
        if (diffHours < 24) {
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const result = NOTIFICATION_TEXTS.DATE_FORMAT.MINUTES_AGO.replace('{minutes}', diffMinutes.toString());
            console.log('Formatted as minutes ago:', result);
            return result;
          }
          const result = NOTIFICATION_TEXTS.DATE_FORMAT.HOURS_AGO.replace('{hours}', diffHours.toString());
          console.log('Formatted as hours ago:', result);
          return result;
        }

        // 24 saatten daha önce paylaşıldıysa, tam tarih ve saat göster
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        // Saat ve dakika
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // 12 saat formatı

        const result = `${day}.${month}.${year} - ${formattedHours}:${minutes} ${ampm}`;
        console.log('Formatted as full date:', result);
        return result;
      }

      // Diğer formatlar için, doğrudan tarihi göster
      console.log('Using date string as is');
      return dateString;
    } catch (error) {
      console.error('Date formatting error:', error);
      return NOTIFICATION_TEXTS.DATE_FORMAT.LAST_POST;
    }
  }, []);

  // Fetch blog posts and create notifications
  const fetchBlogPosts = useCallback(async () => {
    try {
      // Fetch blog posts from API with cache disabled
      const response = await fetch('/api/blogs', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const blogPosts = await response.json();
      console.log('Fetched blog posts:', blogPosts);

      // Get stored notifications
      const storedNotificationsJSON = localStorage.getItem('notifications');
      let storedNotifications: NotificationType[] = [];

      if (storedNotificationsJSON) {
        try {
          storedNotifications = JSON.parse(storedNotificationsJSON);
          console.log('Stored notifications:', storedNotifications);
        } catch (error) {
          console.error('Error parsing stored notifications:', error);
        }
      }

      // Mevcut bildirimlerdeki ID'leri al
      const existingNotificationIds = storedNotifications.map(notification => notification.id);
      console.log('Existing notification IDs:', existingNotificationIds);

      // Son ziyaret zamanını al
      const lastVisit = localStorage.getItem('lastVisit') || '0';
      const lastVisitDate = new Date(Number.parseInt(lastVisit, 10));
      console.log('Last visit date:', lastVisitDate.toISOString());

      // Yeni blog yazılarını tespit et (ID'si mevcut bildirimlerde olmayan veya son ziyaretten sonra yayınlanan)
      const newPosts = blogPosts.filter((post: BlogPostType) => {
        const postId = post._id || post.slug;
        const postDate = new Date(post.date);

        // ID mevcut bildirimlerde yoksa VEYA son ziyaretten sonra yayınlanmışsa
        const isNew = !existingNotificationIds.includes(postId) || postDate > lastVisitDate;

        if (isNew) {
          console.log(`New post detected: ${post.title}, date: ${post.date}, id: ${postId}`);
        }

        return isNew;
      });

      console.log('New posts since last visit:', newPosts);

      // Create notifications for new posts
      const newNotifications = newPosts.map((post: BlogPostType) => ({
        id: post._id || post.slug,
        message: post.title,
        date: formatDate(post.date),
        read: false, // Yeni bildirimler okunmamış olarak işaretlenir
        slug: post.slug
      }));

      // Combine existing and new notifications
      const updatedNotifications = [...newNotifications, ...storedNotifications];

      // Limit to 5 notifications
      const limitedNotifications = updatedNotifications.slice(0, 5);

      setNotifications(limitedNotifications);

      // Check if there are any unread notifications
      const unreadExists = limitedNotifications.some(notification => !notification.read);
      setHasUnreadNotifications(unreadExists);

      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(limitedNotifications));

      // Yeni bildirimler oluşturulduktan sonra son ziyaret zamanını güncelle
      // Sadece yeni blog yazısı varsa son ziyaret zamanını güncelle
      if (newPosts.length > 0) {
        localStorage.setItem('lastVisit', Date.now().toString());
        console.log('Updated last visit time:', new Date().toISOString());
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to stored notifications
      const storedNotifications = localStorage.getItem('notifications');

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications.slice(0, 5)); // Limit to 5

        // Check if there are any unread notifications
        const unreadExists = parsedNotifications.some((notification: NotificationType) => !notification.read);
        setHasUnreadNotifications(unreadExists);
      } else {
        // Blog yazısı yoksa boş bildirim listesi göster
        setNotifications([]);
        setHasUnreadNotifications(false);
        localStorage.setItem('notifications', JSON.stringify([]));
      }
    }
  }, [formatDate]);

  // Fetch notifications and blog posts on component mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Daha önce okunmuş bildirimleri localStorage'dan al
      const readNotificationsJSON = localStorage.getItem('readNotifications');
      let readNotifications: Record<string, number> = {}; // ID -> okunma zamanı (timestamp)

      if (readNotificationsJSON) {
        try {
          // Eski format (string[]) veya yeni format (Record<string, number>) olabilir
          const parsed = JSON.parse(readNotificationsJSON);

          if (Array.isArray(parsed)) {
            // Eski format: string[] -> Record<string, number> dönüşümü
            console.log('Converting old readNotifications format to new format');
            for (const id of parsed) {
              readNotifications[id] = Date.now(); // Şu anki zamanı kullan
            }
            // Yeni formatı localStorage'a kaydet
            localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
          } else {
            // Yeni format: Record<string, number>
            readNotifications = parsed;
          }

          console.log('Read notifications loaded from localStorage:', readNotifications);
        } catch (error) {
          console.error('Error parsing read notifications from localStorage:', error);
        }
      }

      // Sayfa yüklendiğinde eski bildirimleri temizle
      cleanupOldNotifications();

      // Doğrudan API'den blog yazılarını al
      const fetchDirectFromAPI = async () => {
        try {
          // Cache'i devre dışı bırakmak için no-cache ve no-store parametrelerini ekleyelim
          const response = await fetch('/api/blogs', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          });

          if (response.ok) {
            const blogPosts = await response.json();
            console.log('API response blog posts:', blogPosts);

            // Get stored notifications
            const storedNotificationsJSON = localStorage.getItem('notifications');
            let storedNotifications: NotificationType[] = [];

            if (storedNotificationsJSON) {
              try {
                storedNotifications = JSON.parse(storedNotificationsJSON);
                console.log('Stored notifications:', storedNotifications);
              } catch (error) {
                console.error('Error parsing stored notifications:', error);
              }
            }

            // Mevcut bildirimlerdeki ID'leri al
            const existingNotificationIds = storedNotifications.map(notification => notification.id);
            console.log('Existing notification IDs:', existingNotificationIds);

            // Son ziyaret zamanını al
            const lastVisit = localStorage.getItem('lastVisit') || '0';
            const lastVisitDate = new Date(Number.parseInt(lastVisit, 10));
            console.log('Last visit date:', lastVisitDate.toISOString());

            // Yeni blog yazılarını tespit et (ID'si mevcut bildirimlerde olmayan veya son ziyaretten sonra yayınlanan)
            const newPosts = blogPosts.filter((post: BlogPostType) => {
              const postId = post._id || post.slug;
              const postDate = new Date(post.date);

              // ID mevcut bildirimlerde yoksa VEYA son ziyaretten sonra yayınlanmışsa
              const isNew = !existingNotificationIds.includes(postId) || postDate > lastVisitDate;

              if (isNew) {
                console.log(`New post detected: ${post.title}, date: ${post.date}, id: ${postId}`);
              }

              return isNew;
            });

            console.log('New posts detected:', newPosts.length);

            // Yeni blog yazıları için bildirimler oluştur
            const newNotifications = newPosts.map((post: BlogPostType) => {
              const postId = post._id || post.slug;
              return {
                id: postId,
                message: post.title,
                date: formatDate(post.date),
                read: false, // Yeni bildirimler okunmamış olarak işaretlenir
                slug: post.slug
              };
            });

            // Mevcut bildirimlerle yeni bildirimleri birleştir
            const combinedNotifications = [...newNotifications, ...storedNotifications];

            // Okunmuş bildirimleri işaretle
            const updatedNotifications = combinedNotifications.map(notification => {
              const isRead = notification.id in readNotifications;
              return {
                ...notification,
                read: isRead,
                readAt: isRead ? readNotifications[notification.id] : undefined
              };
            });

            // Okunmuş ve 1 saatten eski bildirimleri filtrele
            const currentTime = Date.now();
            const oneHourInMs = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

            const filteredNotifications = updatedNotifications.filter((notification: NotificationType) => {
              // Okunmamış bildirimler kalsın
              if (!notification.read) return true;

              // Okunma zamanı yoksa kalsın
              if (!notification.readAt) return true;

              // Okunma zamanından bu yana 1 saatten az geçtiyse kalsın
              return (currentTime - notification.readAt) < oneHourInMs;
            });

            // En fazla 5 bildirim göster
            const limitedNotifications = filteredNotifications.slice(0, 5);

            console.log('Final notifications:', limitedNotifications);

            // Okunmamış bildirim var mı kontrol et
            const hasUnread = limitedNotifications.some((notification: NotificationType) => !notification.read);

            setNotifications(limitedNotifications);
            setHasUnreadNotifications(hasUnread);
            localStorage.setItem('notifications', JSON.stringify(limitedNotifications));

            // Tüm bildirimlerin okunma durumunu kontrol et
            const allRead = limitedNotifications.every(notification => notification.read);
            setAreAllNotificationsRead(allRead);

            // Son ziyaret zamanını güncelle (sadece bildirimler işlendikten sonra)
            if (newPosts.length > 0) {
              console.log('Updating last visit time due to new posts');
              localStorage.setItem('lastVisit', Date.now().toString());
            }

            return;
          }

          // API çağrısı başarısız olursa, normal fetchBlogPosts fonksiyonunu çağır
          fetchBlogPosts();
        } catch (error) {
          console.error('Error fetching blogs directly from API:', error);
          // Hata durumunda normal fetchBlogPosts fonksiyonunu çağır
          fetchBlogPosts();
        }
      };

      fetchDirectFromAPI();
    }
  }, [fetchBlogPosts, formatDate, cleanupOldNotifications]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const notificationContainer = document.querySelector(`.${styles.notificationContainer}`);

      if (notificationContainer && !notificationContainer.contains(target) && isNotificationOpen) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Okunmuş bildirimleri 1 saat sonra kaldır
  useEffect(() => {
    // Sayfa yüklendiğinde hemen bir kez çalıştır
    cleanupOldNotifications();

    // Her 1 dakikada bir kontrol et (daha sık kontrol edelim)
    const checkInterval = setInterval(() => {
      cleanupOldNotifications();
    }, 60 * 1000); // 1 dakikada bir kontrol et

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(checkInterval);
  }, [cleanupOldNotifications]);

  // Bildirimlerin okunma durumunu kontrol et
  useEffect(() => {
    // Bildirim yoksa, tümü okunmuş kabul et
    if (notifications.length === 0) {
      setAreAllNotificationsRead(true);
      return;
    }

    // Tüm bildirimlerin okunma durumunu kontrol et
    const allRead = notifications.every(notification => notification.read);
    setAreAllNotificationsRead(allRead);
  }, [notifications]);

  // Blog silme olayını dinle
  useEffect(() => {
    // Blog silme olayını işleyen fonksiyon
    const handleBlogDeleted = (event: CustomEvent) => {
      const { slug, updatedNotifications } = event.detail;
      console.log(`Blog deleted event received for slug: ${slug}`);

      // Bildirimleri güncelle
      setNotifications(updatedNotifications);

      // Okunmamış bildirim var mı kontrol et
      const hasUnread = updatedNotifications.some((notification: NotificationType) => !notification.read);
      setHasUnreadNotifications(hasUnread);

      // Tüm bildirimlerin okunma durumunu kontrol et
      const allRead = updatedNotifications.every((notification: NotificationType) => notification.read);
      setAreAllNotificationsRead(allRead);

      // Eski bildirimleri temizle
      cleanupOldNotifications();
    };

    // Olayı dinle
    window.addEventListener('blogDeleted', handleBlogDeleted as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('blogDeleted', handleBlogDeleted as EventListener);
    };
  }, [cleanupOldNotifications]);

  // Toggle notification dropdown
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const currentTime = Date.now();

    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
      readAt: currentTime // Tüm bildirimlere okunma zamanı ekle
    }));

    setNotifications(updatedNotifications);
    setHasUnreadNotifications(false);
    setAreAllNotificationsRead(true); // Tüm bildirimlerin okundu olarak işaretlendiğini belirt

    // Update notifications in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Kalıcı olarak tüm bildirimleri okundu olarak işaretle
    const readNotificationsJSON = localStorage.getItem('readNotifications');
    let readNotifications: Record<string, number> = {};

    if (readNotificationsJSON) {
      try {
        // Eski format (string[]) veya yeni format (Record<string, number>) olabilir
        const parsed = JSON.parse(readNotificationsJSON);

        if (Array.isArray(parsed)) {
          // Eski format: string[] -> Record<string, number> dönüşümü
          console.log('Converting old readNotifications format to new format');
          for (const id of parsed) {
            readNotifications[id] = currentTime; // Şu anki zamanı kullan
          }
        } else {
          // Yeni format: Record<string, number>
          readNotifications = parsed;
        }
      } catch (error) {
        console.error('Error parsing read notifications:', error);
      }
    }

    // Tüm bildirimleri okundu olarak işaretle
    for (const notification of notifications) {
      readNotifications[notification.id] = currentTime;
    }

    // localStorage'ı güncelle
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    console.log('All notifications marked as read permanently');
  };

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    const currentTime = Date.now();

    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? {
        ...notification,
        read: true,
        readAt: currentTime // Okunma zamanını ekle
      } : notification
    );

    setNotifications(updatedNotifications);

    // Check if there are any unread notifications left
    const unreadExists = updatedNotifications.some(notification => !notification.read);
    setHasUnreadNotifications(unreadExists);

    // Tüm bildirimlerin okunma durumunu kontrol et
    const allRead = updatedNotifications.every(notification => notification.read);
    setAreAllNotificationsRead(allRead);

    // Update notifications in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Kalıcı olarak okunmuş bildirimleri sakla
    const readNotificationsJSON = localStorage.getItem('readNotifications');
    let readNotifications: Record<string, number> = {};

    if (readNotificationsJSON) {
      try {
        // Eski format (string[]) veya yeni format (Record<string, number>) olabilir
        const parsed = JSON.parse(readNotificationsJSON);

        if (Array.isArray(parsed)) {
          // Eski format: string[] -> Record<string, number> dönüşümü
          console.log('Converting old readNotifications format to new format');
          for (const oldId of parsed) {
            readNotifications[oldId] = currentTime; // Şu anki zamanı kullan
          }
        } else {
          // Yeni format: Record<string, number>
          readNotifications = parsed;
        }
      } catch (error) {
        console.error('Error parsing read notifications:', error);
      }
    }

    // Bildirimi okundu olarak işaretle ve okunma zamanını kaydet
    readNotifications[id] = currentTime;
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
    console.log(`Notification ${id} marked as read permanently at ${new Date(currentTime).toLocaleString()}`);
  };

  // Handle notification click
  const handleNotificationClick = (notification: NotificationType) => {
    // Mark the notification as read
    markAsRead(notification.id);

    // Close the notification dropdown
    setIsNotificationOpen(false);

    // Navigate to the blog post
    router.push(`/blog/${notification.slug}`);
  };

  return (
    <div className={`${styles.notificationContainer} ${className || ''}`}>
      <button
        type="button"
        className={`${styles.notificationButton} ${isNotificationOpen ? styles.notificationButtonActive : ''}`}
        onClick={toggleNotification}
        aria-label={NOTIFICATION_TEXTS.BUTTON.ARIA_LABEL}
      >
        {hasUnreadNotifications && <span className={styles.notificationDot} />}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{NOTIFICATION_TEXTS.BUTTON.TITLE}</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {/* Notification Dropdown */}
      <div className={`${styles.notificationDropdown} ${isNotificationOpen ? styles.notificationDropdownOpen : ''}`}>
        <div className={styles.notificationHeader}>
          <h3 className={styles.notificationTitle}>{NOTIFICATION_TEXTS.DROPDOWN.HEADER}</h3>
          <button
            type="button"
            className={styles.markAsReadButton}
            onClick={markAllAsRead}
          >
            {areAllNotificationsRead ? (
              <CheckCheck size={16} style={{ marginRight: '4px' }} />
            ) : (
              <Check size={16} style={{ marginRight: '4px' }} />
            )}
            {areAllNotificationsRead ? NOTIFICATION_TEXTS.DROPDOWN.MARKED_READ : NOTIFICATION_TEXTS.DROPDOWN.MARK_ALL_READ}
          </button>
        </div>

        <div className={styles.notificationList}>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              {NOTIFICATION_TEXTS.DROPDOWN.NO_NOTIFICATIONS}
            </div>
          ) : (
            notifications.map((notification) => (
              <button
                type="button"
                key={notification.id}
                className={styles.notificationItem}
                onClick={() => handleNotificationClick(notification)}
                style={{ cursor: 'pointer', width: '100%', textAlign: 'left', border: 'none', background: 'none', padding: '12px 16px' }}
              >
                {!notification.read && <div className={styles.notificationDotIndicator} />}
                <div className={styles.notificationContent}>
                  <p className={styles.notificationText}>
                    <span style={{ fontWeight: 'normal' }}
                    className={styles.newTxt}>{NOTIFICATION_TEXTS.DROPDOWN.NEW_LABEL}</span>
                    {notification.message}
                  </p>
                  <p className={styles.notificationDate}>
                    {notification.date || NOTIFICATION_TEXTS.DATE_FORMAT.LAST_POST}
                  </p>
                </div>

              </button>
            ))
          )}
        </div>

        <Link href="/blog" className={styles.viewAllLink} onClick={() => setIsNotificationOpen(false)}>
          {NOTIFICATION_TEXTS.DROPDOWN.VIEW_ALL}
        </Link>
      </div>
    </div>
  );
}