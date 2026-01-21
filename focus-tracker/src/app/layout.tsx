import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "HabitFlow - Build Better Habits, One Day at a Time",
  description: "A modern habit tracking application to help you build consistency, track streaks, and achieve your goals. Built as a capstone project demonstrating full-stack development with Next.js.",
  keywords: ["habit tracker", "productivity", "goals", "streaks", "Next.js", "capstone project"],
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="mt-auto py-8 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold gradient-text">HabitFlow</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © 2026 HabitFlow. Capstone Project - Full Stack Development
                </p>
                <div className="flex items-center space-x-4">
                  <span className="badge badge-primary">Next.js 15</span>
                  <span className="badge badge-success">TypeScript</span>
                  <span className="badge badge-warning">Prisma</span>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
