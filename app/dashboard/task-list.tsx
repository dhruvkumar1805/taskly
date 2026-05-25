"use client";

import { useState, useRef, useEffect, useOptimistic, startTransition } from "react";
import type { Task } from "@/generated/prisma/client";
import {
  updateTask,
  toggleTaskCompleted,
  toggleTaskStatus,
  deleteTask,
} from "../actions/tasks";
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
import { ClipboardList, SearchX, Plus } from "lucide-react";
import { toast } from "sonner";

import TaskForm from "./task-form";
import TaskCard from "./task-card";
import CreateTaskCard from "../../components/create-task-card";

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
      t.status === "TODO"
        ? "IN_PROGRESS"
        : t.status === "IN_PROGRESS"
        ? "COMPLETED"
        : "TODO";
    return { ...t, status: next } as Task;
  });
}

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";
type SortOption = "created" | "due" | "priority";

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, optimisticReducer);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const deleteTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [priority, setPriority] = useState<PriorityFilter>("ALL");
  const [sort, setSort] = useState<SortOption>("created");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

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

  const filteredTasks = optimisticTasks
    .filter((t) => !pendingDeletes.has(t.id))
    .filter((task) => {
      if (status !== "ALL" && task.status !== status) return false;
      if (priority !== "ALL" && task.priority !== priority) return false;

      if (query) {
        const q = query.toLowerCase();
        const inTitle = task.title.toLowerCase().includes(q);
        const inDesc = task.description?.toLowerCase().includes(q);
        if (!inTitle && !inDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (a.status === "COMPLETED" && b.status !== "COMPLETED") return 1;
      if (a.status !== "COMPLETED" && b.status === "COMPLETED") return -1;

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

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks ( / )"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            className="w-full rounded-md border bg-background px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m21 21-4.35-4.35" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </div>

        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-38">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={(v) => setPriority(v as PriorityFilter)}>
          <SelectTrigger className="w-38">
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
          <SelectTrigger className="w-38">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Newest first</SelectItem>
            <SelectItem value="due">Due date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="rounded-full bg-muted p-4">
            {tasks.length === 0 ? (
              <ClipboardList className="h-6 w-6 text-muted-foreground" />
            ) : (
              <SearchX className="h-6 w-6 text-muted-foreground" />
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
              onClick={() => { setStatus("ALL"); setPriority("ALL"); setQuery(""); }}
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6 auto-rows-fr">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isPending={pendingIds.has(task.id)}
              onEdit={(t) => {
                setEditingTask(t);
                setOpen(true);
              }}
              onToggleCompleted={handleToggleCompleted}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          ))}
          <CreateTaskCard onClick={() => setCreateOpen(true)} />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          {editingTask && (
            <TaskForm
              task={editingTask}
              action={updateTask.bind(null, editingTask.id)}
              submitLabel="Save Changes"
              onSubmit={() => {
                setOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <TaskForm
            onSubmit={() => {
              setCreateOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
