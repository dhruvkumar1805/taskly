import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";
import TaskList from "./task-list";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const name = session.user?.name?.split(" ")[0] ?? "there";

  const tasks = await getTasks();

  const stats = await getDashboardStats();

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">
          {getGreeting()}, {name} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          {stats.inProgress === 0
            ? "You’re all caught up for today 🎉"
            : `You have ${stats.inProgress} ${
                stats.inProgress === 1 ? "task" : "tasks"
              } remaining today.`}
        </p>
      </div>

      <StatsCards stats={stats} />
      <TaskList tasks={tasks} />
    </div>
  );
}
