"use client";

import { useState } from "react";
import type { Task } from "@/generated/prisma/client";
import { deleteTask, toggleTaskStatus } from "../actions/tasks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  const filteredTasks = tasks.filter((task) => {
    if (status !== "ALL" && task.status !== status) return false;
    if (priority !== "ALL" && task.priority !== priority) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityFilter)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
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
    </div>
  );
}
