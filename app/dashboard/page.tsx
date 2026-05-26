import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";
import TaskList from "./task-list";
import { Card } from "@/components/ui/card";
import { CalendarDays, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const name = session.user?.name?.split(" ")[0] ?? "there";

  const tasks = await getTasks();

  const stats = await getDashboardStats();

  const today = new Date();

  const dateString = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dayString = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-3 p-3 pb-24 md:space-y-5 md:p-6 lg:p-7">
      <div className="flex flex-col gap-3 rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between md:px-5 md:py-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {getGreeting()}, {name}
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            {stats.todo === 0 ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                You&apos;re all caught up for today.
              </span>
            ) : (
              <>
                You have{" "}
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  {stats.todo} {stats.todo === 1 ? "task" : "tasks"}
                </span>{" "}
                remaining today.
              </>
            )}
          </p>
        </div>

        <Card className="w-full rounded-lg border bg-background/70 px-3 py-2 shadow-sm md:w-fit md:px-3.5 md:py-2.5">
          <div className="flex items-center gap-3 md:justify-end">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div className="flex flex-col md:items-end md:text-right">
              <p className="text-sm font-semibold">{dateString}</p>
              <p className="text-xs text-muted-foreground">{dayString}</p>
            </div>
          </div>
        </Card>
      </div>

      <StatsCards stats={stats} />
      <TaskList tasks={tasks} />
    </div>
  );
}
