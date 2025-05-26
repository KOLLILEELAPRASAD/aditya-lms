'use client';

import { Button } from '@/components/ui/button';

interface NavItem {
  name: string;
  icon: string;
}

export function Sidebar() {
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen fixed top-0 left-0 flex flex-col animate-fade-in">
      <div className="p-4">
        <h1 className="text-xl font-bold">Minimalist UI</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors duration-200 animate-pulse-once justify-start"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}