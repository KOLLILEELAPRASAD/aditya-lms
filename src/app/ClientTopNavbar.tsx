/* File: app/ClientTopNavbar.tsx */
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ClientTopNavbar() {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/auth/login');
  };

  const handleRegisterClick = () => {
    router.push('/auth/register');
  };

  return (
    <nav className="bg-background/80 border-b border-border py-4 px-6 flex justify-between items-center">
      {/* Left Side: Learning Logo */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">L</span>
        </div>
        <h1 className="text-xl font-bold text-foreground font-sans">
          Futuristic LMS
        </h1>
      </div>

      {/* Right Side: Sign In and Register Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleSignInClick}
          className="border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Sign In
        </Button>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleRegisterClick}
        >
          Register
        </Button>
      </div>
    </nav>
  );
}