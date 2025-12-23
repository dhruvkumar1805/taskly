type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Tasks" value={stats.total} />
      <StatCard label="In Progress" value={stats.inProgress} />
      <StatCard label="Completed" value={stats.completed} />
      <StatCard label="Overdue" value={stats.overdue} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
