/* File: components/TopNavbar.tsx */
'use client';

import { Button } from '@/components/ui/button';

interface TopNavbarProps {
  onSignInClick: () => void;
  isLoggedIn: boolean;
}

export function TopNavbar({ onSignInClick, isLoggedIn }: TopNavbarProps) {
  const handleSignInClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('TopNavbar Sign In button clicked');
    onSignInClick();
  };

  return (
    <nav
      className="bg-background/80 border-b border-border py-4 px-6 flex justify-between items-center animate-slide-down backdrop-blur-sm relative overflow-hidden"
      style={{ boxShadow: '0 2px 15px rgba(var(--primary), 0.3)' }}
    >
      {/* Subtle Gradient Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 via-chart-2/10 to-chart-3/10 animate-gradient-shift" />

      <div className="flex items-center gap-2 z-10">
        <div
          className="h-8 w-8 rounded-full bg-primary flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12 animate-pulse-once"
          style={{ boxShadow: '0 0 10px rgba(var(--primary), 0.5)' }}
        >
          <span className="text-primary-foreground font-bold text-lg">L</span>
        </div>
        <h1
          className="text-xl font-bold text-foreground font-sans animate-slide-down"
          style={{ animationDelay: '150ms' }}
        >
          Futuristic LMS
        </h1>
      </div>
      <div className="flex gap-3 z-10">
        <Button
          variant="outline"
          onClick={handleSignInClick}
          className={`relative border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300 animate-slide-down group ${!isLoggedIn ? 'opacity-70' : ''}`}
          style={{ animationDelay: '300ms' }}
          aria-label={isLoggedIn ? "Return to Sign In page" : "Sign In (Current Page)"}
        >
          Sign In
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
        <Button
          className="relative bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 animate-slide-down group"
          style={{ animationDelay: '450ms' }}
          asChild
        >
          <a href="/auth/register" aria-label="Register">
            Register
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </Button>
      </div>
    </nav>
  );
}