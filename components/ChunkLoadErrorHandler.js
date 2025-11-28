'use client';

import { useEffect } from 'react';

export default function ChunkLoadErrorHandler() {
  useEffect(() => {
    const handler = (event) => {
      // Check if the error is a chunk load error
      // Different browsers might have slightly different error messages
      const isChunkLoadError = 
        event?.message?.includes('Loading chunk') || 
        event?.message?.includes('Loading CSS chunk') ||
        event?.error?.message?.includes('Loading chunk') ||
        event?.error?.message?.includes('Loading CSS chunk') ||
        event?.error?.name === 'ChunkLoadError';

      if (isChunkLoadError) {
        console.warn('Chunk load error detected, reloading page...');
        // Prevent infinite reload loops if the server is actually down or broken
        const lastReload = sessionStorage.getItem('chunk_reload_timestamp');
        const now = Date.now();
        
        // Only reload if we haven't reloaded in the last 10 seconds
        if (!lastReload || now - parseInt(lastReload) > 10000) {
          sessionStorage.setItem('chunk_reload_timestamp', now.toString());
          window.location.reload(true);
        }
      }
    };

    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', (e) => handler(e.reason));

    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', handler);
    };
  }, []);

  return null;
}
