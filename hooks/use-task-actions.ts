"use client";

import { useOptimistic, useRef, useState, startTransition } from "react";
import { toast } from "sonner";
import type { Task } from "@/generated/prisma/client";
import {
  createTask,
  toggleTaskCompleted,
  toggleTaskStatus,
  deleteTask,
  updateTask,
  skipToNextOccurrence,
} from "@/app/actions/tasks";
import { getNextOccurrence } from "@/app/lib/recurrence";

type OptimisticAction =
  | { type: "toggle_completed"; id: string }
  | { type: "toggle_status"; id: string }
  | { type: "create"; task: Task }
  | { type: "edit"; id: string; patch: Partial<Task> };

function optimisticReducer(tasks: Task[], action: OptimisticAction): Task[] {
  if (action.type === "create") {
    return [action.task, ...tasks];
  }
  return tasks.map((t) => {
    if (t.id !== action.id) return t;
    if (action.type === "toggle_completed") {
      const completed = t.status !== "COMPLETED";
      return {
        ...t,
        status: completed ? "COMPLETED" : "IN_PROGRESS",
        completedAt: completed ? new Date() : null,
      } as Task;
    }
    if (action.type === "edit") {
      return { ...t, ...action.patch } as Task;
    }
    const next =
      t.status === "TODO" ? "IN_PROGRESS" : t.status === "IN_PROGRESS" ? "COMPLETED" : "TODO";
    return { ...t, status: next } as Task;
  });
}

const DELETE_UNDO_MS = 4000;

/** Optimistic create/toggle/delete for a task list, shared by every view
 * that renders TaskRow — keeps the undo-delete timer and pending-state
 * bookkeeping in one place instead of duplicated per view. */
export function useTaskActions(tasks: Task[]) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, optimisticReducer);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  function addPending(id: string) {
    setPendingIds((prev) => new Set([...prev, id]));
  }
  function removePending(id: string) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleCreate(tempTask: Task, formData: FormData) {
    addPending(tempTask.id);
    startTransition(async () => {
      applyOptimistic({ type: "create", task: tempTask });
      await createTask(formData);
      removePending(tempTask.id);
    });
  }

  function handleToggleCompleted(id: string) {
    const wasCompleted = optimisticTasks.find((t) => t.id === id)?.status === "COMPLETED";
    if (!wasCompleted && typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(15);
    }
    addPending(id);
    startTransition(async () => {
      applyOptimistic({ type: "toggle_completed", id });
      await toggleTaskCompleted(id);
      toast.success(wasCompleted ? "Task marked as pending" : "Task completed");
      removePending(id);
    });
  }

  function handleEdit(id: string, formData: FormData) {
    const dueDateRaw = formData.get("dueDate")?.toString();
    const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;
    const recurrenceRaw = formData.get("recurrence")?.toString();
    const patch: Partial<Task> = {
      title: formData.get("title")?.toString() ?? "",
      description: formData.get("description")?.toString() || null,
      priority: formData.get("priority")?.toString() as Task["priority"],
      dueDate,
      recurrence:
        dueDate && recurrenceRaw && recurrenceRaw !== "NONE"
          ? (recurrenceRaw as Task["recurrence"])
          : null,
    };
    addPending(id);
    startTransition(async () => {
      applyOptimistic({ type: "edit", id, patch });
      await updateTask(id, formData);
      removePending(id);
    });
  }

  function handleSkip(id: string) {
    const task = optimisticTasks.find((t) => t.id === id);
    if (!task?.recurrence || !task.dueDate) return;
    const nextDueDate = getNextOccurrence(task.dueDate, task.recurrence);
    addPending(id);
    startTransition(async () => {
      applyOptimistic({ type: "edit", id, patch: { dueDate: nextDueDate } });
      await skipToNextOccurrence(id);
      removePending(id);
    });
  }

  function handleToggleStatus(id: string) {
    addPending(id);
    startTransition(async () => {
      applyOptimistic({ type: "toggle_status", id });
      await toggleTaskStatus(id);
      removePending(id);
    });
  }

  function handleDelete(id: string) {
    setPendingDeletes((prev) => new Set([...prev, id]));
    toast("Task deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          const timer = deleteTimers.current.get(id);
          if (timer) clearTimeout(timer);
          deleteTimers.current.delete(id);
          setPendingDeletes((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      },
      duration: DELETE_UNDO_MS,
    });
    const timer = setTimeout(async () => {
      deleteTimers.current.delete(id);
      await deleteTask(id);
    }, DELETE_UNDO_MS);
    deleteTimers.current.set(id, timer);
  }

  const visibleTasks = optimisticTasks.filter((t) => !pendingDeletes.has(t.id));

  return {
    visibleTasks,
    pendingIds,
    handleCreate,
    handleEdit,
    handleSkip,
    handleToggleCompleted,
    handleToggleStatus,
    handleDelete,
  };
}
