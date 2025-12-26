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

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  return (
    <div className="h-screen">
      <div className="hidden md:flex h-full">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto bg-muted/60 bg-dashboard">
          {children}
        </main>
      </div>

      <div className="flex md:hidden h-full flex-col">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-60">
              <SheetHeader>
                <VisuallyHidden>
                  <SheetTitle>Navigation</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>

              <Sidebar user={user} />
            </SheetContent>
          </Sheet>
          <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            <Check size={20} />
          </div>
          <span className="text-lg font-semibold">Taskly</span>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
