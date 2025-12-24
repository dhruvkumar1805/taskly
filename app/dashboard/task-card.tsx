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
import { MoreHorizontal } from "lucide-react";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
};

export default function TaskCard({ task, onEdit }: Props) {
  const isCompleted = task.status === "COMPLETED";

  return (
    <Card className="relative rounded-xl p-5 transition hover:shadow-sm">
      <Badge variant="secondary" className="absolute left-5 top-5 text-xs">
        {task.priority}
      </Badge>

      <div className="absolute right-4 top-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
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

      <div className="mt-8 flex items-start gap-3">
        <form action={toggleTaskCompleted.bind(null, task.id)} className="pt-1">
          <Checkbox
            checked={isCompleted}
            onClick={() => {
              (document.activeElement as HTMLElement)
                ?.closest("form")
                ?.requestSubmit();
            }}
          />
        </form>
        <div className="flex flex-1 flex-col gap-1">
          <h3
            className={`font-medium leading-snug ${
              isCompleted ? "line-through text-muted-foreground" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-muted-foreground leading-snug">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
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
    </Card>
  );
}
