import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, CircleDashed, ListChecks } from "lucide-react";

type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: ListChecks,
      className: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: CircleDashed,
      className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      className: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
  ];

  return (
    <Card className="rounded-xl border bg-card/85 py-0 shadow-sm backdrop-blur-xl">
      <CardContent className="p-3 md:p-5">
        <div className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, className }) => (
            <div
              key={label}
              className="rounded-lg border bg-background/70 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-2 md:mb-4 md:gap-3">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg md:h-8 md:w-8 ${className}`}>
                  <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight md:text-3xl">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-lg border bg-background/70 p-3 shadow-sm md:mt-5 md:p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Completion</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
