import { useState, useEffect } from 'react';
import api from '../services/api';

const SYNC_KEY = 'luxe_site_content_sync';

// For instant cross-component updates and cross-tab sync
export function saveLocalSiteContentUpdate(pageName, data) {
  window.dispatchEvent(new CustomEvent('site-content-updated', { detail: { page: pageName, data } }));
  localStorage.setItem(SYNC_KEY, JSON.stringify({ page: pageName, data, timestamp: Date.now() }));
}

export function useSiteContent(pageName, defaultContent = {}) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/content/${pageName}`);
        if (isMounted) {
          if (res.data && res.data.success && res.data.data) {
            setContent({ ...defaultContent, ...res.data.data });
          }
        }
      } catch (err) {
        console.error('Failed to fetch site content for page:', pageName, err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchContent();

    // Listen for live updates from admin panel in the same session
    const handleUpdate = (e) => {
      if (e.detail?.page === pageName && e.detail?.data) {
        setContent(prev => ({ ...prev, ...e.detail.data }));
      }
    };

    // Listen for cross-tab updates
    const handleStorage = (e) => {
      if (e.key === SYNC_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.page === pageName && parsed.data) {
            setContent(prev => ({ ...prev, ...parsed.data }));
          }
        } catch (err) {}
      }
    };

    window.addEventListener('site-content-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      window.removeEventListener('site-content-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [pageName]); // Removed defaultContent from deps to avoid infinite loops

  return { content, loading };
}
