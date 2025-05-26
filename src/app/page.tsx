// File: app/page.tsx
'use client';




import { BottomNavbar } from '@/components/BottomNavbar';
import { ReadyToStartSection } from '@/components/ReadyToStartSection';
import { HeroSection } from '@/components/Herosection';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 ">
        <HeroSection />
        <FeaturesSection/>
        <ReadyToStartSection />
      </main>
      <BottomNavbar />
    </div>
  );
}
