"use client";

import {
  LayoutDashboard,
  CheckCircle2,
  ListTodo,
  Plus,
  Search,
  Sun,
  Moon,
  Check,
  Command,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  onNavigate?: () => void;
  onOpenCommandPalette?: () => void;
};

export default function Sidebar({
  user,
  enableShortcut = true,
  onNavigate,
  onOpenCommandPalette,
}: SidebarProps) {
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
    <aside className="h-full w-full shrink-0 bg-sidebar px-4 py-5 md:w-60 md:py-6 flex flex-col overflow-hidden">
      <div className="mb-6 md:mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Check className="h-4.5 w-4.5" strokeWidth={2.75} />
          </div>
          <div className="space-y-0.5">
            <p className="font-semibold leading-none tracking-tight">Taskly</p>
            <p className="text-xs text-muted-foreground">Focused daily work</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="mb-4 flex h-9 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1">Search…</span>
        <span className="flex shrink-0 items-center gap-0.5 font-mono text-[10px]">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-5 h-10 w-full justify-between md:mb-6">
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create new task
            </span>
            <span className="hidden items-center gap-1 rounded-sm bg-primary-foreground/15 px-1.5 py-0.5 font-mono text-[10px] font-medium md:flex">
              <Command className="h-3 w-3" />
              N
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
          </DialogHeader>

          <TaskForm onSubmit={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <nav className="space-y-0.5 text-sm">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
            isActive("/dashboard")
              ? "bg-sidebar-accent font-medium text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/dashboard/tasks"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
            isActive("/dashboard/tasks")
              ? "bg-sidebar-accent font-medium text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
          }`}
        >
          <ListTodo className="h-4 w-4 shrink-0" />
          My Tasks
        </Link>

        <span className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-muted-foreground/50 select-none">
          <span className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </span>
          <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wide uppercase">
            soon
          </span>
        </span>
      </nav>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-sidebar-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium">
                {user?.name ?? "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
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
