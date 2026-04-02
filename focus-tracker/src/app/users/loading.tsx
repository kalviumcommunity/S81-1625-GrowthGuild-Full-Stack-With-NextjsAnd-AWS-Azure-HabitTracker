export default function Loading() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-3 animate-pulse">
        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-10 w-64 rounded bg-gray-200 dark:bg-gray-800"></div>
        <div className="h-4 w-80 max-w-full rounded bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="stat-card animate-pulse space-y-4">
            <div className="flex items-start space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 w-2/3 rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800"></div>
              </div>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800"></div>
              <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}