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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { PriorityIcon } from "@/components/task-icons";

export default function TaskForm({
  task,
  action,
  submitLabel = "Add",
  onSubmit,
}: {
  task?: Task;
  action?: (formData: FormData) => Promise<void>;
  submitLabel?: string;
  onSubmit?: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await (action ?? createTask)(formData);
      onSubmit?.();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        rows={4}
      />

      <div className="md:flex items-center justify-between gap-3 space-y-4 md:space-y-0">
        <div className="flex flex-col gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-50 justify-start text-left font-normal ${
                  !dueDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <input
            type="hidden"
            name="dueDate"
            value={dueDate ? dueDate.toISOString() : ""}
          />
        </div>
        <Select name="priority" defaultValue={task?.priority ?? "MEDIUM"}>
          <SelectTrigger className="w-30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">
              <PriorityIcon priority="LOW" />
              Low
            </SelectItem>
            <SelectItem value="MEDIUM">
              <PriorityIcon priority="MEDIUM" />
              Medium
            </SelectItem>
            <SelectItem value="HIGH">
              <PriorityIcon priority="HIGH" />
              High
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full cursor-pointer" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
