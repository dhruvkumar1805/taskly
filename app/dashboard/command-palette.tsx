"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import type { Task } from "@/generated/prisma/client";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskForm from "./task-form";
import { updateTask } from "../actions/tasks";
import {
  Sunrise,
  ListTodo,
  Plus,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

const PRIORITY_DOT: Record<Task["priority"], string> = {
  HIGH: "bg-primary",
  MEDIUM: "bg-muted-foreground/50",
  LOW: "bg-info",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
};

export default function CommandPalette({ open, onOpenChange, tasks }: Props) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openTasks = useMemo(
    () => tasks.filter((t) => t.status !== "COMPLETED").slice(0, 30),
    [tasks],
  );

  function run(action: () => void) {
    onOpenChange(false);
    action();
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Search tasks, jump to a page, run a command…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick actions">
            <CommandItem onSelect={() => run(() => setCreateOpen(true))}>
              <Plus />
              New task
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                run(() => setTheme(theme === "dark" ? "light" : "dark"))
              }
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => run(() => router.push("/dashboard"))}>
              <Sunrise />
              Today
            </CommandItem>
            <CommandItem
              onSelect={() => run(() => router.push("/dashboard/tasks"))}
            >
              <ListTodo />
              My tasks
            </CommandItem>
          </CommandGroup>

          {openTasks.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Jump to a task">
                {openTasks.map((task) => (
                  <CommandItem
                    key={task.id}
                    value={task.title}
                    onSelect={() => run(() => setEditingTask(task))}
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`}
                    />
                    <span className="truncate">{task.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          <CommandGroup heading="Account">
            <CommandItem
              className="text-destructive"
              onSelect={() =>
                run(() => signOut({ callbackUrl: "/login" }))
              }
            >
              <LogOut />
              Log out
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingTask}
        onOpenChange={(v) => !v && setEditingTask(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              action={updateTask.bind(null, editingTask.id)}
              submitLabel="Save changes"
              onSubmit={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
