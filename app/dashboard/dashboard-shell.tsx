"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import type { Task } from "@/generated/prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Logo } from "@/components/logo";
import Sidebar from "./sidebar";
import CommandPalette from "./command-palette";
import ShortcutsDialog from "./shortcuts-dialog";
import TaskForm from "./task-form";
import { TasksProvider } from "./tasks-context";

type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function DashboardShell({
  children,
  user,
  tasks,
}: {
  children: React.ReactNode;
  user?: DashboardUser;
  tasks: Task[];
}) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const pendingGoTo = useRef(false);
  const pendingGoToTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
        return;
      }

      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      // "g" then "t"/"m" — Gmail/Linear-style go-to navigation.
      if (pendingGoTo.current) {
        pendingGoTo.current = false;
        if (pendingGoToTimer.current) clearTimeout(pendingGoToTimer.current);
        const key = e.key.toLowerCase();
        if (key === "t") {
          e.preventDefault();
          router.push("/dashboard");
        } else if (key === "m") {
          e.preventDefault();
          router.push("/dashboard/tasks");
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        pendingGoTo.current = true;
        pendingGoToTimer.current = setTimeout(() => {
          pendingGoTo.current = false;
        }, 600);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShortcutsOpen((v) => !v);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <TasksProvider tasks={tasks}>
      <MotionConfig reducedMotion="user">
        <div className="h-screen bg-background">
          <div className="hidden md:flex h-full">
            <Sidebar
              user={user}
              onOpenCommandPalette={() => setCommandOpen(true)}
              onOpenCreateTask={() => setCreateTaskOpen(true)}
            />
            <main className="my-2 mr-2 flex-1 overflow-y-auto rounded-xl border border-border bg-frame">
              {children}
            </main>
          </div>

          <div className="flex md:hidden h-full flex-col">
            <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-3 py-2.5">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-10 w-10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="left" className="w-[82vw] max-w-72 p-0">
                  <SheetHeader>
                    <VisuallyHidden>
                      <SheetTitle>Navigation</SheetTitle>
                    </VisuallyHidden>
                  </SheetHeader>

                  <Sidebar
                    user={user}
                    enableShortcut={false}
                    onNavigate={() => setMobileNavOpen(false)}
                    onOpenCommandPalette={() => setCommandOpen(true)}
                    onOpenCreateTask={() => setCreateTaskOpen(true)}
                  />
                </SheetContent>
              </Sheet>
              <Logo size="sm" />
            </header>

            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>

          <CommandPalette
            open={commandOpen}
            onOpenChange={setCommandOpen}
            tasks={tasks}
            onOpenShortcuts={() => setShortcutsOpen(true)}
          />

          <Dialog open={createTaskOpen} onOpenChange={setCreateTaskOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create new task</DialogTitle>
                <VisuallyHidden>
                  <DialogDescription>Add a new task to your list.</DialogDescription>
                </VisuallyHidden>
              </DialogHeader>
              <TaskForm onSubmit={() => setCreateTaskOpen(false)} />
            </DialogContent>
          </Dialog>

          <ShortcutsDialog open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
        </div>
      </MotionConfig>
    </TasksProvider>
  );
}
