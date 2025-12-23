import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { getTasks } from "@/app/lib/tasks";
import TaskForm from "./task-form";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Your Tasks</h1>

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
              <span>Status: {task.status}</span>
              {task.dueDate && (
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
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
