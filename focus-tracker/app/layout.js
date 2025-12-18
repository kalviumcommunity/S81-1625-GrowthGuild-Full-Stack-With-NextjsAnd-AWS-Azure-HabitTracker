import './globals.css';

export const metadata = {
  title: 'Habit Tracker',
  description: 'Track habits and build consistency',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="p-4 bg-white shadow">
          <a href="/" className="mr-4 text-gray-600">Home</a>
          <a href="/about" className="mr-4 text-gray-600">About</a>
          <a href="/dashboard" className="mr-4 text-gray-600">Dashboard</a>
          <a href="/habits" className="text-gray-600">Habits</a>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
