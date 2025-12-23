"use client";

import { LayoutDashboard, CheckCircle2, ListTodo, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "./task-form";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-72 border-r bg-card px-4 py-6 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="font-semibold leading-none">Taskly</p>
            <p className="text-xs text-muted-foreground">Workspace</p>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6 w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Task
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>

          <div className="rounded-xl border bg-card p-4">
            <TaskForm onSubmit={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Separator className="mb-4" />

      <div className="mb-2 text-xs font-medium text-muted-foreground">
        MAIN MENU
      </div>

      <nav className="space-y-1 text-sm">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded px-3 py-2 transition ${
            isActive("/dashboard")
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <span className="flex items-center gap-3 rounded px-3 py-2 text-muted-foreground cursor-not-allowed">
          <ListTodo className="h-4 w-4" />
          My Tasks
        </span>

        <span className="flex items-center gap-3 rounded px-3 py-2 text-muted-foreground cursor-not-allowed">
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </span>
      </nav>

      <div className="flex-1" />
    </aside>
  );
}
