"use client";

import { useState, useRef, useOptimistic, startTransition } from "react";
import type { Task } from "@/generated/prisma/client";
import {
  updateTask,
  toggleTaskCompleted,
  toggleTaskStatus,
  deleteTask,
} from "@/app/actions/tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ClipboardList, Plus, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import TaskRow from "./task-row";
import TaskForm from "@/app/dashboard/task-form";

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

type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";
type SortOption = "created" | "due" | "priority";

const STATUS_SECTIONS = [
  { key: "TODO" as const, label: "To Do", color: "text-foreground" },
  { key: "IN_PROGRESS" as const, label: "In Progress", color: "text-amber-600" },
  { key: "COMPLETED" as const, label: "Completed", color: "text-emerald-600" },
];

export default function TasksView({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, optimisticReducer);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [priority, setPriority] = useState<PriorityFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("created");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

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

  function toggleCollapse(key: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  const visibleTasks = optimisticTasks
    .filter((t) => !pendingDeletes.has(t.id))
    .filter((t) => {
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q))
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "due") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sort === "priority") {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
        return order[a.priority] - order[b.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const hasAnyVisible = visibleTasks.length > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur-xl md:p-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              className="h-11 w-full rounded-lg border bg-background/80 px-10 text-sm shadow-sm outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 sm:h-10"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button onClick={() => setCreateOpen(true)} className="h-11 gap-2 shrink-0 rounded-lg sm:hidden">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:contents">
          <Select value={priority} onValueChange={(v) => setPriority(v as PriorityFilter)}>
            <SelectTrigger className="h-11 rounded-lg bg-background/80 shadow-sm sm:h-10">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="h-11 rounded-lg bg-background/80 shadow-sm sm:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Newest first</SelectItem>
              <SelectItem value="due">Due date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="gap-2 hidden rounded-lg bg-foreground text-background hover:bg-foreground/90 sm:flex ml-auto dark:bg-primary dark:text-primary-foreground">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
        </div>
      </div>

      {!hasAnyVisible ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card/80 px-5 py-14 text-center shadow-sm backdrop-blur-xl md:py-16">
          <div className="rounded-full bg-teal-500/10 p-4 text-teal-700 dark:text-teal-300">
            {tasks.length === 0 ? (
              <ClipboardList className="h-6 w-6" />
            ) : (
              <SearchX className="h-6 w-6" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {tasks.length === 0
                ? "Create your first task to get started."
                : "Try adjusting your search or filters."}
            </p>
          </div>
          {tasks.length === 0 ? (
            <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { setPriority("ALL"); setQuery(""); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-5 md:space-y-6">
          {STATUS_SECTIONS.map(({ key, label, color }) => {
            const sectionTasks = visibleTasks.filter((t) => t.status === key);
            if (sectionTasks.length === 0) return null;

            const isCollapsed = collapsed.has(key);

            return (
              <div key={key}>
                <button
                  onClick={() => toggleCollapse(key)}
                  className="flex items-center gap-2 mb-3 rounded-lg px-1 py-1 transition hover:bg-muted/50 group"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm font-semibold ${color}`}>{label}</span>
                  <span className="text-xs font-medium bg-muted text-muted-foreground rounded-full px-1.5 py-0.5">
                    {sectionTasks.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-2">
                    {sectionTasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        isPending={pendingIds.has(task.id)}
                        onEdit={(t) => { setEditingTask(t); setEditOpen(true); }}
                        onToggleCompleted={handleToggleCompleted}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              action={updateTask.bind(null, editingTask.id)}
              submitLabel="Save Changes"
              onSubmit={() => { setEditOpen(false); setEditingTask(null); }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg shadow-foreground/25 transition-transform active:scale-95 md:hidden dark:bg-primary dark:text-primary-foreground"
        aria-label="New task"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
