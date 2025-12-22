export default function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Habit Tracker</h1>
      <p>Build habits. Track streaks. Stay consistent.</p>

      <p className="mt-4">
        Environment: {process.env.NEXT_PUBLIC_APP_ENV ?? "NOT LOADED"}
      </p>
      <p>
        API URL: {process.env.NEXT_PUBLIC_API_URL ?? "NOT LOADED"}
      </p>
    </div>
  );
}
