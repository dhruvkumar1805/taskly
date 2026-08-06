import {
  SignalHigh,
  SignalMedium,
  SignalLow,
  Circle,
  CircleDashed,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import type { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

const PRIORITY_ICON: Record<Task["priority"], LucideIcon> = {
  HIGH: SignalHigh,
  MEDIUM: SignalMedium,
  LOW: SignalLow,
};

export const PRIORITY_TEXT: Record<Task["priority"], string> = {
  HIGH: "text-primary",
  MEDIUM: "text-muted-foreground",
  LOW: "text-info",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  HIGH: "High priority",
  MEDIUM: "Medium priority",
  LOW: "Low priority",
};

/** `standalone` (default) means no adjacent visible text — the icon carries
 * its own accessible name. Pass `standalone={false}` where a visible label
 * already sits next to it (the icon becomes decorative). */
export function PriorityIcon({
  priority,
  className,
  standalone = true,
}: {
  priority: Task["priority"];
  className?: string;
  standalone?: boolean;
}) {
  const Icon = PRIORITY_ICON[priority];
  return (
    <Icon
      className={cn("h-3.5 w-3.5 shrink-0", PRIORITY_TEXT[priority], className)}
      strokeWidth={2.25}
      {...(standalone
        ? { role: "img" as const, "aria-label": PRIORITY_LABEL[priority] }
        : { "aria-hidden": true })}
    />
  );
}

const STATUS_ICON: Record<Task["status"], LucideIcon> = {
  TODO: Circle,
  IN_PROGRESS: CircleDashed,
  COMPLETED: CheckCircle2,
};

export const STATUS_TEXT: Record<Task["status"], string> = {
  TODO: "text-muted-foreground",
  IN_PROGRESS: "text-info",
  COMPLETED: "text-success",
};

export const STATUS_LABELS: Record<Task["status"], string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export function StatusIcon({
  status,
  className,
  standalone = false,
}: {
  status: Task["status"];
  className?: string;
  standalone?: boolean;
}) {
  const Icon = STATUS_ICON[status];
  return (
    <Icon
      className={cn("h-3.5 w-3.5 shrink-0", STATUS_TEXT[status], className)}
      strokeWidth={2.25}
      {...(standalone
        ? { role: "img" as const, "aria-label": STATUS_LABELS[status] }
        : { "aria-hidden": true })}
    />
  );
}
