
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter }s from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, BookOpenText, BarChart3, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} legacyBehavior passHref>
      <a
        className={cn(
          'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200',
          isActive
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        )}
      >
        {icon}
        <span>{label}</span>
      </a>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-lg text-foreground">Loading Dashboard...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard/home', icon: <Home className="h-5 w-5" />, label: 'Home' },
    { href: '/dashboard/practice', icon: <BookOpenText className="h-5 w-5" />, label: 'Practice' },
    { href: '/dashboard/results', icon: <BarChart3 className="h-5 w-5" />, label: 'Results' },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="w-64 bg-card p-6 shadow-lg flex flex-col justify-between">
        <div>
          <div className="mb-8 text-center">
            <Link href="/dashboard/home" className="inline-block">
              <img 
                src="https://ik.imagekit.io/mwp/MWP%20Color%20no%20background.png?updatedAt=1745982959141" 
                alt="UCAT Challenger Logo" 
                className="h-10 mx-auto"
                data-ai-hint="app logo"
              />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">UCAT Challenger</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname.startsWith(item.href)}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto">
           <div className="flex items-center space-x-3 p-3 border-t border-border">
            <UserCircle className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">
                {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentUser?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive mt-2"
            onClick={logout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
