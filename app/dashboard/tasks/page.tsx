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
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur-xl md:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 md:h-10 md:w-10 dark:text-teal-300">
            <ListTodo className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">My Tasks</h1>
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
