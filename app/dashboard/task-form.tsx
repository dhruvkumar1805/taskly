"use client";

import type { Task } from "@/generated/prisma/client";
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

export default function TaskForm({
  task,
  action,
  submitLabel = "Add",
  onSubmit,
}: {
  task?: Task;
  action?: (formData: FormData) => void;
  submitLabel?: string;
  onSubmit?: () => void;
}) {
  return (
    <form
      action={action ?? createTask}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <Input
        name="title"
        placeholder="Task title"
        defaultValue={task?.title}
        required
      />

      <Textarea
        name="description"
        placeholder="Description (optional)"
        defaultValue={task?.description ?? ""}
        rows={3}
      />

      <div className="flex gap-3">
        <Select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          name="dueDate"
          defaultValue={
            task?.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
          }
          className="w-[160px]"
        />

        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
