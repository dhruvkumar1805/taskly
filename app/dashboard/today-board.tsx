"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { Task } from "@/generated/prisma/client";
import { updateTask } from "../actions/tasks";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Inbox,
  ListChecks,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import TaskForm from "./task-form";
import TaskRow from "./tasks/task-row";
import { useListKeyboardNav } from "@/hooks/use-list-keyboard-nav";
import { useTaskActions } from "@/hooks/use-task-actions";
import { parseQuickAdd } from "./parse-quick-add";
import { PriorityIcon } from "@/components/task-icons";

function formatPreviewDate(date: Date, hasTime: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOnly = new Date(date);
  dayOnly.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dayOnly.getTime() - today.getTime()) / 86400000);

  let label: string;
  if (diffDays === 0) label = "Today";
  else if (diffDays === 1) label = "Tomorrow";
  else if (diffDays === -1) label = "Yesterday";
  else label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  if (hasTime) {
    label += `, ${date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
  }
  return label;
}

function QuickAdd({
  title,
  onTitleChange,
  onCreate,
  inputRef,
}: {
  title: string;
  onTitleChange: (title: string) => void;
  onCreate: (task: Task, formData: FormData) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const parsed = useMemo(() => (title.trim() ? parseQuickAdd(title) : null), [title]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    const { title: parsedTitle, dueDate, hasTime, priority } = parseQuickAdd(trimmed);
    if (!parsedTitle) return;

    const resolvedPriority = priority ?? "MEDIUM";
    const resolvedDueDate = dueDate ?? new Date();
    if (!hasTime) resolvedDueDate.setHours(0, 0, 0, 0);

    const fd = new FormData();
    fd.set("title", parsedTitle);
    fd.set("priority", resolvedPriority);
    fd.set("dueDate", resolvedDueDate.toISOString());

    const tempTask: Task = {
      id: crypto.randomUUID(),
      title: parsedTitle,
      description: null,
      priority: resolvedPriority,
      status: "TODO",
      dueDate: resolvedDueDate,
      completedAt: null,
      recurrence: null,
      recurrenceCreatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "",
    };

    onTitleChange("");
    onCreate(tempTask, fd);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-3 shadow-lg transition-colors duration-150 ease-(--ease-out-quart) focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 md:shadow-none"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Plus className="h-3.5 w-3.5" />
      </span>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Add a task — try “tomorrow 3pm !high”"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <AnimatePresence>
        {parsed && (parsed.dueDate || parsed.priority) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="flex shrink-0 items-center gap-1.5"
          >
            {parsed.priority && <PriorityIcon priority={parsed.priority} />}
            {parsed.dueDate && (
              <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono text-xs whitespace-nowrap text-primary">
                {formatPreviewDate(parsed.dueDate, parsed.hasTime)}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div
        className={`flex items-center gap-2 border-b border-border px-3.5 py-2.5 sm:px-4 ${
          tone === "urgent" ? "bg-primary/[0.035]" : ""
        }`}
      >
        <span className={tone === "urgent" ? "text-primary" : "text-muted-foreground"}>
          {icon}
        </span>
        <h2 className={`text-sm font-semibold ${tone === "urgent" ? "text-primary" : ""}`}>
          {title}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

const MORE_LINK_CLASS =
  "block px-3.5 py-2.5 text-sm text-muted-foreground transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted/30 hover:text-foreground sm:px-4";

const QUICK_ADD_EXAMPLES = [
  "Reply to Sam tomorrow 9am !high",
  "Renew passport friday !medium",
  "Water the plants",
];

function EmptyState({ onPickExample }: { onPickExample: (example: string) => void }) {
  return (
    <div className="animate-fade-up rounded-lg border border-border bg-card px-5 py-12 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="mt-4 font-medium">Nothing on your list yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Type into the box above — dates, times, and !priority are parsed as you go.
      </p>
      <div className="mx-auto mt-5 flex max-w-md flex-col gap-2">
        {QUICK_ADD_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPickExample(example)}
            className="rounded-md border border-dashed border-border px-3 py-2 text-left font-mono text-xs text-muted-foreground transition-colors duration-150 ease-(--ease-out-quart) hover:border-primary/30 hover:border-solid hover:bg-primary/5 hover:text-foreground"
          >
            “{example}”
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TodayBoard({ tasks }: { tasks: Task[] }) {
  const { visibleTasks, pendingIds, handleCreate, handleToggleCompleted, handleToggleStatus, handleDelete } =
    useTaskActions(tasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const {
    overdue,
    dueToday,
    upNext,
    upNextTotal,
    someday,
    somedayTotal,
    completedToday,
    isEmpty,
    taskById,
  } = useMemo(() => {
    const visible = visibleTasks;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue: Task[] = [];
    const dueToday: Task[] = [];
    const upNext: Task[] = [];
    const someday: Task[] = [];
    const completedToday: Task[] = [];

    for (const task of visible) {
      if (task.status === "COMPLETED") {
        if (task.completedAt) {
          const completedDay = new Date(task.completedAt);
          completedDay.setHours(0, 0, 0, 0);
          if (completedDay.getTime() === today.getTime()) completedToday.push(task);
        }
        continue;
      }
      if (!task.dueDate) {
        someday.push(task);
        continue;
      }
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < today) overdue.push(task);
      else if (due.getTime() === today.getTime()) dueToday.push(task);
      else upNext.push(task);
    }

    const byDueDate = (a: Task, b: Task) =>
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    overdue.sort(byDueDate);
    dueToday.sort(byDueDate);
    upNext.sort(byDueDate);

    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
    someday.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    completedToday.sort(
      (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime(),
    );

    const upNextVisible = upNext.slice(0, 6);
    const somedayVisible = someday.slice(0, 5);
    const taskById = new Map(
      [...overdue, ...dueToday, ...upNextVisible, ...somedayVisible, ...completedToday].map(
        (t) => [t.id, t],
      ),
    );

    return {
      overdue,
      dueToday,
      upNext: upNextVisible,
      upNextTotal: upNext.length,
      someday: somedayVisible,
      somedayTotal: someday.length,
      completedToday,
      isEmpty: visible.length === 0,
      taskById,
    };
  }, [visibleTasks]);

  const flatIds = useMemo(
    () => [...overdue, ...dueToday, ...upNext, ...someday, ...completedToday].map((t) => t.id),
    [overdue, dueToday, upNext, someday, completedToday],
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

  const quickAdd = (
    <QuickAdd
      title={quickAddTitle}
      onTitleChange={setQuickAddTitle}
      onCreate={handleCreate}
      inputRef={quickAddInputRef}
    />
  );

  return (
    <div className="space-y-6 md:space-y-7">
      {/* Pinned to the bottom of the viewport on mobile — the highest-frequency
          action in the app belongs in thumb reach, not at the top of a tall
          scrolling page. Portaled to <body> rather than positioned in place:
          an ancestor (the page's animate-fade-up wrapper) ends its animation
          holding transform: translateY(0), which creates a containing block
          for position:fixed descendants — a plain fixed div here would anchor
          to that wrapper's box, not the real viewport. Desktop keeps the
          normal in-flow placement at the top, where it's the flagship
          feature worth top billing and reach isn't a constraint. */}
      {mounted && isMobile
        ? createPortal(
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              {quickAdd}
            </div>,
            document.body,
          )
        : !isMobile && quickAdd}

      {isEmpty ? (
        <EmptyState
          onPickExample={(example) => {
            setQuickAddTitle(example);
            quickAddInputRef.current?.focus();
          }}
        />
      ) : (
        <>
          {overdue.length > 0 && (
            <Section
              title="Overdue"
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="urgent"
              count={overdue.length}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {overdue.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    dueDisplay="compact"
                    isPending={pendingIds.has(task.id)}
                    isSelected={selectedId === task.id}
                    detailsOpen={openDetailsId === task.id}
                    onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                    {...rowProps}
                  />
                ))}
              </AnimatePresence>
            </Section>
          )}

          <Section
            title="Today"
            icon={<CalendarClock className="h-4 w-4" />}
            count={dueToday.length}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {dueToday.length > 0 ? (
                dueToday.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    dueDisplay="compact"
                    isPending={pendingIds.has(task.id)}
                    isSelected={selectedId === task.id}
                    detailsOpen={openDetailsId === task.id}
                    onDetailsOpenChange={(open) => setOpenDetailsId(open ? task.id : null)}
                    {...rowProps}
                  />
                ))
              ) : (
                <motion.p
                  key="empty-today"
                  layout="position"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-3.5 py-4 text-sm text-muted-foreground sm:px-4"
                >
                  Nothing due today.
                </motion.p>
              )}
            </AnimatePresence>
          </Section>

          {upNext.length > 0 && (
            <Section
              title="Up next"
              icon={<ListChecks className="h-4 w-4" />}
              count={upNextTotal}
            >
              <AnimatePresence mode="popLayout" initial={false}>
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
              </AnimatePresence>
              {upNextTotal > upNext.length && (
                <Link href="/dashboard/tasks" className={MORE_LINK_CLASS}>
                  +{upNextTotal - upNext.length} more in My Tasks →
                </Link>
              )}
            </Section>
          )}

          {someday.length > 0 && (
            <Section
              title="Someday"
              icon={<Inbox className="h-4 w-4" />}
              count={somedayTotal}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {someday.map((task) => (
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
              </AnimatePresence>
              {somedayTotal > someday.length && (
                <Link href="/dashboard/tasks" className={MORE_LINK_CLASS}>
                  +{somedayTotal - someday.length} more in My Tasks →
                </Link>
              )}
            </Section>
          )}

          {completedToday.length > 0 && (
            <Section
              title="Completed today"
              icon={<CheckCircle2 className="h-4 w-4" />}
              count={completedToday.length}
            >
              <AnimatePresence mode="popLayout" initial={false}>
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
              </AnimatePresence>
            </Section>
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
