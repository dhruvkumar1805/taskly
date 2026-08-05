"use client";

import { Check, Menu } from "lucide-react";
import { useEffect, useState } from "react";
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
import Sidebar from "./sidebar";
import CommandPalette from "./command-palette";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-screen bg-background">
      <div className="hidden md:flex h-full">
        <Sidebar user={user} onOpenCommandPalette={() => setCommandOpen(true)} />
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
              />
            </SheetContent>
          </Sheet>
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={2.75} />
          </div>
          <span className="text-base font-semibold tracking-tight">Taskly</span>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} tasks={tasks} />
    </div>
  );
}
