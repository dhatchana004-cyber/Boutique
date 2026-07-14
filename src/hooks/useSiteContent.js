import { useState, useEffect } from 'react';

const STORAGE_KEY = 'luxe_site_content';

// Read all saved content from localStorage
function getSavedContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save content for a specific page to localStorage
export function saveSiteContent(pageName, data) {
  const all = getSavedContent();
  all[pageName] = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  // Dispatch a custom event so all open pages pick up the change instantly
  window.dispatchEvent(new CustomEvent('site-content-updated', { detail: { page: pageName } }));
}

// Get content for a specific page from localStorage
export function getSitePageContent(pageName) {
  const all = getSavedContent();
  return all[pageName] || null;
}

export function useSiteContent(pageName, defaultContent = {}) {
  const [content, setContent] = useState(() => {
    // Immediately check localStorage on mount for instant display
    const saved = getSitePageContent(pageName);
    if (saved && Object.keys(saved).length > 0) {
      return { ...defaultContent, ...saved };
    }
    return defaultContent;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for live updates from admin panel
    const handleUpdate = (e) => {
      if (e.detail?.page === pageName) {
        const saved = getSitePageContent(pageName);
        if (saved) {
          setContent(prev => ({ ...prev, ...saved }));
        }
      }
    };

    window.addEventListener('site-content-updated', handleUpdate);

    // Also listen for storage changes from other tabs
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        const saved = getSitePageContent(pageName);
        if (saved) {
          setContent(prev => ({ ...prev, ...saved }));
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('site-content-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [pageName]);

  return { content, loading };
}
