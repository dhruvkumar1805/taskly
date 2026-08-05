"use client";

import { Task } from "@/generated/prisma/client";
import { Card } from "@/components/ui/card";
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
import { CalendarClock, MoreHorizontal } from "lucide-react";
import { useState } from "react";

function getDueDateInfo(dueDate: Date, isCompleted: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const formatted = new Date(dueDate).toLocaleDateString();

  if (isCompleted) {
    return { label: `Due ${formatted}`, tone: "neutral" as const };
  }
  if (due < today) {
    return { label: "Overdue", tone: "urgent" as const };
  }
  if (due.getTime() === today.getTime()) {
    return { label: "Due today", tone: "soon" as const };
  }
  if (due.getTime() === tomorrow.getTime()) {
    return { label: "Due tomorrow", tone: "soon" as const };
  }
  return { label: `Due ${formatted}`, tone: "neutral" as const };
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

const STATUS_LABELS: Record<Task["status"], string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const STATUS_BUTTON_STYLES: Record<Task["status"], string> = {
  TODO: "",
  IN_PROGRESS: "border-info/40 text-info hover:bg-info/10",
  COMPLETED: "border-success/40 text-success hover:bg-success/10",
};

type Props = {
  task: Task;
  isPending?: boolean;
  onEdit: (task: Task) => void;
  onToggleCompleted: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskCard({ task, isPending, onEdit, onToggleCompleted, onToggleStatus, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const isCompleted = task.status === "COMPLETED";
  const dueDateInfo = task.dueDate ? getDueDateInfo(task.dueDate, isCompleted) : null;

  return (
    <Card
      className={`group relative flex min-h-36 flex-col gap-2.5 rounded-lg border-border p-3.5 transition-colors duration-200 hover:border-foreground/20 md:min-h-40 md:p-4 ${
        isPending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${PRIORITY_TEXT[task.priority]}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
          {task.priority}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 -mr-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        role="button"
        onClick={() => setOpen(true)}
        className="flex-1 cursor-pointer space-y-1.5"
      >
        <h3
          className={`text-base font-semibold leading-snug tracking-tight ${
            isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2.5 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggleCompleted(task.id)}
            className="transition-transform duration-150 ease-out data-[state=checked]:scale-105 active:scale-95"
          />
          {dueDateInfo && (
            <span className={`inline-flex min-w-0 items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium ${DUE_TONE_STYLES[dueDateInfo.tone]}`}>
              <CalendarClock className="h-3 w-3 shrink-0" />
              {dueDateInfo.label}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(task.id)}
          className={`h-8 shrink-0 px-2.5 text-xs font-medium transition-colors duration-150 ${STATUS_BUTTON_STYLES[task.status]}`}
        >
          {STATUS_LABELS[task.status]}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
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
    </Card>
  );
}
