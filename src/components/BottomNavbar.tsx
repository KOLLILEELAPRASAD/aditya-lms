'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, LayoutDashboard, User } from 'lucide-react';

export function BottomNavbar() {
  const pathname = usePathname();

  const navItems = useMemo(
    () => [
      { name: '', href: '/', icon: <Home className="w-5 h-5" /> },
      { name: '', href: '/courses', icon: <BookOpen className="w-5 h-5" /> },
      { name: '', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: '', href: '/profile', icon: <User className="w-5 h-5" /> },
    ],
    []
  );

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-background/80 dark:bg-gray-800/90 backdrop-blur-md rounded-full border border-border dark:border-gray-700 shadow-lg px-2 py-1 flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Button
              key={item.href} // Use href as the unique key since name was empty
              variant={isActive ? "default" : "ghost"}
              size="icon"
              className={`relative rounded-full w-12 h-12 transition-all duration-300 flex flex-col items-center justify-center ${
                isActive
                  ? 'bg-primary dark:bg-primary/80 text-primary-foreground dark:text-gray-100 shadow-md hover:bg-primary/90 dark:hover:bg-primary/70'
                  : 'text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-100 hover:bg-accent/20 dark:hover:bg-gray-700'
              }`}
              asChild
            >
              <a href={item.href} aria-label={item.name}>
                {item.icon}
                <span className="absolute -bottom-6 text-xs font-medium whitespace-nowrap text-foreground dark:text-gray-100">
                  {item.name}
                </span>
              </a>
            </Button>
          );
        })}
      </div>
    </div>
  );
}