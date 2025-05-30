
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading) {
      if (!currentUser) {
        // If not logged in and not already on login/signup, redirect to login
        if (pathname !== '/login' && pathname !== '/signup') {
          router.push('/login');
        }
      } else {
        // If logged in
        if (pathname === '/login' || pathname === '/signup') {
          // If on login/signup, redirect to dashboard
          router.push('/dashboard/home');
        } else if (pathname === '/') {
          // If on root, redirect to dashboard
          router.push('/dashboard/home');
        }
        // If already on a dashboard path or exam path, do nothing, let that page handle itself.
      }
    }
  }, [isClient, authLoading, currentUser, router, pathname]);

  // Show a loading indicator while determining auth state or if it's not a redirect scenario for this page
  // This page itself doesn't render content other than redirecting or showing loading.
  if (authLoading || !isClient || (currentUser && pathname === '/')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
      </div>
    );
  }
  
  // If not logged in and on login/signup, let those pages render.
  if (!currentUser && (pathname === '/login' || pathname === '/signup')) {
    return null; 
  }

  // Fallback for any other scenario, though ideally covered by redirects.
  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <p className="text-lg text-[hsl(var(--foreground))]">Determining route...</p>
    </div>
  );
}
