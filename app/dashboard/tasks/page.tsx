import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import TasksView from "./tasks-view";
import { ListTodo } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8 space-y-5 md:space-y-7">
      <div className="rounded-xl border bg-card/85 p-4 shadow-sm backdrop-blur-xl md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300">
            <ListTodo className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Tasks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all your tasks
            </p>
          </div>
        </div>
      </div>
      <TasksView tasks={tasks} />
    </div>
  );
}
