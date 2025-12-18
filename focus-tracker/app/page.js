export default function HomePage() {
  return (
    <div>
      <h1>Habit Tracker</h1>
      <p>Environment: {process.env.NEXT_PUBLIC_APP_ENV || 'NOT LOADED'}</p>
      <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'NOT LOADED'}</p>
    </div>
  );
}
