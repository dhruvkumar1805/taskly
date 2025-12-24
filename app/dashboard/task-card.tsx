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

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
};

export default function TaskCard({ task, onEdit }: Props) {
  const [open, setOpen] = useState(false);

  const isCompleted = task.status === "COMPLETED";

  return (
    <Card className="relative rounded-xl p-5 transition hover:shadow-sm flex flex-col h-full">
      <Badge variant="secondary" className="absolute left-5 top-5 text-xs">
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
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-8 flex items-start gap-3 flex-1">
        <form
          onClick={(e) => e.stopPropagation()}
          action={toggleTaskCompleted.bind(null, task.id)}
          className="pt-1"
        >
          <Checkbox
            checked={isCompleted}
            className="
    transition-all
    duration-200
    ease-out
    data-[state=checked]:scale-105
    data-[state=unchecked]:scale-100
    hover:border-primary
    active:scale-95
  "
            onClick={() => {
              (document.activeElement as HTMLElement)
                ?.closest("form")
                ?.requestSubmit();
            }}
          />
        </form>

        <div
          role="button"
          onClick={() => setOpen(true)}
          className="flex flex-1 cursor-pointer flex-col gap-1 rounded-md hover:bg-muted/50 h-full"
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
            {task.dueDate ? (
              <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            ) : (
              <span />
            )}

            <form action={toggleTaskStatus.bind(null, task.id)}>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
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
            <Badge variant="secondary">{task.priority}</Badge>
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
