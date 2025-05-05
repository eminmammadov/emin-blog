'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './NotificationSystem.module.css';

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
  const router = useRouter();

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    try {
      console.log('Formatting date:', dateString);

      // Eğer tarih string değilse veya boşsa, son paylaşım tarihi olarak göster
      if (!dateString || typeof dateString !== 'string') {
        console.log('Invalid date string:', dateString);
        return 'Son paylaşım';
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
          return 'Son paylaşım';
        }

        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        console.log('Hours difference:', diffHours);

        // 24 saat içinde paylaşıldıysa, "X saat önce" veya "X dakika önce" göster
        if (diffHours < 24) {
          if (diffHours === 0) {
            const diffMinutes = Math.floor(diffTime / (1000 * 60));
            const result = `${diffMinutes} dakika önce`;
            console.log('Formatted as minutes ago:', result);
            return result;
          }
          const result = `${diffHours} saat önce`;
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
      return 'Son paylaşım';
    }
  }, []);

  // Fetch blog posts and create notifications
  const fetchBlogPosts = useCallback(async () => {
    try {
      // Fetch blog posts from API
      const response = await fetch('/api/blogs');

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const blogPosts = await response.json();
      console.log('Fetched blog posts:', blogPosts);

      // Get stored notifications
      const storedNotifications = localStorage.getItem('notifications');
      let currentNotifications: NotificationType[] = [];

      if (storedNotifications) {
        currentNotifications = JSON.parse(storedNotifications);
      }

      // Create new notifications for new blog posts
      const lastVisit = localStorage.getItem('lastVisit') || '0';
      const lastVisitDate = new Date(Number.parseInt(lastVisit, 10));

      // Update last visit time
      localStorage.setItem('lastVisit', Date.now().toString());

      // Filter blog posts that were published after the last visit
      const newPosts = blogPosts.filter((post: BlogPostType) => {
        // Handle both MongoDB date format and string date format
        const postDate = new Date(post.date);
        return postDate > lastVisitDate;
      });

      console.log('New posts since last visit:', newPosts);

      // Create notifications for new posts
      const newNotifications = newPosts.map((post: BlogPostType) => ({
        id: post._id || post.slug,
        message: post.title,
        date: formatDate(post.date),
        read: false,
        slug: post.slug
      }));

      // Combine existing and new notifications
      const updatedNotifications = [...newNotifications, ...currentNotifications];

      // Limit to 5 notifications
      const limitedNotifications = updatedNotifications.slice(0, 5);

      setNotifications(limitedNotifications);

      // Check if there are any unread notifications
      const unreadExists = limitedNotifications.some(notification => !notification.read);
      setHasUnreadNotifications(unreadExists);

      // Save to localStorage
      localStorage.setItem('notifications', JSON.stringify(limitedNotifications));
    } catch (error) {
      console.error('Error fetching blog posts:', error);

      // Try to get blog posts from MDX files if MongoDB fetch fails
      try {
        // Fallback to fetch from a different endpoint that gets MDX files
        const mdxResponse = await fetch('/api/mdx-blogs');

        if (!mdxResponse.ok) {
          throw new Error(`MDX API error: ${mdxResponse.status}`);
        }

        const mdxBlogPosts = await mdxResponse.json();
        console.log('Fetched MDX blog posts:', mdxBlogPosts);

        // Get stored notifications
        const storedNotifications = localStorage.getItem('notifications');
        let currentNotifications: NotificationType[] = [];

        if (storedNotifications) {
          currentNotifications = JSON.parse(storedNotifications);
        }

        // Create new notifications for new blog posts
        const lastVisit = localStorage.getItem('lastVisit') || '0';
        const lastVisitDate = new Date(Number.parseInt(lastVisit, 10));

        // Update last visit time
        localStorage.setItem('lastVisit', Date.now().toString());

        // Filter blog posts that were published after the last visit
        const newPosts = mdxBlogPosts.filter((post: BlogPostType) => {
          const postDate = new Date(post.date);
          return postDate > lastVisitDate;
        });

        // Create notifications for new posts
        const newNotifications = newPosts.map((post: BlogPostType) => ({
          id: post.slug,
          message: post.title,
          date: formatDate(post.date),
          read: false,
          slug: post.slug
        }));

        // Combine existing and new notifications
        const updatedNotifications = [...newNotifications, ...currentNotifications];

        // Limit to 5 notifications
        const limitedNotifications = updatedNotifications.slice(0, 5);

        setNotifications(limitedNotifications);

        // Check if there are any unread notifications
        const unreadExists = limitedNotifications.some(notification => !notification.read);
        setHasUnreadNotifications(unreadExists);

        // Save to localStorage
        localStorage.setItem('notifications', JSON.stringify(limitedNotifications));
      } catch (mdxError) {
        console.error('Error fetching MDX blog posts:', mdxError);

        // Fallback to stored notifications or demo notifications
        const storedNotifications = localStorage.getItem('notifications');

        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          setNotifications(parsedNotifications.slice(0, 5)); // Limit to 5

          // Check if there are any unread notifications
          const unreadExists = parsedNotifications.some((notification: NotificationType) => !notification.read);
          setHasUnreadNotifications(unreadExists);
        } else {
          // Veritabanından blog yazılarını alamadık, bu yüzden API'den tekrar deniyoruz
          try {
            const response = await fetch('/api/blogs');
            if (response.ok) {
              const blogPosts = await response.json();
              // En son 5 blog yazısını al
              const latestPosts = blogPosts.slice(0, 5);

              // Blog yazılarından bildirimler oluştur
              const blogNotifications = latestPosts.map((post: BlogPostType) => ({
                id: post._id || post.slug,
                message: post.title,
                date: formatDate(post.date),
                read: false,
                slug: post.slug
              }));

              setNotifications(blogNotifications);
              setHasUnreadNotifications(true);
              localStorage.setItem('notifications', JSON.stringify(blogNotifications));
              return;
            }
          } catch (error) {
            console.error('Error fetching blogs for notifications:', error);
          }

          // Blog yazısı yoksa boş bildirim listesi göster
          setNotifications([]);
          setHasUnreadNotifications(false);
          localStorage.setItem('notifications', JSON.stringify([]));
        }
      }
    }
  }, [formatDate]);

  // Fetch notifications and blog posts on component mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Doğrudan API'den blog yazılarını al
      const fetchDirectFromAPI = async () => {
        try {
          const response = await fetch('/api/blogs');
          if (response.ok) {
            const blogPosts = await response.json();
            console.log('API response blog posts:', blogPosts);

            // En son 5 blog yazısını al
            const latestPosts = blogPosts.slice(0, 5);
            console.log('Latest 5 posts:', latestPosts);

            // Blog yazılarının tarih formatını kontrol et
            latestPosts.forEach((post: BlogPostType, index: number) => {
              console.log(`Post ${index} date:`, post.date, 'Type:', typeof post.date);
            });

            // Daha önce okunmuş bildirimleri localStorage'dan al
            const readNotificationsJSON = localStorage.getItem('readNotifications');
            let readNotifications: string[] = [];

            if (readNotificationsJSON) {
              try {
                readNotifications = JSON.parse(readNotificationsJSON);
                console.log('Read notifications loaded from localStorage:', readNotifications);
              } catch (error) {
                console.error('Error parsing read notifications from localStorage:', error);
              }
            }

            // Blog yazılarından bildirimler oluştur
            const blogNotifications = latestPosts.map((post: BlogPostType) => {
              const postId = post._id || post.slug;
              // Daha önce okunmuş mu kontrol et
              const isRead = readNotifications.includes(postId);

              console.log(`Creating notification for post: ${post.title}, using date: ${post.date}, read: ${isRead}`);

              // Eğer okunmuşsa, okunma zamanını ekle (localStorage'dan alınamıyorsa şu anki zamanı kullan)
              let readAt: number | undefined = undefined;
              if (isRead) {
                // Daha önce kaydedilmiş bildirimleri kontrol et
                const oldNotificationsJSON = localStorage.getItem('notifications');
                if (oldNotificationsJSON) {
                  try {
                    const oldNotifications = JSON.parse(oldNotificationsJSON);
                    const oldNotification = oldNotifications.find((n: NotificationType) => n.id === postId);
                    if (oldNotification?.readAt) {
                      readAt = oldNotification.readAt;
                    } else {
                      readAt = Date.now(); // Eğer bulunamazsa şu anki zamanı kullan
                    }
                  } catch (error) {
                    console.error('Error parsing old notifications:', error);
                    readAt = Date.now();
                  }
                } else {
                  readAt = Date.now();
                }
              }

              return {
                id: postId,
                message: post.title,
                date: post.date, // Tarih değerini doğrudan kullan
                read: isRead, // Daha önce okunmuşsa true, okunmamışsa false
                readAt: isRead ? readAt : undefined, // Okunmuşsa okunma zamanını ekle
                slug: post.slug
              };
            });

            // Okunmuş ve 1 saatten eski bildirimleri filtrele
            const currentTime = Date.now();
            const oneHourInMs = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

            const filteredNotifications = blogNotifications.filter((notification: NotificationType) => {
              // Okunmamış bildirimler kalsın
              if (!notification.read) return true;

              // Okunma zamanı yoksa kalsın
              if (!notification.readAt) return true;

              // Okunma zamanından bu yana 1 saatten az geçtiyse kalsın
              return (currentTime - notification.readAt) < oneHourInMs;
            });

            console.log(`Filtered out ${blogNotifications.length - filteredNotifications.length} read notifications older than 1 hour`);

            // Okunmamış bildirim var mı kontrol et
            const hasUnread = filteredNotifications.some((notification: NotificationType) => !notification.read);

            setNotifications(filteredNotifications);
            setHasUnreadNotifications(hasUnread);
            localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
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
  }, [fetchBlogPosts]);

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
    // Her 5 dakikada bir kontrol et
    const checkInterval = setInterval(() => {
      if (notifications.length > 0) {
        const currentTime = Date.now();
        const oneHourInMs = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

        // Okunmuş ve 1 saatten fazla zaman geçmiş bildirimleri filtrele
        const filteredNotifications = notifications.filter((notification: NotificationType) => {
          // Okunmamış bildirimler kalsın
          if (!notification.read) return true;

          // Okunma zamanı yoksa kalsın
          if (!notification.readAt) return true;

          // Okunma zamanından bu yana 1 saatten az geçtiyse kalsın
          return (currentTime - notification.readAt) < oneHourInMs;
        });

        // Eğer bildirim sayısı değiştiyse, state'i ve localStorage'ı güncelle
        if (filteredNotifications.length !== notifications.length) {
          console.log(`Removing ${notifications.length - filteredNotifications.length} read notifications older than 1 hour`);
          setNotifications(filteredNotifications);
          localStorage.setItem('notifications', JSON.stringify(filteredNotifications));

          // Okunmamış bildirim var mı kontrol et
          const hasUnread = filteredNotifications.some(notification => !notification.read);
          setHasUnreadNotifications(hasUnread);
        }
      }
    }, 5 * 60 * 1000); // 5 dakikada bir kontrol et

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(checkInterval);
  }, [notifications]);

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

    // Update notifications in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Kalıcı olarak tüm bildirimleri okundu olarak işaretle
    const readNotificationsJSON = localStorage.getItem('readNotifications');
    let readNotifications: string[] = [];

    if (readNotificationsJSON) {
      try {
        readNotifications = JSON.parse(readNotificationsJSON);
      } catch (error) {
        console.error('Error parsing read notifications:', error);
      }
    }

    // Tüm bildirimleri okundu olarak işaretle
    let updated = false;
    for (const notification of notifications) {
      if (!readNotifications.includes(notification.id)) {
        readNotifications.push(notification.id);
        updated = true;
      }
    }

    // Eğer değişiklik yapıldıysa localStorage'ı güncelle
    if (updated) {
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      console.log('All notifications marked as read permanently');
    }
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

    // Update notifications in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Kalıcı olarak okunmuş bildirimleri sakla
    const readNotificationsJSON = localStorage.getItem('readNotifications');
    let readNotifications: string[] = [];

    if (readNotificationsJSON) {
      try {
        readNotifications = JSON.parse(readNotificationsJSON);
      } catch (error) {
        console.error('Error parsing read notifications:', error);
      }
    }

    // Eğer bu bildirim daha önce okunmamışsa, listeye ekle
    if (!readNotifications.includes(id)) {
      readNotifications.push(id);
      localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
      console.log(`Notification ${id} marked as read permanently at ${new Date(currentTime).toLocaleString()}`);
    }
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
        aria-label="Bildirimlər"
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
          <title>Bildirimlər</title>
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
          <h3 className={styles.notificationTitle}>Bildirimlər</h3>
          <button
            type="button"
            className={styles.markAsReadButton}
            onClick={markAllAsRead}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ marginRight: '4px' }}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Oxundu olaraq işarələ
          </button>
        </div>

        <div className={styles.notificationList}>
          {notifications.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              Bloq yazısı yoxdur
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
                    className={styles.newTxt}>Yeni: </span>
                    {notification.message}
                  </p>
                  <p className={styles.notificationDate}>
                    {notification.date || 'Son paylaşım'}
                  </p>
                </div>
                <div className={styles.notificationIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#d63384"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>

        <Link href="/blog" className={styles.viewAllLink} onClick={() => setIsNotificationOpen(false)}>
          Bütün blog yazılarını göstər
        </Link>
      </div>
    </div>
  );
}
