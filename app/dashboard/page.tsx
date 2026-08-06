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
    <div className="mx-auto max-w-3xl space-y-3 p-3 pb-24 md:space-y-5 md:p-6 lg:p-7">
      <div className="animate-fade-up flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:flex-row md:items-center md:justify-between md:px-5 md:py-4">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {getGreeting()}, {name}
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
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

        <div className="flex w-full items-center gap-3 rounded-md border border-border bg-background px-3.5 py-2.5 md:w-fit md:justify-end">
          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-col md:items-end md:text-right">
            <p className="font-mono text-sm font-semibold tracking-tight">{dateString}</p>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {dayString}
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-up animation-delay-75">
        <TodayBoard tasks={tasks} />
      </div>
    </div>
  );
}
