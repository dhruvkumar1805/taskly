import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";
import TaskList from "./task-list";
import { Card } from "@/components/ui/card";

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            {getGreeting()}, {name}! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.inProgress === 0 ? (
              "You’re all caught up for today 🎉"
            ) : (
              <>
                You have{" "}
                <span className="font-semibold text-foreground">
                  {stats.inProgress} {stats.inProgress === 1 ? "task" : "tasks"}
                </span>{" "}
                remaining today.
              </>
            )}
          </p>
        </div>

        <Card className="w-fit rounded-xl px-3 py-2">
          <div className="flex flex-col items-end text-right">
            <p className="text-sm font-semibold">{dateString}</p>
            <p className="text-xs text-muted-foreground">{dayString}</p>
          </div>
        </Card>
      </div>

      <StatsCards stats={stats} />
      <TaskList tasks={tasks} />
    </div>
  );
}
