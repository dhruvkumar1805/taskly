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
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <div className="flex flex-col gap-3 rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between md:p-6">
        <div className="min-w-0 space-y-2.5 md:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Today&apos;s focus
          </div>
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight md:text-3xl">
              {getGreeting()}, {name}
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
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

        <Card className="w-full rounded-lg border bg-background/70 px-3 py-2.5 shadow-sm md:w-fit md:px-4 md:py-3">
          <div className="flex items-center gap-3 md:justify-end">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 md:h-10 md:w-10 dark:text-amber-300">
              <CalendarDays className="h-4 w-4 md:h-5 md:w-5" />
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
