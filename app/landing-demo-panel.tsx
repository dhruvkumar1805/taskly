"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ListTodo, Repeat } from "lucide-react";
import { PriorityIcon } from "@/components/task-icons";
import type { Task } from "@/generated/prisma/client";

type DemoStatus = "TODO" | "COMPLETED";
type Tone = "urgent" | "soon" | "neutral";

const DUE_TONE: Record<Tone, string> = {
  urgent: "bg-primary/10 text-primary",
  soon: "bg-primary/5 text-primary/90",
  neutral: "bg-muted text-muted-foreground",
};

function DemoCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 ease-(--ease-out-quart) ${
        checked ? "border-primary bg-primary" : "border-border bg-transparent"
      }`}
    >
      <motion.svg
        viewBox="0 0 24 24"
        className="h-2.5 w-2.5 text-primary-foreground"
        initial={false}
        animate={{ scale: checked ? 1 : 0.5, opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
      >
        <path
          d="M20 6L9 17l-5-5"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </span>
  );
}

function DemoRow({
  title,
  priority,
  status,
  due,
  tone,
  recurring,
}: {
  title: string;
  priority: Task["priority"];
  status: DemoStatus;
  due: string;
  tone: Tone;
  recurring?: boolean;
}) {
  const isDone = status === "COMPLETED";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3.5"
    >
      <DemoCheckbox checked={isDone} />
      <span
        className={`flex-1 truncate text-sm transition-colors duration-300 ${
          isDone ? "text-muted-foreground line-through" : "text-foreground"
        }`}
      >
        {title}
      </span>
      <PriorityIcon priority={priority} className="h-3.5 w-3.5" />
      <span
        className={`flex shrink-0 items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-xs font-medium ${DUE_TONE[tone]}`}
      >
        {recurring && <Repeat className="h-3 w-3" aria-hidden="true" />}
        {due}
      </span>
    </motion.div>
  );
}

export default function LandingDemoPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(prefersReducedMotion ? 2 : 0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const t1 = setTimeout(() => setStep(1), 1500);
    const t2 = setTimeout(() => setStep(2), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [prefersReducedMotion]);

  const standupDone = step >= 1;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          Today
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {step >= 2 ? 4 : 3} tasks
        </span>
      </div>

      <div className="divide-y divide-border">
        <DemoRow
          title="Ship the Q3 billing update"
          priority="HIGH"
          status="TODO"
          due="Overdue"
          tone="urgent"
        />
        <DemoRow
          title="Daily standup notes"
          priority="MEDIUM"
          status={standupDone ? "COMPLETED" : "TODO"}
          due={standupDone ? "Today" : "Today, 9:30 AM"}
          tone="soon"
          recurring
        />
        <DemoRow
          title="Review design handoff"
          priority="LOW"
          status="TODO"
          due="Tomorrow"
          tone="neutral"
        />
        <AnimatePresence>
          {step >= 2 && (
            <DemoRow
              key="spawned"
              title="Daily standup notes"
              priority="MEDIUM"
              status="TODO"
              due="Tomorrow, 9:30 AM"
              tone="neutral"
              recurring
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
