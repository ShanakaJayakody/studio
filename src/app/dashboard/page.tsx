
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will redirect to the default dashboard page, e.g., /dashboard/home
export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/home');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <p className="text-lg text-foreground">Redirecting to dashboard...</p>
    </div>
  );
}
