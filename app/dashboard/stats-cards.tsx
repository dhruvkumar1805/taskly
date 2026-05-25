import { Card, CardContent } from "@/components/ui/card";
import { ListChecks, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export default function StatsCards({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Tasks"
        value={stats.total}
        icon={ListChecks}
        iconClass="text-blue-600 bg-blue-500/10"
      />
      <StatCard
        label="In Progress"
        value={stats.inProgress}
        icon={Loader2}
        iconClass="text-orange-600 bg-orange-500/10"
      />
      <StatCard
        label="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        iconClass="text-green-600 bg-green-500/10"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon={AlertTriangle}
        iconClass="text-red-600 bg-red-500/10"
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
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`rounded-lg p-3 hidden md:flex items-center justify-center ${iconClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
