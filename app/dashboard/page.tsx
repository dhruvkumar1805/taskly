import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";
import TaskList from "./task-list";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  const stats = await getDashboardStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Tasks</h1>

      <StatsCards stats={stats} />
      <TaskList tasks={tasks} />
    </div>
  );
}
