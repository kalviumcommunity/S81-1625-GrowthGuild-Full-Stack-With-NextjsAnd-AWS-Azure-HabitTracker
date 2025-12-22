export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = {
    completedToday: 3,
    totalHabits: 5,
    time: new Date().toLocaleTimeString(),
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Completed Today: {data.completedToday}</p>
      <p>Total Habits: {data.totalHabits}</p>
      <p>Rendered at: {data.time}</p>
    </div>
  );
}
