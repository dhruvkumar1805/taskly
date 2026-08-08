"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GROUPS: { title: string; items: { keys: string[]; label: string }[] }[] = [
  {
    title: "Global",
    items: [
      { keys: ["⌘", "K"], label: "Open search / command palette" },
      { keys: ["N"], label: "New task" },
      { keys: ["?"], label: "Show this help" },
    ],
  },
  {
    title: "Navigate",
    items: [
      { keys: ["G", "T"], label: "Go to Today" },
      { keys: ["G", "M"], label: "Go to My Tasks" },
      { keys: ["/"], label: "Focus search (My Tasks)" },
    ],
  },
  {
    title: "Selected task",
    items: [
      { keys: ["↑", "↓"], label: "Move selection" },
      { keys: ["Enter"], label: "Open task" },
      { keys: ["E"], label: "Edit task" },
      { keys: ["X"], label: "Toggle complete" },
      { keys: ["⌫"], label: "Delete task" },
      { keys: ["Esc"], label: "Deselect" },
    ],
  },
];

export default function ShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>A list of keyboard shortcuts available in Taskly.</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="space-y-5">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {group.title}
              </p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      {item.keys.map((key) => (
                        <kbd
                          key={key}
                          className="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
