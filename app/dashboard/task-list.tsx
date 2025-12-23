"use client";

import { useState } from "react";
import type { Task } from "@/generated/prisma/client";

type StatusFilter = "ALL" | "TODO" | "IN_PROGRESS" | "COMPLETED";
type PriorityFilter = "ALL" | "LOW" | "MEDIUM" | "HIGH";

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

      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <li key={task.id} className="border p-4 rounded space-y-1">
            <div className="flex justify-between">
              <h3 className="font-medium">{task.title}</h3>
              <span className="text-xs border px-2 py-1 rounded">
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}

            <div className="flex justify-between text-xs text-gray-500">
              <span>{task.status.replace("_", " ")}</span>
              {task.dueDate && (
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
              )}
            </div>
          </li>
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-sm text-gray-500">
            No tasks match the selected filters
          </p>
        )}
      </ul>
    </div>
  );
}
