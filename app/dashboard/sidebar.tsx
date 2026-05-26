"use client";

import {
  LayoutDashboard,
  CheckCircle2,
  ListTodo,
  Plus,
  Sun,
  Moon,
  Check,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import TaskForm from "./task-form";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

type SidebarProps = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  enableShortcut?: boolean;
};

export default function Sidebar({ user, enableShortcut = true }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    if (!enableShortcut) return;

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping) return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut]);

  return (
    <aside className="h-full w-60 shrink-0 border-r bg-card px-4 py-6 flex flex-col overflow-hidden">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            <Check />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-lg leading-none">Taskly</p>
            <p className="text-xs text-muted-foreground">Simplify Life</p>
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

          <div className="rounded-xl">
            <TaskForm onSubmit={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>

      <Separator className="mb-4" />

      <nav className="space-y-1 text-sm">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
            isActive("/dashboard")
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/dashboard/tasks"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            isActive("/dashboard/tasks")
              ? "bg-primary/10 text-primary font-medium border-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <ListTodo className="h-4 w-4 shrink-0" />
          My Tasks
        </Link>

        <span className="flex items-center justify-between gap-3 rounded-md px-3 py-2 text-muted-foreground/40 select-none text-sm">
          <span className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </span>
          <span className="text-[10px] font-medium tracking-wide uppercase bg-muted px-1.5 py-0.5 rounded">
            soon
          </span>
        </span>
      </nav>

      <div className="flex-1" />
      <Separator className="my-4" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">
                {user?.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark mode
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
}
