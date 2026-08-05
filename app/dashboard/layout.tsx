import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTasks } from "@/app/lib/tasks";
import DashboardShell from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const tasks = await getTasks();

  return (
    <DashboardShell user={session.user} tasks={tasks}>
      {children}
    </DashboardShell>
  );
}
