"use client";

import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTasks } from "./tasks-context";

export default function TodaySummary() {
  const { visibleTasks } = useTasks();

  const { overdueCount, dueTodayCount } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let overdueCount = 0;
    let dueTodayCount = 0;
    for (const t of visibleTasks) {
      if (t.status === "COMPLETED" || !t.dueDate) continue;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < today) overdueCount++;
      else if (due.getTime() === today.getTime()) dueTodayCount++;
    }
    return { overdueCount, dueTodayCount };
  }, [visibleTasks]);

  if (overdueCount > 0) {
    return (
      <p className="mt-1 text-sm text-muted-foreground">
        You have{" "}
        <span className="font-semibold text-primary">
          {overdueCount} {overdueCount === 1 ? "task" : "tasks"}
        </span>{" "}
        overdue.
      </p>
    );
  }

  if (dueTodayCount > 0) {
    return (
      <p className="mt-1 text-sm text-muted-foreground">
        You have{" "}
        <span className="font-semibold text-foreground">
          {dueTodayCount} {dueTodayCount === 1 ? "task" : "tasks"}
        </span>{" "}
        due today.
      </p>
    );
  }

  return (
    <p className="mt-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-success" />
        You&apos;re all caught up for today.
      </span>
    </p>
  );
}
