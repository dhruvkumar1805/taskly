import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/app/lib/dashboard";
import TasksView from "./tasks-view";
import StatsCards from "../stats-cards";

export default async function TasksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const stats = await getDashboardStats();

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <StatsCards stats={stats} />
      <TasksView />
    </div>
  );
}
