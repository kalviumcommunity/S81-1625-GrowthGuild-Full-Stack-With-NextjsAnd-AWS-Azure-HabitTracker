"use client";

import Link from "next/link";

/**
 * Footer Props Interface
 */
interface FooterProps {
  /** Whether to show extended footer with more links */
  extended?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Footer Component
 * 
 * A reusable footer component that provides:
 * - Brand information and logo
 * - Technology badges
 * - Optional extended links section
 * - Responsive design
 * 
 * @example
 * ```tsx
 * import { Footer } from "@/components";
 * <Footer />
 * 
 * // Extended version with more links
 * <Footer extended />
 * ```
 */
export default function Footer({ extended = false, className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Habits", href: "/habits" },
    { label: "About", href: "/about" },
  ];

  const techBadges = [
    { label: "Next.js 15", variant: "primary" as const },
    { label: "TypeScript", variant: "success" as const },
    { label: "Prisma", variant: "warning" as const },
  ];

  return (
    <footer className={`mt-auto py-8 border-t border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {extended && (
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold gradient-text">HabitFlow</span>
              </Link>
              <p className="text-sm text-gray-400">
                Build better habits, one day at a time. Track your progress and achieve your goals.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="font-semibold mb-4">Built With</h3>
              <div className="flex flex-wrap gap-2">
                {techBadges.map((badge) => (
                  <span key={badge.label} className={`badge badge-${badge.variant}`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold gradient-text">HabitFlow</span>
          </div>
          <p className="text-sm text-gray-400">
            © {currentYear} HabitFlow. Capstone Project - Full Stack Development
          </p>
          <div className="flex items-center space-x-4">
            {techBadges.map((badge) => (
              <span key={badge.label} className={`badge badge-${badge.variant}`}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
