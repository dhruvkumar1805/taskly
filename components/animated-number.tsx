"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useTransform, animate } from "motion/react";
import { easeOutQuart } from "@/lib/motion";

export function AnimatedNumber({
  value,
  duration = 0.45,
  ease = easeOutQuart,
}: {
  value: number;
  duration?: number;
  ease?: readonly [number, number, number, number];
}) {
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
    const controls = animate(motionValue, value, { duration, ease });
    return () => controls.stop();
  }, [value, motionValue, prefersReducedMotion, duration, ease]);

  return <motion.span>{rounded}</motion.span>;
}
