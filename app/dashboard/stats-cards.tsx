import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Tasks"
        value={stats.total}
        icon={ListChecks}
        iconClass="text-blue-600"
      />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        icon={Loader2}
        iconClass="text-orange-600"
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        iconClass="text-green-600"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        iconClass="text-red-600"
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>

        <div className={`rounded-md bg-muted p-2 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
