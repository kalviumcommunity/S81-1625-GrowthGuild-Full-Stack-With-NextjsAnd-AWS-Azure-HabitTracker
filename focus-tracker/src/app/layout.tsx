import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientProviders from "@/components/ClientProviders";
import AppLayout from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "HabitFlow - Build Better Habits, One Day at a Time",
  description: "A modern habit tracking application to help you build consistency, track streaks, and achieve your goals. Built as a capstone project demonstrating full-stack development with Next.js.",
  keywords: ["habit tracker", "productivity", "goals", "streaks", "Next.js", "capstone project"],
};

/**
 * Root Layout with Provider Composition
 * 
 * All client-side providers (UIProvider, NotificationProvider, AuthProvider)
 * are wrapped in ClientProviders component to properly handle client-side state.
 */
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <ClientProviders>
          <AppLayout>
            {children}
          </AppLayout>
        </ClientProviders>
      </body>
    </html>
  );
}
