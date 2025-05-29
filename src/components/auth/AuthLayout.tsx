
import type { ReactNode } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AuthLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  logoUrl: string;
  logoAlt?: string;
}

export default function AuthLayout({ title, description, children, logoUrl, logoAlt = "App Logo" }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="items-center text-center">
          <Image 
            src={logoUrl} 
            alt={logoAlt} 
            width={150} 
            height={40} // Adjust height as needed, width will scale
            className="mb-6 object-contain"
            data-ai-hint="app logo"
          />
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
