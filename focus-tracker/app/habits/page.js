export const revalidate = 60;

export default async function HabitsPage() {
  const habits = [
    'Exercise',
    'Read 30 minutes',
    'Code everyday',
    'Meditate everyday',
  ];

  return (
    <div>
      <h1 className="text-xl font-bold">Popular Habits</h1>
      <ul className="list-disc pl-5">
        {habits.map((habit, index) => (
          <li key={index}>{habit}</li>
        ))}
      </ul>
      <p className="text-sm text-gray-500 mt-4">
        Page regenerates every 60 seconds
      </p>
    </div>
  );
}
