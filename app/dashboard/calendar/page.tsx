import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CalendarView from "./calendar-view";

export default async function CalendarPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl p-3 pb-24 md:p-6 lg:p-8">
      <CalendarView />
    </div>
  );
}
