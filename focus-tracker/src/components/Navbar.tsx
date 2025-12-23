import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-white shadow">
      <Link href="/" className="mr-4 text-blue-600">
        Home
      </Link>
      <Link href="/about" className="mr-4 text-blue-600">
        About
      </Link>
      <Link href="/dashboard" className="mr-4 text-blue-600">
        Dashboard
      </Link>
      <Link href="/habits" className="text-blue-600">
        Habits
      </Link>
    </nav>
  );
}
// test lint-staged
