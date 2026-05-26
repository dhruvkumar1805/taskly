"use client";

import { Task } from "@/generated/prisma/client";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

  if (isCompleted) {
    return { label: `Due ${new Date(dueDate).toLocaleDateString()}`, className: "bg-muted text-muted-foreground" };
  }
  if (due < today) {
    return { label: "Overdue", className: "bg-red-500/10 text-red-600 border border-red-500/20" };
  }
  if (due.getTime() === today.getTime()) {
    return { label: "Due today", className: "bg-amber-500/10 text-amber-600 border border-amber-500/20" };
  }
  if (due.getTime() === tomorrow.getTime()) {
    return { label: "Due tomorrow", className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" };
  }
  return { label: `Due ${new Date(dueDate).toLocaleDateString()}`, className: "bg-muted text-muted-foreground" };
}

type Props = {
  task: Task;
  isPending?: boolean;
  onEdit: (task: Task) => void;
  onToggleCompleted: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  HIGH: "bg-rose-500/10 text-rose-700 border-rose-500/25 dark:text-rose-300",
  MEDIUM: "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-300",
  LOW: "bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-300",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-300",
  IN_PROGRESS: "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-300",
  TODO: "bg-muted/70 text-muted-foreground hover:bg-muted",
};

export default function TaskCard({ task, isPending, onEdit, onToggleCompleted, onToggleStatus, onDelete }: Props) {
  const [open, setOpen] = useState(false);

  const isCompleted = task.status === "COMPLETED";
  const dueDateInfo = task.dueDate ? getDueDateInfo(task.dueDate, isCompleted) : null;

  return (
    <Card
      className={`group relative flex min-h-48 flex-col rounded-xl border bg-card/90 p-4 md:p-5 gap-3 overflow-hidden shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-teal-500/25 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] dark:bg-card/80 dark:hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${
        isPending ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-400 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`rounded-md text-xs font-medium transition-colors duration-200 ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8 -mr-1 rounded-lg">
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
        className="flex-1 cursor-pointer space-y-2"
      >
        <h3
          className={`text-base font-semibold leading-snug tracking-tight ${
            isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="hidden sm:block line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/60">
        <div className="flex min-w-0 items-center gap-2">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggleCompleted(task.id)}
            className="transition-all duration-200 ease-out data-[state=checked]:scale-105 hover:border-primary active:scale-95"
          />
          {dueDateInfo && (
            <span className={`hidden min-w-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium sm:inline-flex ${dueDateInfo.className}`}>
              <CalendarClock className="h-3 w-3 shrink-0" />
              {dueDateInfo.label}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(task.id)}
          className={`h-8 shrink-0 rounded-lg px-2.5 text-xs font-medium transition-all duration-200 ease-out ${STATUS_STYLES[task.status]}`}
        >
          {task.status.replace("_", " ")}
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

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className={`font-medium ${PRIORITY_STYLES[task.priority]}`}>
              {task.priority}
            </Badge>
            <Badge variant="outline" className={STATUS_STYLES[task.status]}>
              {task.status.replace("_", " ")}
            </Badge>
            {dueDateInfo && (
              <Badge variant="outline" className={dueDateInfo.className}>
                {dueDateInfo.label}
              </Badge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
