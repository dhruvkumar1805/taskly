"use client";

import type { Task } from "@/generated/prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

function getDueDateInfo(dueDate: Date, isCompleted: boolean) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  if (isCompleted) return { label: new Date(dueDate).toLocaleDateString(), className: "bg-muted text-muted-foreground" };
  if (due < today) return { label: "Overdue", className: "bg-red-500/10 text-red-600 border border-red-500/20" };
  if (due.getTime() === today.getTime()) return { label: "Due today", className: "bg-amber-500/10 text-amber-600 border border-amber-500/20" };
  if (due.getTime() === tomorrow.getTime()) return { label: "Due tomorrow", className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" };
  return { label: new Date(dueDate).toLocaleDateString(), className: "bg-muted text-muted-foreground" };
}

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  HIGH: "bg-red-500/10 text-red-600 border-red-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  LOW: "bg-blue-500/10 text-blue-600 border-blue-500/30",
};

const STATUS_STYLES: Record<Task["status"], string> = {
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  IN_PROGRESS: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  TODO: "hover:bg-muted",
};

type Props = {
  task: Task;
  isPending?: boolean;
  onEdit: (task: Task) => void;
  onToggleCompleted: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskRow({
  task,
  isPending,
  onEdit,
  onToggleCompleted,
  onToggleStatus,
  onDelete,
}: Props) {
  const isCompleted = task.status === "COMPLETED";
  const dueDateInfo = task.dueDate ? getDueDateInfo(task.dueDate, isCompleted) : null;

  return (
    <div
      className={`flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-all hover:bg-muted/30 ${
        isPending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => onToggleCompleted(task.id)}
        className="shrink-0 transition-all duration-200 data-[state=checked]:scale-105"
      />

      <div
        role="button"
        onClick={() => onEdit(task)}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <p
          className={`text-sm font-medium leading-snug truncate ${
            isCompleted ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {task.description}
          </p>
        )}
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <Badge
          variant="outline"
          className={`text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
        >
          {task.priority}
        </Badge>
        {dueDateInfo && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ${dueDateInfo.className}`}
          >
            {dueDateInfo.label}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(task.id)}
          className={`h-7 px-2 text-xs transition-all duration-200 ${STATUS_STYLES[task.status]}`}
        >
          {task.status.replace("_", " ")}
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
  );
}
