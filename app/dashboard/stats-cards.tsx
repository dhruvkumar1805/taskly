"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle2, CircleDashed, ListChecks } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from "motion/react";

type Stats = {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

function AnimatedNumber({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toString());
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      motionValue.jump(value);
      return;
    }
    if (prefersReducedMotion) {
      motionValue.jump(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1],
    });
    return () => controls.stop();
  }, [value, motionValue, prefersReducedMotion]);

  return <motion.span>{rounded}</motion.span>;
}

const RING_RADIUS = 18;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function CompletionRing({ pct }: { pct: number }) {
  const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * pct) / 100;

  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center md:h-22 md:w-22">
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle cx="22" cy="22" r={RING_RADIUS} fill="none" strokeWidth="3.5" className="stroke-muted" />
        <motion.circle
          cx="22"
          cy="22"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={RING_CIRCUMFERENCE}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-lg font-bold tracking-tight md:text-xl">
          <AnimatedNumber value={pct} />
          <span className="text-xs font-semibold text-muted-foreground">%</span>
        </span>
      </div>
    </div>
  );
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const hasOverdue = stats.overdue > 0;

  const metrics = [
    { label: "Total", value: stats.total, icon: ListChecks, tone: "text-muted-foreground" },
    { label: "In progress", value: stats.inProgress, icon: CircleDashed, tone: "text-info" },
    { label: "Completed", value: stats.completed, icon: CheckCircle2, tone: "text-success" },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: AlertTriangle,
      tone: hasOverdue ? "text-primary" : "text-muted-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center md:gap-6 md:p-5">
      <div className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
        <CompletionRing pct={pct} />
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase sm:text-center">
          Completion
        </span>
      </div>

      <div className="h-px w-full bg-border sm:h-auto sm:w-px sm:self-stretch" />

      <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, tone }) => (
          <div key={label}>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {label}
            </div>
            <p
              className={`mt-1.5 font-mono text-2xl font-semibold tracking-tight ${
                label === "Overdue" && hasOverdue ? "text-primary" : ""
              }`}
            >
              <AnimatedNumber value={value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
