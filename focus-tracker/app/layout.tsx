import "./globals.css";

export const metadata = {
  title: "Habit Tracker",
  description: "Track habits and build consistency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="p-4 bg-white shadow">
          <a href="/" className="mr-4 text-black">Home</a>
          <a href="/about" className="mr-4 text-black">About</a>
          <a href="/dashboard" className="mr-4 text-black">Dashboard</a>
          <a href="/habits" className="text-black">Habits</a>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
