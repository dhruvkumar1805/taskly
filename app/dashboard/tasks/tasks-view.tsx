"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Task } from "@/generated/prisma/client";
import { updateTask } from "@/app/actions/tasks";
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
import { ChevronDown, ClipboardList, Plus, Search, SearchX } from "lucide-react";
import Link from "next/link";
import TaskRow from "./task-row";
import TaskForm from "@/app/dashboard/task-form";
import { useListKeyboardNav } from "@/hooks/use-list-keyboard-nav";
import { useTaskActions } from "@/hooks/use-task-actions";

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

const STATUS_SECTIONS = [
  { key: "TODO" as const, label: "To do", color: "text-foreground" },
  { key: "IN_PROGRESS" as const, label: "In progress", color: "text-info" },
  { key: "COMPLETED" as const, label: "Completed", color: "text-success" },
];

// Rows rendered (and animated) per status group before a "Show more" reveal
// is needed — keeps hundreds of tasks from ever hitting the DOM at once.
const PAGE_SIZE = 50;

export default function TasksView({ tasks }: { tasks: Task[] }) {
  const { visibleTasks: activeTasks, pendingIds, handleToggleCompleted, handleToggleStatus, handleDelete } =
    useTaskActions(tasks);

  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [priority, setPriority] = useState<PriorityFilter>("ALL");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

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

  // Cap rows actually rendered (and animated) per status group instead of
  // virtualizing — a "Show more" reveal keeps hundreds of tasks from ever
  // hitting the DOM/AnimatePresence at once, without the complexity and
  // risk of retrofitting a windowed list onto the existing exit/reorder
  // animations.
  const [shownCounts, setShownCounts] = useState<Record<string, number>>({});
  function showMore(key: string) {
    setShownCounts((prev) => ({ ...prev, [key]: (prev[key] ?? PAGE_SIZE) + PAGE_SIZE }));
  }

  const visibleTasks = activeTasks
    .filter((t) => {
      if (status !== "ALL" && t.status !== status) return false;
      if (priority !== "ALL" && t.priority !== priority) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q))
          return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const hasAnyVisible = visibleTasks.length > 0;

  const taskById = useMemo(() => new Map(visibleTasks.map((t) => [t.id, t])), [visibleTasks]);

  const flatIds = useMemo(() => {
    const ids: string[] = [];
    for (const { key } of STATUS_SECTIONS) {
      if (collapsed.has(key)) continue;
      const shown = shownCounts[key] ?? PAGE_SIZE;
      let count = 0;
      for (const t of visibleTasks) {
        if (t.status !== key) continue;
        if (count >= shown) break;
        ids.push(t.id);
        count++;
      }
    }
    return ids;
  }, [visibleTasks, collapsed, shownCounts]);

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
    !editOpen && !createOpen && !openDetailsId,
  );

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="animate-scale-in rounded-lg border border-border bg-card p-2.5 md:p-3">
        <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-sm font-semibold">All tasks</h2>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Search and filter your active work.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="hidden gap-2 sm:flex"
          >
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search tasks ( / )"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              className="h-10 w-full rounded-md border border-input bg-background px-10 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
              <SelectTrigger className="h-10 w-full min-w-0 bg-background sm:w-40">
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
              <SelectTrigger className="h-10 w-full min-w-0 bg-background sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {!hasAnyVisible ? (
        <div className="animate-fade-up flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-5 py-14 text-center md:py-16">
          <div className="rounded-full bg-muted p-4 text-muted-foreground">
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
            <>
              <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                New Task
              </Button>
              <p className="text-xs text-muted-foreground">
                Faster: the quick-add bar on{" "}
                <Link href="/dashboard" className="font-medium text-foreground underline underline-offset-2">
                  Today
                </Link>{" "}
                parses dates and priority as you type — try “tomorrow 3pm !high”.
              </p>
            </>
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
        <div className="space-y-5 md:space-y-6">
          {STATUS_SECTIONS.map(({ key, label, color }) => {
            const allSectionTasks = visibleTasks.filter((t) => t.status === key);
            if (allSectionTasks.length === 0) return null;

            const shown = shownCounts[key] ?? PAGE_SIZE;
            const sectionTasks = allSectionTasks.slice(0, shown);
            const remaining = allSectionTasks.length - sectionTasks.length;

            const isCollapsed = collapsed.has(key);

            return (
              <div
                key={key}
                className="animate-fade-up overflow-hidden rounded-lg border border-border bg-card"
              >
                <button
                  onClick={() => toggleCollapse(key)}
                  className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted/30 sm:px-4"
                >
                  <motion.span
                    animate={{ rotate: isCollapsed ? -90 : 0 }}
                    transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
                    className="flex text-muted-foreground"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                  <span className={`text-sm font-semibold ${color}`}>{label}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {allSectionTasks.length}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="divide-y divide-border">
                        <AnimatePresence mode="popLayout" initial={false}>
                          {sectionTasks.map((task) => (
                            <TaskRow
                              key={task.id}
                              task={task}
                              isPending={pendingIds.has(task.id)}
                              isSelected={selectedId === task.id}
                              detailsOpen={openDetailsId === task.id}
                              onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                              onEdit={(t) => { setEditingTask(t); setEditOpen(true); }}
                              onToggleCompleted={handleToggleCompleted}
                              onToggleStatus={handleToggleStatus}
                              onDelete={handleDelete}
                            />
                          ))}
                        </AnimatePresence>
                        {remaining > 0 && (
                          <button
                            type="button"
                            onClick={() => showMore(key)}
                            className="block w-full px-3.5 py-2.5 text-left text-sm text-muted-foreground transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted/30 hover:text-foreground sm:px-4"
                          >
                            Show {Math.min(remaining, PAGE_SIZE)} more
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
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
              submitLabel="Save Changes"
              onSubmit={() => { setEditOpen(false); setEditingTask(null); }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-150 ease-(--ease-out-quart) active:scale-90 motion-reduce:active:scale-100 md:hidden"
        aria-label="New task"
      >
        <Plus className="h-6 w-6" />
      </button>

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
