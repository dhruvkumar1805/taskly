import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import TasksView from "./tasks-view";
import StatsCards from "../stats-cards";
import { ListTodo } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [tasks, stats] = await Promise.all([getTasks(), getDashboardStats()]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <div className="rounded-lg border border-border bg-card p-3 md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary md:h-10 md:w-10">
            <ListTodo className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">My tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and track all your tasks
            </p>
          </div>
        </div>
      </div>
      <StatsCards stats={stats} />
      <TasksView tasks={tasks} />
    </div>
  );
}
