'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

type ButtonAction = 'start' | 'explore'| 'explore1';

interface GradientButtonProps {
  label: string;
  action: ButtonAction;
  className?: string;
  children?: ReactNode;
}

export const HeroButtons = ({
  label,
  action,
  className,
  children,
}: GradientButtonProps) => {
  const router = useRouter();

  // Define internal handlers
  const handleClick = () => {
    switch (action) {
      case 'start':
        router.push('/courses');
        break;
      case 'explore':
        router.push('/dashboard');
        break;
        case 'explore1':
        router.push('/courses');
      default:
        console.warn('No action matched.');
    }
  };

  return (
    <Button
      size="lg"
      onClick={handleClick}
      className={cn(
        'group relative overflow-hidden px-8 py-6 text-base font-medium transition-all duration-300 hover:shadow-lg',
        className
      )}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-ping absolute -left-4"></span>
        {label}
        {children ?? <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </Button>
  );
};