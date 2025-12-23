"use client";

import { createTask } from "@/app/actions/tasks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskForm({ onSubmit }: { onSubmit?: () => void }) {
  return (
    <form
      action={createTask}
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border bg-card p-4"
    >
      <Input name="title" placeholder="Task title" required />

      <Textarea
        name="description"
        placeholder="Description (optional)"
        rows={3}
      />

      <div className="flex gap-3">
        <Select name="priority" defaultValue="MEDIUM">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        <Input type="date" name="dueDate" className="w-[160px]" />

        <Button type="submit">Add</Button>
      </div>
    </form>
  );
}
