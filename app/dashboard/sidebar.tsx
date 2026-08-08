"use client";

import {
  ListTodo,
  Plus,
  Search,
  Sun,
  Moon,
  Command,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/logo";
import { AnimatedNumber } from "@/components/animated-number";
import { popMotion, durations, easeOutQuart } from "@/lib/motion";
import { useTasks } from "./tasks-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useEffect, useMemo } from "react";
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
  onOpenCreateTask?: () => void;
};

export default function Sidebar({
  user,
  enableShortcut = true,
  onNavigate,
  onOpenCommandPalette,
  onOpenCreateTask,
}: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { visibleTasks } = useTasks();
  const overdueCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visibleTasks.filter((t) => {
      if (t.status === "COMPLETED" || !t.dueDate) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < today;
    }).length;
  }, [visibleTasks]);

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
        onOpenCreateTask?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, onOpenCreateTask]);

  return (
    <aside className="h-full w-full shrink-0 bg-sidebar px-4 py-5 md:w-60 md:py-6 flex flex-col overflow-hidden">
      <div className="mb-6 md:mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LogoMark className="h-4.5 w-4.5" />
          </div>
          <div className="space-y-1">
            <p className="text-[15px] font-bold leading-none tracking-tight">Taskly</p>
            <p className="font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Focused daily work
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          onNavigate?.();
          onOpenCommandPalette?.();
        }}
        className="mb-4 flex h-9 w-full items-center gap-2 rounded-md border border-border bg-background px-3 text-left text-sm text-muted-foreground transition-all duration-150 ease-(--ease-out-quart) hover:text-foreground active:scale-[0.98] motion-reduce:active:scale-100"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1">Search…</span>
        <span className="flex shrink-0 items-center gap-0.5 font-mono text-[10px]">
          <Command className="h-3 w-3" />K
        </span>
      </button>

      <Button
        onClick={() => {
          onNavigate?.();
          onOpenCreateTask?.();
        }}
        className="mb-5 h-10 w-full justify-between md:mb-6"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create new task
        </span>
        <span className="hidden items-center gap-1 rounded-sm bg-primary-foreground/15 px-1.5 py-0.5 font-mono text-[10px] font-medium md:flex">
          <Command className="h-3 w-3" />
          N
        </span>
      </Button>

      <nav className="space-y-0.5 text-sm">
        {[
          { href: "/dashboard", label: "Today", icon: Sun, badge: overdueCount },
          { href: "/dashboard/tasks", label: "My Tasks", icon: ListTodo, badge: 0 },
        ].map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 ease-(--ease-out-quart) ${
                active
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-md bg-sidebar-accent"
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <Icon className="relative h-4 w-4 shrink-0" />
              <span className="relative flex-1">{label}</span>
              <AnimatePresence initial={false}>
                {badge > 0 && (
                  <motion.span
                    key="overdue-badge"
                    initial={popMotion.initial}
                    animate={popMotion.animate}
                    exit={popMotion.exit}
                    transition={popMotion.transition}
                    className="relative flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-primary-foreground"
                    aria-label={`${badge} overdue`}
                  >
                    <AnimatedNumber value={badge} duration={durations.fast} ease={easeOutQuart} />
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
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
