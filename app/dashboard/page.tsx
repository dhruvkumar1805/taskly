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

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-3 rounded flex justify-between">
            <span>{task.title}</span>
            <span className="text-sm text-gray-500">{task.status}</span>
          </li>
        ))}
      </ul>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="border px-4 py-2">Sign out</button>
      </form>
    </div>
  );
}
