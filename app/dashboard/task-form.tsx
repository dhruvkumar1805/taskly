"use client";

import { createTask } from "@/app/actions/tasks";

export default function TaskForm() {
  return (
    <form action={createTask} className="flex gap-2">
      <input
        name="title"
        placeholder="New task"
        className="border p-2 flex-1"
        required
      />

      <select name="priority" defaultValue="MEDIUM" className="border p-2">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>

      <button className="bg-black text-white px-4">Add</button>
    </form>
  );
}
