import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";
import TaskList from "./task-list";
import { Card } from "@/components/ui/card";
import { CalendarDays, CheckCircle2, Sparkles } from "lucide-react";

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
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-5 md:space-y-7">
      <div className="flex flex-col gap-4 rounded-xl border bg-card/85 p-4 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
        <div className="min-w-0 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Today&apos;s focus
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {getGreeting()}, {name}
            </h1>
            <p className="text-sm text-muted-foreground">
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
        </div>

        <Card className="w-full rounded-lg border bg-background/70 px-4 py-3 shadow-sm md:w-fit">
          <div className="flex items-center gap-3 md:justify-end">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <CalendarDays className="h-5 w-5" />
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
