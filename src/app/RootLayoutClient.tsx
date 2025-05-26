"use client";

import { BottomNavbar } from "@/components/BottomNavbar";
import ClientTopNavbar from "./ClientTopNavbar";
import { AIAssistant } from "@/components/AIAssistant";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {/* AI Assistant Sidebar */}
        <AIAssistant />

        {/* Main Content */}
        <div className="relative">
          <ClientTopNavbar />

          {children}
          <BottomNavbar />
        </div>
      </ThemeProvider>
    </>
  );
}
