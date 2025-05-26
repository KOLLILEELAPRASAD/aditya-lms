'use client';

import { BottomNavbar } from '@/components/BottomNavbar';
import ClientTopNavbar from './ClientTopNavbar';
import { AIAssistant } from '@/components/AIAssistant';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* AI Assistant Sidebar */}
      <AIAssistant />

      {/* Main Content */}
      <div className="relative">
        <ClientTopNavbar />
        {children}
        <BottomNavbar />
      </div>
    </>
  );
}

