// File: app/page.tsx
'use client';


import FeaturesSection from '@/components/FeaturesSection';


import { BottomNavbar } from '@/components/BottomNavbar';
import { ReadyToStartSection } from '@/components/ReadyToStartSection';
import { HeroSection } from '@/components/Herosection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 space-y-32">
        <HeroSection />
        <FeaturesSection />
        <ReadyToStartSection />
      </main>
      <BottomNavbar />
    </div>
  );
}
