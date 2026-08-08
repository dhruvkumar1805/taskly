import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TodayBoard from "./today-board";
import TodaySummary from "./today-summary";
import { CalendarDays } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const name = session.user?.name?.split(" ")[0] ?? "there";

  const today = new Date();

  const dateString = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const dayString = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3 p-3 pb-32 md:space-y-5 md:p-6 md:pb-24 lg:p-7">
      <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {getGreeting()}, {name}
          </h1>
          <TodaySummary />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {dateString} · {dayString}
        </div>
      </div>

      <div className="animate-fade-up animation-delay-75">
        <TodayBoard />
      </div>
    </div>
  );
}
