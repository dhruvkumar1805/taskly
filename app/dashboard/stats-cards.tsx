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

export default function StatsCards({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const hasOverdue = stats.overdue > 0;

  const cards = [
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
    <div className="rounded-lg border border-border bg-card">
      <div className="grid grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="p-3.5 md:p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon className={`h-3.5 w-3.5 ${tone}`} />
              {label}
            </div>
            <p
              className={`mt-2 font-mono text-2xl font-semibold tracking-tight ${
                label === "Overdue" && hasOverdue ? "text-primary" : ""
              }`}
            >
              <AnimatedNumber value={value} />
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3.5 md:p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Completion</span>
          <span className="font-mono font-medium">
            <AnimatedNumber value={pct} />%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-(--ease-out-quart)"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
