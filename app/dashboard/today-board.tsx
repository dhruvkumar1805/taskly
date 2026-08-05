"use client";

import {
  useMemo,
  useRef,
  useState,
  useOptimistic,
  useTransition,
  startTransition,
} from "react";
import type { Task } from "@/generated/prisma/client";
import {
  createTask,
  updateTask,
  toggleTaskCompleted,
  toggleTaskStatus,
  deleteTask,
} from "../actions/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CalendarClock, ListChecks, Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import TaskForm from "./task-form";
import TaskRow from "./tasks/task-row";
import { useListKeyboardNav } from "@/hooks/use-list-keyboard-nav";

type OptimisticAction =
  | { type: "toggle_completed"; id: string }
  | { type: "toggle_status"; id: string };

function optimisticReducer(tasks: Task[], action: OptimisticAction): Task[] {
  return tasks.map((t) => {
    if (t.id !== action.id) return t;
    if (action.type === "toggle_completed") {
      return { ...t, status: t.status === "COMPLETED" ? "TODO" : "COMPLETED" } as Task;
    }
    const next =
      t.status === "TODO" ? "IN_PROGRESS" : t.status === "IN_PROGRESS" ? "COMPLETED" : "TODO";
    return { ...t, status: next } as Task;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function QuickAdd() {
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const fd = new FormData();
    fd.set("title", trimmed);
    fd.set("priority", "MEDIUM");
    fd.set("dueDate", new Date().toISOString());

    startTransition(async () => {
      await createTask(fd);
      setTitle("");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3"
    >
      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task for today, then press Enter"
        disabled={pending}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
      />
      {pending && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
    </form>
  );
}

function Section({
  title,
  icon,
  tone,
  count,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  tone?: "urgent";
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2 px-0.5">
        <span className={tone === "urgent" ? "text-primary" : "text-muted-foreground"}>
          {icon}
        </span>
        <h2 className={`text-sm font-semibold ${tone === "urgent" ? "text-primary" : ""}`}>
          {title}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function TodayBoard({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, optimisticReducer);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

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

  function handleToggleCompleted(id: string) {
    const wasCompleted = optimisticTasks.find((t) => t.id === id)?.status === "COMPLETED";
    addPending(id);
    startTransition(async () => {
      applyOptimistic({ type: "toggle_completed", id });
      await toggleTaskCompleted(id);
      toast.success(wasCompleted ? "Task marked as pending" : "Task completed");
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
      duration: 4000,
    });
    const timer = setTimeout(async () => {
      deleteTimers.current.delete(id);
      await deleteTask(id);
    }, 4000);
    deleteTimers.current.set(id, timer);
  }

  const { overdue, dueToday, upNext, upNextTotal, completedToday, isEmpty, taskById } =
    useMemo(() => {
      const visible = optimisticTasks.filter((t) => !pendingDeletes.has(t.id));
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const overdue: Task[] = [];
      const dueToday: Task[] = [];
      const upNext: Task[] = [];
      const completedToday: Task[] = [];

      for (const task of visible) {
        if (task.status === "COMPLETED") {
          if (isSameDay(new Date(task.updatedAt), new Date())) completedToday.push(task);
          continue;
        }
        if (!task.dueDate) {
          upNext.push(task);
          continue;
        }
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due < today) overdue.push(task);
        else if (due.getTime() === today.getTime()) dueToday.push(task);
        else upNext.push(task);
      }

      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
      upNext.sort((a, b) => {
        if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      const upNextVisible = upNext.slice(0, 6);
      const taskById = new Map(
        [...overdue, ...dueToday, ...upNextVisible, ...completedToday].map((t) => [t.id, t]),
      );

      return {
        overdue,
        dueToday,
        upNext: upNextVisible,
        upNextTotal: upNext.length,
        completedToday,
        isEmpty: visible.length === 0,
        taskById,
      };
    }, [optimisticTasks, pendingDeletes]);

  const flatIds = useMemo(
    () => [...overdue, ...dueToday, ...upNext, ...completedToday].map((t) => t.id),
    [overdue, dueToday, upNext, completedToday],
  );

  const { selectedId } = useListKeyboardNav(
    flatIds,
    {
      onOpen: (id) => setOpenDetailsId(id),
      onEdit: (id) => {
        const t = taskById.get(id);
        if (t) {
          setEditingTask(t);
          setEditOpen(true);
        }
      },
      onToggleCompleted: handleToggleCompleted,
      onDelete: handleDelete,
    },
    !editOpen && !openDetailsId,
  );

  const rowProps = {
    onEdit: (t: Task) => {
      setEditingTask(t);
      setEditOpen(true);
    },
    onToggleCompleted: handleToggleCompleted,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDelete,
  };

  return (
    <div className="space-y-6 md:space-y-7">
      <QuickAdd />

      {isEmpty ? (
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-5 py-16 text-center">
          <div className="rounded-full bg-muted p-4 text-muted-foreground">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium">Nothing on your list yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first task above to get started.
            </p>
          </div>
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <Section
              title="Overdue"
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="urgent"
              count={overdue.length}
            >
              {overdue.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isPending={pendingIds.has(task.id)}
                  isSelected={selectedId === task.id}
                  detailsOpen={openDetailsId === task.id}
                  onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                  {...rowProps}
                />
              ))}
            </Section>
          )}

          <Section
            title="Today"
            icon={<CalendarClock className="h-4 w-4" />}
            count={dueToday.length}
          >
            {dueToday.length > 0 ? (
              dueToday.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isPending={pendingIds.has(task.id)}
                  isSelected={selectedId === task.id}
                  detailsOpen={openDetailsId === task.id}
                  onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                  {...rowProps}
                />
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-border px-3.5 py-4 text-sm text-muted-foreground">
                Nothing due today.
              </p>
            )}
          </Section>

          {upNext.length > 0 && (
            <Section
              title="Up next"
              icon={<ListChecks className="h-4 w-4" />}
              count={upNext.length}
            >
              {upNext.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isPending={pendingIds.has(task.id)}
                  isSelected={selectedId === task.id}
                  detailsOpen={openDetailsId === task.id}
                  onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                  {...rowProps}
                />
              ))}
              {upNextTotal > upNext.length && (
                <Link
                  href="/dashboard/tasks"
                  className="block px-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  +{upNextTotal - upNext.length} more in My Tasks →
                </Link>
              )}
            </Section>
          )}

          {completedToday.length > 0 && (
            <div className="border-t border-border pt-5">
              <p className="mb-2.5 px-0.5 text-xs font-medium text-muted-foreground">
                Completed today · {completedToday.length}
              </p>
              <div className="space-y-2 opacity-70">
                {completedToday.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isPending={pendingIds.has(task.id)}
                    isSelected={selectedId === task.id}
                    detailsOpen={openDetailsId === task.id}
                    onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                    {...rowProps}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              action={updateTask.bind(null, editingTask.id)}
              submitLabel="Save changes"
              onSubmit={() => {
                setEditOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedId && (
        <div className="fixed bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-popover px-4 py-2 font-mono text-xs text-muted-foreground shadow-lg md:flex">
          <span>
            <kbd className="text-foreground">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="text-foreground">enter</kbd> open
          </span>
          <span>
            <kbd className="text-foreground">e</kbd> edit
          </span>
          <span>
            <kbd className="text-foreground">x</kbd> done
          </span>
          <span>
            <kbd className="text-foreground">⌫</kbd> delete
          </span>
        </div>
      )}
    </div>
  );
}
