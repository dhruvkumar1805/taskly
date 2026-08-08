"use client";

import { createContext, useContext } from "react";
import type { Task } from "@/generated/prisma/client";
import { useTaskActions } from "@/hooks/use-task-actions";

type TasksContextValue = ReturnType<typeof useTaskActions>;

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ tasks, children }: { tasks: Task[]; children: React.ReactNode }) {
  const value = useTaskActions(tasks);
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a TasksProvider");
  return ctx;
}
