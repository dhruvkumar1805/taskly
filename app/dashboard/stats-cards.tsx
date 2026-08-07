"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
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

const SEGMENT_COLOR = {
  todo: "bg-muted-foreground/30",
  inProgress: "bg-info",
  completed: "bg-success",
} as const;

export default function StatsCards({ stats }: { stats: Stats }) {
  const todo = Math.max(stats.total - stats.inProgress - stats.completed, 0);
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const hasOverdue = stats.overdue > 0;
  const divisor = Math.max(stats.total, 1);

  const segments = [
    { key: "todo" as const, label: "To do", value: todo },
    { key: "inProgress" as const, label: "In progress", value: stats.inProgress },
    { key: "completed" as const, label: "Completed", value: stats.completed },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
            <AnimatedNumber value={pct} />
            <span className="text-lg text-muted-foreground">%</span>
          </span>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-mono font-medium text-foreground">
              <AnimatedNumber value={stats.completed} />
            </span>{" "}
            of{" "}
            <span className="font-mono font-medium text-foreground">
              <AnimatedNumber value={stats.total} />
            </span>{" "}
            tasks complete
          </p>
        </div>

        {hasOverdue && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            <AnimatedNumber value={stats.overdue} /> overdue
          </span>
        )}
      </div>

      <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {segments.map(
          ({ key, value }) =>
            value > 0 && (
              <motion.div
                key={key}
                className={SEGMENT_COLOR[key]}
                initial={false}
                animate={{ width: `${(value / divisor) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              />
            ),
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {segments.map(({ key, label, value }) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${SEGMENT_COLOR[key]}`} aria-hidden="true" />
            {label}
            <span className="font-mono font-medium text-foreground">
              <AnimatedNumber value={value} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
