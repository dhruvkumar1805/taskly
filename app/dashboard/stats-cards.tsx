import { AlertTriangle, CheckCircle2, CircleDashed, ListChecks } from "lucide-react";

type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const hasOverdue = stats.overdue > 0;

  const cards = [
    { label: "Total", value: stats.total, icon: ListChecks, tone: "text-muted-foreground" },
    { label: "In progress", value: stats.inProgress, icon: CircleDashed, tone: "text-info" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "text-success" },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      tone: hasOverdue ? "text-primary" : "text-muted-foreground",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="p-3.5 md:p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {label}
            </div>
            <p
              className={`mt-2 font-mono text-2xl font-semibold tracking-tight ${
                label === "Overdue" && hasOverdue ? "text-primary" : ""
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3.5 md:p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Completion</span>
          <span className="font-mono font-medium">{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
