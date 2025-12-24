"use client";

import { useState } from "react";
import type { Task } from "@/generated/prisma/client";
import { deleteTask, toggleTaskStatus, updateTask } from "../actions/tasks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import TaskForm from "./task-form";

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

function isOverdue(task: { dueDate: Date | null; status: string }) {
  if (!task.dueDate) return false;
  if (task.status === "COMPLETED") return false;
  return new Date(task.dueDate) < new Date();
}

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [priority, setPriority] = useState<PriorityFilter>("ALL");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (status !== "ALL" && task.status !== status) return false;
    if (priority !== "ALL" && task.priority !== priority) return false;

    if (query) {
      const q = query.toLowerCase();
      const inTitle = task.title.toLowerCase().includes(q);
      const inDesc = task.description?.toLowerCase().includes(q);
      if (!inTitle && !inDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            className="w-full rounded-md border bg-background px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="m21 21-4.35-4.35" />
            <circle cx="11" cy="11" r="8" />
          </svg>
        </div>
      </div>

      <div className="flex gap-3">
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">Todo</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as PriorityFilter)}
        >
          <SelectTrigger className="w-[180px]">
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

      <ul className="space-y-4">
        {filteredTasks.map((task) => {
          const overdue = isOverdue(task);

          return (
            <Card
              key={task.id}
              className={overdue ? "border-destructive/50" : ""}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <h3 className="font-medium leading-none">{task.title}</h3>

                  {task.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                </div>

                <Badge variant="outline">{task.priority}</Badge>
              </CardHeader>

              <CardContent className="flex items-center justify-between text-sm">
                <form action={toggleTaskStatus.bind(null, task.id)}>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                  >
                    {task.status.replace("_", " ")}
                  </Button>
                </form>

                <div className="flex items-center gap-3 text-muted-foreground">
                  {overdue && (
                    <span className="text-destructive font-medium">
                      Overdue
                    </span>
                  )}

                  {task.dueDate && (
                    <span>
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingTask(task);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <form action={deleteTask.bind(null, task.id)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}

        {filteredTasks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tasks match the selected filters
          </p>
        )}
      </ul>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          {editingTask && (
            <TaskForm
              task={editingTask}
              action={updateTask.bind(null, editingTask.id)}
              submitLabel="Save Changes"
              onSubmit={() => {
                setOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
