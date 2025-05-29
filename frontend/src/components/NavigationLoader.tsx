'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from './loader';

export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState('');

  useEffect(() => {
    if (pathname !== previousPath) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300); // Adjust timing as needed
      setPreviousPath(pathname);
      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 w-full bg-gray-200">
        <div className="h-full bg-blue-500 animate-pulse" style={{ width: '90%' }}></div>
      </div>
    </div>
  );
}
