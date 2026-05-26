"use client";

import { Check, Menu } from "lucide-react";
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

type DashboardUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: DashboardUser;
}) {
  return (
    <div className="h-screen bg-background bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.12),transparent_28rem),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_24rem)] dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.10),transparent_28rem),radial-gradient(circle_at_top_right,rgba(251,191,36,0.09),transparent_24rem)]">
      <div className="hidden md:flex h-full">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto bg-transparent">
          {children}
        </main>
      </div>

      <div className="flex md:hidden h-full flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b bg-card/90 px-3 py-2.5 shadow-sm backdrop-blur-xl">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="h-10 w-10 rounded-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[82vw] max-w-72 p-0">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Navigation</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>

              <Sidebar user={user} enableShortcut={false} />
            </SheetContent>
          </Sheet>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold shadow-sm shadow-teal-500/25">
            <Check size={18} />
          </div>
          <span className="text-base font-semibold">Taskly</span>
        </header>

        <main className="flex-1 overflow-y-auto bg-transparent">{children}</main>
      </div>
    </div>
  );
}
