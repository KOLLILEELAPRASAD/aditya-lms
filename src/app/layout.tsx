import type { Metadata } from 'next';
import './globals.css'; // Import global styles
import RootLayoutClient from './RootLayoutClient';

export const metadata: Metadata = {
  title: 'Futuristic LMS - Empower Your Learning',
  description: 'A modern Learning Management System for the future of education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}