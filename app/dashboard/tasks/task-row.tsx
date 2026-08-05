"use client";

import type { Task } from "@/generated/prisma/client";
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
import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

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

  const withTime = (label: string) =>
    hasExplicitTime(dueDate) ? `${label}, ${formatTime(dueDate)}` : label;

  const formatted = new Date(dueDate).toLocaleDateString();

  if (isCompleted) return { label: formatted, tone: "neutral" as const };
  if (due < today) return { label: withTime("Overdue"), tone: "urgent" as const };
  if (due.getTime() === today.getTime())
    return { label: withTime("Due today"), tone: "soon" as const };
  if (due.getTime() === tomorrow.getTime())
    return { label: withTime("Due tomorrow"), tone: "soon" as const };
  return { label: withTime(formatted), tone: "neutral" as const };
}

const DUE_TONE_STYLES: Record<"urgent" | "soon" | "neutral", string> = {
  urgent: "bg-primary/10 text-primary",
  soon: "bg-primary/5 text-primary/90",
  neutral: "bg-muted text-muted-foreground",
};

const PRIORITY_DOT: Record<Task["priority"], string> = {
  HIGH: "bg-primary",
  MEDIUM: "bg-muted-foreground/50",
  LOW: "bg-info",
};

const PRIORITY_TEXT: Record<Task["priority"], string> = {
  HIGH: "text-primary",
  MEDIUM: "text-muted-foreground",
  LOW: "text-info",
};

const STATUS_BUTTON_STYLES: Record<Task["status"], string> = {
  TODO: "",
  IN_PROGRESS: "border-info/40 text-info hover:bg-info/10",
  COMPLETED: "border-success/40 text-success hover:bg-success/10",
};

const STATUS_LABELS: Record<Task["status"], string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

type Props = {
  task: Task;
  isPending?: boolean;
  isSelected?: boolean;
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
  detailsOpen,
  onDetailsOpenChange,
  onEdit,
  onToggleCompleted,
  onToggleStatus,
  onDelete,
}: Props) {
  const isCompleted = task.status === "COMPLETED";
  const dueDateInfo = task.dueDate ? getDueDateInfo(task.dueDate, isCompleted) : null;

  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isSelected) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [isSelected]);

  return (
    <>
      <div
        ref={rowRef}
        className={`flex items-start gap-3 rounded-lg border bg-card px-3 py-3 transition-colors duration-150 hover:bg-muted/30 sm:items-center sm:px-4 ${
          isSelected ? "border-ring ring-2 ring-ring" : "border-border"
        } ${isPending ? "pointer-events-none opacity-60" : ""}`}
      >
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggleCompleted(task.id)}
          className="shrink-0 transition-transform duration-150 data-[state=checked]:scale-105"
        />

        <div className="min-w-0 flex-1">
          <div
            role="button"
            onClick={() => onDetailsOpenChange(true)}
            className="cursor-pointer"
          >
            <p
              className={`text-sm font-medium leading-snug ${
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
          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:hidden">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${PRIORITY_TEXT[task.priority]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              {task.priority}
            </span>
            {dueDateInfo && (
              <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${DUE_TONE_STYLES[dueDateInfo.tone]}`}>
                {dueDateInfo.label}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(task.id)}
              className={`h-7 px-2 text-xs transition-colors duration-150 ${STATUS_BUTTON_STYLES[task.status]}`}
            >
              {STATUS_LABELS[task.status]}
            </Button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${PRIORITY_TEXT[task.priority]}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            {task.priority}
          </span>
          {dueDateInfo && (
            <span className={`rounded-sm px-2 py-0.5 text-xs font-medium ${DUE_TONE_STYLES[dueDateInfo.tone]}`}>
              {dueDateInfo.label}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(task.id)}
            className={`h-7 px-2 text-xs transition-colors duration-150 ${STATUS_BUTTON_STYLES[task.status]}`}
          >
            {STATUS_LABELS[task.status]}
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0">
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
      </div>

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

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className={`inline-flex items-center gap-1.5 ${PRIORITY_TEXT[task.priority]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
              {task.priority}
            </span>
            <span className="text-muted-foreground">{STATUS_LABELS[task.status]}</span>
            {dueDateInfo && (
              <span className={`rounded-sm px-2 py-0.5 ${DUE_TONE_STYLES[dueDateInfo.tone]}`}>
                {dueDateInfo.label}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
