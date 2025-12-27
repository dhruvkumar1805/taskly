"use client";

import { Task } from "@/generated/prisma/client";
import {
  toggleTaskStatus,
  deleteTask,
  toggleTaskCompleted,
} from "../actions/tasks";
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

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
};

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  HIGH: "bg-red-500/10 text-red-600 border-red-500/30",
  MEDIUM: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  LOW: "bg-blue-500/10 text-blue-600 border-blue-500/30",
};

export default function TaskCard({ task, onEdit }: Props) {
  const [open, setOpen] = useState(false);

  const isCompleted = task.status === "COMPLETED";

  return (
    <Card
      className="
    relative
    rounded-xl
    p-5
    shadow-[0_1px_2px_rgba(0,0,0,0.04)]
    dark:shadow-[0_1px_2px_rgba(0,0,0,0.25)]
    transition-all
    duration-200
    ease-out
    hover:-translate-y-[2px]
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
    dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.45)]
  "
    >
      <Badge
        variant="outline"
        className={`
    absolute left-5 top-5 text-xs font-medium
    transition-colors duration-200
    ${PRIORITY_STYLES[task.priority]}
  `}
      >
        {task.priority}
      </Badge>

      <div className="absolute right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              onClick={(e) => e.stopPropagation()}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={async () => {
                await deleteTask(task.id);
                toast.error("Task deleted");
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 flex items-start gap-3 flex-1">
        <div
          role="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 cursor-pointer flex-col gap-1 h-full"
        >
          <h3
            className={`line-clamp-2 font-medium ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex gap-4 items-start">
              <form
                onClick={(e) => e.stopPropagation()}
                action={async () => {
                  await toggleTaskCompleted(task.id);
                  toast.success(
                    isCompleted ? "Task marked as pending" : "Task completed"
                  );
                }}
                className="pt-1 flex items-center"
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={async () => {
                    await toggleTaskCompleted(task.id);

                    toast.success(
                      isCompleted ? "Task marked as pending" : "Task completed"
                    );
                  }}
                  className="
                transition-all duration-200 ease-out
                data-[state=checked]:scale-105
                hover:border-primary
                active:scale-95
                "
                />
              </form>
              {task.dueDate ? (
                <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  Due {new Date(task.dueDate).toLocaleDateString()}
                </span>
              ) : (
                <span />
              )}
            </div>

            <form
              onClick={(e) => e.stopPropagation()}
              action={toggleTaskStatus.bind(null, task.id)}
            >
              <Button
                variant="outline"
                size="sm"
                className={`
      h-7 px-2 text-xs
      transition-all duration-200 ease-out
      ${
        task.status === "COMPLETED"
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
          : "hover:bg-muted"
      }
    `}
              >
                {task.status.replace("_", " ")}
              </Button>
            </form>
          </div>
        </div>
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

          <div className="mt-4 flex gap-2">
            <Badge
              variant="outline"
              className={`font-medium ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </Badge>

            <Badge variant="outline">{task.status.replace("_", " ")}</Badge>

            {task.dueDate && (
              <Badge variant="outline">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
