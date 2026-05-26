"use client";

import {
  LayoutDashboard,
  CheckCircle2,
  ListTodo,
  Plus,
  Sun,
  Moon,
  Check,
  Command,
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
    <aside className="h-full w-full shrink-0 border-r bg-card/90 px-4 py-5 md:w-60 md:py-6 flex flex-col overflow-hidden shadow-[12px_0_36px_rgba(15,23,42,0.04)] backdrop-blur-xl dark:bg-card/80">
      <div className="mb-6 md:mb-7">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-500/25">
            <Check className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-lg leading-none">Taskly</p>
            <p className="text-xs text-muted-foreground">Focused daily work</p>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-5 h-11 w-full justify-between rounded-lg bg-foreground text-background shadow-sm shadow-foreground/10 hover:bg-foreground/90 md:mb-6 md:h-10 dark:bg-primary dark:text-primary-foreground">
            <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Task
            </span>
            <span className="hidden items-center gap-1 rounded-md bg-background/15 px-1.5 py-0.5 text-[10px] font-medium md:flex">
              <Command className="h-3 w-3" />
              N
            </span>
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

      <Separator className="mb-4 opacity-60" />

      <nav className="space-y-1.5 text-sm md:space-y-1">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-3 transition md:py-2.5 ${
            isActive("/dashboard")
              ? "bg-teal-500/10 text-teal-700 font-medium shadow-sm ring-1 ring-teal-500/15 dark:text-teal-300"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/dashboard/tasks"
          className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all md:py-2.5 ${
            isActive("/dashboard/tasks")
              ? "bg-teal-500/10 text-teal-700 font-medium shadow-sm ring-1 ring-teal-500/15 dark:text-teal-300"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          }`}
        >
          <ListTodo className="h-4 w-4 shrink-0" />
          My Tasks
        </Link>

        <span className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-muted-foreground/45 select-none text-sm md:py-2.5">
          <span className="flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4" />
            Completed
          </span>
          <span className="text-[10px] font-medium tracking-wide uppercase bg-muted px-1.5 py-0.5 rounded-md">
            soon
          </span>
        </span>
      </nav>

      <div className="flex-1" />
      <Separator className="my-4 opacity-60" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-lg border bg-background/60 px-3 py-2.5 text-left shadow-sm transition hover:bg-muted/70">
            <Avatar className="h-9 w-9 border">
              <AvatarFallback className="bg-teal-500/10 text-teal-700 dark:text-teal-300">
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
