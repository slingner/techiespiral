import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple attempts to ensure scroll works
    window.scrollTo(0, 0);
    
    // Also try with requestAnimationFrame
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    
    // And with a small timeout as backup
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [pathname]);

  return null;
};