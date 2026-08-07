import { CheckCircle2, ListTodo, Repeat } from "lucide-react";
import { PriorityIcon } from "@/components/task-icons";
import type { Task } from "@/generated/prisma/client";

type Tone = "urgent" | "soon" | "neutral";

const TONE: Record<Tone, string> = {
  urgent: "bg-primary/10 text-primary",
  soon: "bg-primary/5 text-primary/90",
  neutral: "bg-muted text-muted-foreground",
};

const ROWS: {
  title: string;
  priority: Task["priority"];
  due: string;
  tone: Tone;
  recurring?: boolean;
  done?: boolean;
}[] = [
  { title: "Ship the Q3 billing update", priority: "HIGH", due: "Overdue", tone: "urgent" },
  {
    title: "Daily standup notes",
    priority: "MEDIUM",
    due: "Today, 9:30 AM",
    tone: "soon",
    recurring: true,
  },
  { title: "Review design handoff", priority: "LOW", due: "Tomorrow", tone: "neutral" },
  { title: "Draft release notes", priority: "MEDIUM", due: "Done", tone: "neutral", done: true },
];

/**
 * A static (no client JS) rendering of the real task-panel visual language —
 * used on auth pages, where every extra script matters, instead of the
 * animated version used on the marketing landing page.
 */
export function StaticTaskPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          Today
        </div>
        <span className="font-mono text-xs text-muted-foreground">{ROWS.length} tasks</span>
      </div>
      <div className="divide-y divide-border">
        {ROWS.map((row) => (
          <div key={row.title} className="flex items-center gap-3 px-4 py-3.5">
            {row.done ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            ) : (
              <span className="h-4 w-4 shrink-0 rounded-[4px] border border-border" />
            )}
            <span
              className={`flex-1 truncate text-sm ${
                row.done ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {row.title}
            </span>
            <PriorityIcon priority={row.priority} className="h-3.5 w-3.5" />
            <span
              className={`flex shrink-0 items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-xs font-medium ${TONE[row.tone]}`}
            >
              {row.recurring && <Repeat className="h-3 w-3" aria-hidden="true" />}
              {row.due}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
