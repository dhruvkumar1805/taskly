"use client";

import type { Task, Recurrence } from "@/generated/prisma/client";
import { motion } from "motion/react";
import { rowMotion } from "@/lib/motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Repeat } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  PriorityIcon,
  PRIORITY_TEXT,
  StatusIcon,
  STATUS_TEXT,
  STATUS_LABELS,
} from "@/components/task-icons";
import { RECURRENCE_LABELS } from "@/app/lib/recurrence";

function hasExplicitTime(date: Date) {
  return date.getHours() !== 0 || date.getMinutes() !== 0;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function getDueDateInfo(dueDate: Date, isCompleted: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const time = hasExplicitTime(dueDate) ? formatTime(dueDate) : null;
  const withTime = (label: string) => (time ? `${label}, ${time}` : label);
  const formatted = new Date(dueDate).toLocaleDateString();

  // `compact` is the time alone (or null) — used inside sections whose own
  // header already states the date ("Overdue", "Today") so the row doesn't
  // repeat it.
  if (isCompleted) return { label: formatted, compact: formatted, tone: "neutral" as const };
  if (due < today) return { label: withTime("Overdue"), compact: time, tone: "urgent" as const };
  if (due.getTime() === today.getTime())
    return { label: withTime("Due today"), compact: time, tone: "soon" as const };
  if (due.getTime() === tomorrow.getTime())
    return { label: withTime("Due tomorrow"), compact: time, tone: "soon" as const };
  return { label: withTime(formatted), compact: time, tone: "neutral" as const };
}

const DUE_TONE_STYLES: Record<"urgent" | "soon" | "neutral", string> = {
  urgent: "bg-primary/10 text-primary",
  soon: "bg-primary/5 text-primary/90",
  neutral: "bg-muted text-muted-foreground",
};

function DueBadge({
  tone,
  recurrence,
  children,
}: {
  tone: "urgent" | "soon" | "neutral";
  recurrence: Recurrence | null;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-xs font-medium ${DUE_TONE_STYLES[tone]}`}
    >
      {recurrence && (
        <>
          <Repeat className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Repeats {RECURRENCE_LABELS[recurrence]}. </span>
        </>
      )}
      {children}
    </span>
  );
}

type Props = {
  task: Task;
  isPending?: boolean;
  isSelected?: boolean;
  /** "compact" shows just the time (or nothing) — for sections whose header
   * already states the date, e.g. "Overdue" / "Today". */
  dueDisplay?: "full" | "compact";
  detailsOpen: boolean;
  onDetailsOpenChange: (open: boolean) => void;
  onEdit: (task: Task) => void;
  onToggleCompleted: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskRow({
  task,
  isPending,
  isSelected,
  dueDisplay = "full",
  detailsOpen,
  onDetailsOpenChange,
  onEdit,
  onToggleCompleted,
  onToggleStatus,
  onDelete,
}: Props) {
  const isCompleted = task.status === "COMPLETED";
  const dueDateInfo = task.dueDate ? getDueDateInfo(task.dueDate, isCompleted) : null;
  const isOverdue = dueDateInfo?.tone === "urgent";
  const dueLabel = dueDateInfo
    ? dueDisplay === "compact"
      ? dueDateInfo.compact
      : dueDateInfo.label
    : null;

  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isSelected) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [isSelected]);

  return (
    <>
      <motion.div
        ref={rowRef}
        layout="position"
        initial={rowMotion.initial}
        animate={rowMotion.animate}
        exit={rowMotion.exit}
        transition={rowMotion.transition}
        className={`flex items-start gap-3 px-3.5 py-3 transition-[background-color,opacity] duration-150 ease-(--ease-out-quart) hover:bg-muted/30 sm:items-center sm:px-4 ${
          isSelected ? "bg-accent ring-1 ring-inset ring-ring" : isOverdue ? "bg-primary/[0.035]" : ""
        } ${isPending ? "pointer-events-none opacity-60" : ""}`}
      >
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggleCompleted(task.id)}
          className="relative shrink-0 after:absolute after:-inset-3 after:content-[''] data-[state=checked]:scale-105 motion-reduce:data-[state=checked]:scale-100"
        />

        <div className="min-w-0 flex-1">
          <div
            role="button"
            onClick={() => onDetailsOpenChange(true)}
            className="cursor-pointer"
          >
            <p
              className={`text-sm font-medium leading-snug transition-colors duration-200 ease-(--ease-out-quart) ${
                isCompleted ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:truncate">
                {task.description}
              </p>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
            <PriorityIcon priority={task.priority} className="h-3.5 w-3.5" />
            {dueLabel && (
              <DueBadge tone={dueDateInfo!.tone} recurrence={task.recurrence}>
                {dueLabel}
              </DueBadge>
            )}
            <button
              type="button"
              onClick={() => onToggleStatus(task.id)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-xs font-medium transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted sm:h-7 ${STATUS_TEXT[task.status]}`}
            >
              <StatusIcon status={task.status} />
              {STATUS_LABELS[task.status]}
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <PriorityIcon
            priority={task.priority}
            className="h-3.5 w-3.5"
          />
          {dueLabel && (
            <DueBadge tone={dueDateInfo!.tone} recurrence={task.recurrence}>
              {dueLabel}
            </DueBadge>
          )}
          <button
            type="button"
            onClick={() => onToggleStatus(task.id)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-xs font-medium transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted sm:h-7 ${STATUS_TEXT[task.status]}`}
          >
            <StatusIcon status={task.status} />
            {STATUS_LABELS[task.status]}
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-9 w-9 shrink-0 sm:h-7 sm:w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <Dialog open={detailsOpen} onOpenChange={onDetailsOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>

          {task.description && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs font-medium">
            <span className={`inline-flex items-center gap-1 ${PRIORITY_TEXT[task.priority]}`}>
              <PriorityIcon priority={task.priority} standalone={false} />
              {task.priority}
            </span>
            <span className={`inline-flex items-center gap-1 ${STATUS_TEXT[task.status]}`}>
              <StatusIcon status={task.status} />
              {STATUS_LABELS[task.status]}
            </span>
            {dueDateInfo && (
              <DueBadge tone={dueDateInfo.tone} recurrence={task.recurrence}>
                {dueDateInfo.label}
              </DueBadge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
