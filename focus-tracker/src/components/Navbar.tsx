export default function Navbar() {
  return (
    <nav className="p-4 bg-white shadow">
      <a href="/" className="mr-4 text-blue-600">Home</a>
      <a href="/about" className="mr-4 text-blue-600">About</a>
      <a href="/dashboard" className="mr-4 text-blue-600">Dashboard</a>
      <a href="/habits" className="text-blue-600">Habits</a>
    </nav>
  );
}
