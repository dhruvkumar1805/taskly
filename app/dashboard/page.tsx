import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import TodayBoard from "./today-board";
import { CalendarDays, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const name = session.user?.name?.split(" ")[0] ?? "there";

  const tasks = await getTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let overdueCount = 0;
  let dueTodayCount = 0;
  for (const t of tasks) {
    if (t.status === "COMPLETED" || !t.dueDate) continue;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    if (due < today) overdueCount++;
    else if (due.getTime() === today.getTime()) dueTodayCount++;
  }

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
    <div className="mx-auto max-w-3xl space-y-3 p-3 pb-32 md:space-y-5 md:p-6 md:pb-24 lg:p-7">
      <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {getGreeting()}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {overdueCount > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-primary">
                  {overdueCount} {overdueCount === 1 ? "task" : "tasks"}
                </span>{" "}
                overdue.
              </>
            ) : dueTodayCount > 0 ? (
              <>
                You have{" "}
                <span className="font-semibold text-foreground">
                  {dueTodayCount} {dueTodayCount === 1 ? "task" : "tasks"}
                </span>{" "}
                due today.
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                You&apos;re all caught up for today.
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {dateString} · {dayString}
        </div>
      </div>

      <div className="animate-fade-up animation-delay-75">
        <TodayBoard tasks={tasks} />
      </div>
    </div>
  );
}
