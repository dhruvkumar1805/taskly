import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import TaskForm from "./task-form";
import { toggleTaskStatus, deleteTask } from "@/app/actions/tasks";
import { getDashboardStats } from "@/app/lib/dashboard";
import StatsCards from "./stats-cards";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  const stats = await getDashboardStats();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Tasks</h1>

      <StatsCards stats={stats} />
      <TaskForm />
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{task.title}</h3>
              <span className="text-xs px-2 py-1 rounded border">
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <form
                action={async () => {
                  "use server";
                  await toggleTaskStatus(task.id);
                }}
              >
                <button className="text-xs px-2 py-1 rounded border hover:bg-gray-100">
                  {task.status}
                </button>
              </form>

              {task.dueDate && (
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
              <form
                action={async () => {
                  "use server";
                  await deleteTask(task.id);
                }}
              >
                <button className="text-xs text-red-600 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="border px-4 py-2">Sign out</button>
        </form>
      </ul>
    </div>
  );
}
