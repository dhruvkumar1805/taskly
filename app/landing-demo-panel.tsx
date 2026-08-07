"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ListTodo, Plus, Repeat } from "lucide-react";
import { PriorityIcon } from "@/components/task-icons";
import { durations, easeOutQuart, rowMotion } from "@/lib/motion";
import type { Task } from "@/generated/prisma/client";

type DemoStatus = "TODO" | "COMPLETED";
type Tone = "urgent" | "soon" | "neutral";

const DUE_TONE: Record<Tone, string> = {
  urgent: "bg-primary/10 text-primary",
  soon: "bg-primary/5 text-primary/90",
  neutral: "bg-muted text-muted-foreground",
};

const CAPTURE_TEXT = "landlord tomorrow 3pm !high";
const CHAR_DELAY_MS = 42;
const TYPE_DURATION_MS = CAPTURE_TEXT.length * CHAR_DELAY_MS;

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
        transition={{ duration: durations.fast, ease: easeOutQuart }}
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
    <motion.div {...rowMotion} className="flex items-center gap-3 px-4 py-3.5">
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

function CaptureBar({ typed, showCaret }: { typed: string; showCaret: boolean }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
      <Plus className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 items-center font-mono text-sm">
        <span className={`truncate ${typed ? "text-foreground" : "text-muted-foreground"}`}>
          {typed || "Add a task…"}
        </span>
        {showCaret && (
          <span
            className="animate-caret-blink ml-0.5 h-3.5 w-px shrink-0 bg-primary"
            aria-hidden="true"
          />
        )}
      </span>
    </div>
  );
}

export default function LandingDemoPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(prefersReducedMotion ? 4 : 0);
  const [typedChars, setTypedChars] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const typeStart = 700;
    const capturedAt = typeStart + TYPE_DURATION_MS + 350;
    const standupDoneAt = capturedAt + 1100;
    const spawnedAt = standupDoneAt + 700;
    const timers = [
      setTimeout(() => setStep(1), typeStart),
      setTimeout(() => setStep(2), capturedAt),
      setTimeout(() => setStep(3), standupDoneAt),
      setTimeout(() => setStep(4), spawnedAt),
    ];
    return () => timers.forEach(clearTimeout);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (step !== 1) return;
    const id = setInterval(() => {
      setTypedChars((c) => (c >= CAPTURE_TEXT.length ? c : c + 1));
    }, CHAR_DELAY_MS);
    return () => clearInterval(id);
  }, [step]);

  const capturing = step === 1;
  const captured = step >= 2;
  const standupDone = step >= 3;
  const spawned = step >= 4;
  const taskCount = 3 + (captured ? 1 : 0) + (spawned ? 1 : 0);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          Today
        </div>
        <span className="font-mono text-xs text-muted-foreground">{taskCount} tasks</span>
      </div>

      <CaptureBar
        typed={capturing ? CAPTURE_TEXT.slice(0, typedChars) : ""}
        showCaret={!prefersReducedMotion}
      />

      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {captured && (
            <DemoRow
              key="captured"
              title="Landlord"
              priority="HIGH"
              status="TODO"
              due="Tomorrow, 3:00 PM"
              tone="neutral"
            />
          )}
          <DemoRow
            key="billing"
            title="Ship the Q3 billing update"
            priority="HIGH"
            status="TODO"
            due="Overdue"
            tone="urgent"
          />
          <DemoRow
            key="standup"
            title="Daily standup notes"
            priority="MEDIUM"
            status={standupDone ? "COMPLETED" : "TODO"}
            due={standupDone ? "Today" : "Today, 9:30 AM"}
            tone="soon"
            recurring
          />
          <DemoRow
            key="review"
            title="Review design handoff"
            priority="LOW"
            status="TODO"
            due="Tomorrow"
            tone="neutral"
          />
          {spawned && (
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
