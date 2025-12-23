"use client";

import { createTask } from "@/app/actions/tasks";

export default function TaskForm() {
  return (
    <form action={createTask} className="space-y-2">
      <input
        name="title"
        placeholder="Task title"
        className="border p-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        className="border p-2 w-full"
        rows={3}
      />

      <div className="flex gap-2">
        <select name="priority" defaultValue="MEDIUM" className="border p-2">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>

        <input type="date" name="dueDate" className="border p-2" />

        <button className="bg-black text-white px-4">Add</button>
      </div>
    </form>
  );
}
