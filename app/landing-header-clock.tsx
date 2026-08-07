"use client";

import { useEffect, useState } from "react";

export function HeaderClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hidden items-center gap-1.5 border-l border-border pl-4 font-mono text-xs text-muted-foreground lg:flex">
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      <time suppressHydrationWarning>
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </time>
    </span>
  );
}
