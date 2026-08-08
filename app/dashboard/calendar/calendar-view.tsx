"use client";

import { useMemo, useState } from "react";
import { addDays, addWeeks, format, isSameDay, isToday, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityIcon } from "@/components/task-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import TaskForm from "@/app/dashboard/task-form";
import { useTasks } from "@/app/dashboard/tasks-context";

function DayColumn({
  day,
  tasks,
  onToggleCompleted,
  onEdit,
}: {
  day: Date;
  tasks: Task[];
  onToggleCompleted: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const today = isToday(day);
  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border p-2.5 ${
        today ? "border-primary/40 bg-primary/[0.03]" : "border-border bg-card"
      }`}
    >
      <div className="flex items-baseline justify-between px-0.5">
        <span className={`text-xs font-semibold ${today ? "text-primary" : "text-muted-foreground"}`}>
          {format(day, "EEE")}
        </span>
        <span className={`font-mono text-xs ${today ? "text-primary" : "text-muted-foreground"}`}>
          {format(day, "d")}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {tasks.length === 0 ? (
          <p className="px-0.5 py-2 text-xs text-muted-foreground">—</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors duration-150 ease-(--ease-out-quart) hover:bg-muted/50 ${
                task.status === "COMPLETED" ? "opacity-60" : ""
              }`}
            >
              <Checkbox
                checked={task.status === "COMPLETED"}
                onCheckedChange={() => onToggleCompleted(task.id)}
                className="h-3.5 w-3.5 shrink-0"
              />
              <button
                type="button"
                onClick={() => onEdit(task)}
                className={`min-w-0 flex-1 truncate text-left text-xs ${
                  task.status === "COMPLETED" ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.title}
              </button>
              <PriorityIcon priority={task.priority} className="h-3 w-3" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CalendarView() {
  const { visibleTasks, handleToggleCompleted, handleEdit } = useTasks();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const tasksByDay = useMemo(
    () => days.map((day) => visibleTasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), day))),
    [visibleTasks, days],
  );

  const weekLabel = `${format(weekStart, "MMM d")} – ${format(addDays(weekStart, 6), "MMM d, yyyy")}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">{weekLabel}</h1>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={() => setWeekStart(startOfWeek(new Date()))}>
            This week
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setWeekStart((w) => addWeeks(w, -1))}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setWeekStart((w) => addWeeks(w, 1))}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-7">
        {days.map((day, i) => (
          <DayColumn
            key={day.toISOString()}
            day={day}
            tasks={tasksByDay[i]}
            onToggleCompleted={handleToggleCompleted}
            onEdit={(task) => {
              setEditingTask(task);
              setEditOpen(true);
            }}
          />
        ))}
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Edit the details of this task.</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              action={(formData) => Promise.resolve(handleEdit(editingTask.id, formData))}
              submitLabel="Save changes"
              onSubmit={() => {
                setEditOpen(false);
                setEditingTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
