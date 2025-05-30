
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
    if (!isClient || authLoading) {
      return; // Wait for client hydration and auth state to be definitively known
    }

    if (!currentUser) {
      // User is not logged in
      if (pathname !== '/login' && pathname !== '/signup') {
        // If not already on an auth page, redirect to login
        router.push('/login');
      }
      // If on /login or /signup, do nothing, let those pages render
    } else {
      // User is logged in
      if (pathname === '/login' || pathname === '/signup') {
        // If logged in user tries to access login/signup, redirect to dashboard
        router.push('/dashboard/home');
      } else if (pathname === '/') {
        // If logged in user is at the root, redirect to dashboard
        router.push('/dashboard/home');
      }
      // If logged in and on any other authenticated page (e.g., /dashboard/*, /exams/*), do nothing.
      // Those pages should handle their own content rendering.
    }
  }, [isClient, authLoading, currentUser, router, pathname]);

  // Initial rendering logic
  if (authLoading || !isClient) {
    // Show a loading screen while waiting for auth state or client hydration
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
      </div>
    );
  }

  // If client is ready, auth is loaded:
  // If user is not authenticated AND is trying to access login/signup, let those pages render themselves.
  if (!currentUser && (pathname === '/login' || pathname === '/signup')) {
    return null; 
  }
  
  // In all other scenarios (e.g. redirect is about to happen, or user is authenticated and on a non-auth page not yet handled by redirect),
  // show a generic message. The useEffect handles the actual navigation.
  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <p className="text-lg text-[hsl(var(--foreground))]">Determining route...</p>
    </div>
  );
}
