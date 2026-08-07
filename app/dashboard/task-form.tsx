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
import { CalendarIcon, Loader2, Repeat } from "lucide-react";
import { format } from "date-fns";
import { useState, useTransition } from "react";
import { PriorityIcon } from "@/components/task-icons";
import { RECURRENCE_LABELS } from "@/app/lib/recurrence";
import { hasExplicitTime } from "@/app/lib/due-date";

function timeStringFrom(date: Date | undefined) {
  if (!date || !hasExplicitTime(date)) return "";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

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
  // Kept separately from dueDate so picking a new day never silently drops
  // an already-set time — the day and time-of-day are merged back together
  // on every change instead of the calendar's midnight default winning.
  const [time, setTime] = useState(() => timeStringFrom(dueDate));

  function handleDateSelect(selected: Date | undefined) {
    if (!selected) {
      setDueDate(undefined);
      return;
    }
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      selected.setHours(hours, minutes, 0, 0);
    }
    setDueDate(selected);
  }

  function handleTimeChange(value: string) {
    setTime(value);
    if (!dueDate) return;
    const next = new Date(dueDate);
    if (value) {
      const [hours, minutes] = value.split(":").map(Number);
      next.setHours(hours, minutes, 0, 0);
    } else {
      next.setHours(0, 0, 0, 0);
    }
    setDueDate(next);
  }

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

      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
        <div className="flex flex-col gap-2 md:flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-50 justify-start text-left font-normal ${
                  !dueDate && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, time ? "PPP, p" : "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Input
            type="time"
            value={time}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={!dueDate}
            className="w-32"
            aria-label="Due time"
          />

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
              <PriorityIcon priority="LOW" standalone={false} />
              Low
            </SelectItem>
            <SelectItem value="MEDIUM">
              <PriorityIcon priority="MEDIUM" standalone={false} />
              Medium
            </SelectItem>
            <SelectItem value="HIGH">
              <PriorityIcon priority="HIGH" standalone={false} />
              High
            </SelectItem>
          </SelectContent>
        </Select>

        <Select name="recurrence" defaultValue={task?.recurrence ?? "NONE"} disabled={!dueDate}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NONE">
              <Repeat className="h-4 w-4 text-muted-foreground" />
              No repeat
            </SelectItem>
            {Object.entries(RECURRENCE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                <Repeat className="h-4 w-4 text-muted-foreground" />
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!dueDate && (
          <p className="text-xs text-muted-foreground">Pick a date to repeat this task.</p>
        )}
      </div>
      <Button className="w-full cursor-pointer" type="submit" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : submitLabel}
      </Button>
    </form>
  );
}
