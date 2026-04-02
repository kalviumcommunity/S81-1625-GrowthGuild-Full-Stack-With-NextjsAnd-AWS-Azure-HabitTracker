export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="stat-card animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
          <div className="flex-1 space-y-3">
            <div className="h-8 w-56 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-4 w-72 max-w-full rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="stat-card animate-pulse space-y-3">
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
          </div>
        ))}
      </div>

      <div className="stat-card space-y-4 animate-pulse">
        <div className="h-6 w-44 rounded bg-gray-200 dark:bg-gray-800"></div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800"></div>
        ))}
      </div>
    </div>
  );
}
