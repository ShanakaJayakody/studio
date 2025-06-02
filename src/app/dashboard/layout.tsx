
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, BookOpenText, BarChart3, LogOut, UserCircle, Settings, Brain, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext'; // Import useTheme
import { useEffect } from 'react';
import Image from 'next/image';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isComingSoon?: boolean;
}

function NavItem({ href, icon, label, isActive, isComingSoon }: NavItemProps) {
  return (
    <Link href={isComingSoon ? '#' : href} legacyBehavior passHref>
      <a
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted-foreground hover:text-primary',
          isComingSoon && 'cursor-not-allowed opacity-50'
        )}
        aria-disabled={isComingSoon}
        onClick={(e) => isComingSoon && e.preventDefault()}
      >
        {icon}
        <span>{label}</span>
        {isComingSoon && <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm ml-1">Soon</span>}
      </a>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use the theme context
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
    { href: '/dashboard/classroom', icon: <Library className="h-5 w-5" />, label: 'Classroom' }, 
    { href: '/dashboard/practice', icon: <BookOpenText className="h-5 w-5" />, label: 'Practice' },
    { href: '/dashboard/results', icon: <BarChart3 className="h-5 w-5" />, label: 'Results' },
    { href: '#', icon: <Brain className="h-5 w-5" />, label: 'Skills', isComingSoon: true },
  ];

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard/home" className="flex-shrink-0">
                <Image
                  src="https://ik.imagekit.io/mwp/MWP%20Color%20no%20background.png?updatedAt=1745982959141"
                  alt="MED WITH PURPOSE Logo"
                  width={120} 
                  height={32} 
                  className="object-contain"
                  data-ai-hint="app logo"
                />
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <NavItem
                  key={item.label}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={pathname === item.href || (item.href !== '/dashboard/home' && pathname.startsWith(item.href))}
                  isComingSoon={item.isComingSoon}
                />
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {userDisplayName}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="text-muted-foreground hover:text-primary"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={logout}
                size="sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
