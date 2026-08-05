import { cn } from "@/lib/utils";

/**
 * The Taskly mark: three ascending dots — the same priority/status signal
 * language used on every task row, escalating. Not a letterform, not a
 * checkmark; it's the product's own visual grammar turned into a mark.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3.6" cy="11.6" r="1.15" fill="currentColor" />
      <circle cx="8.2" cy="8" r="1.55" fill="currentColor" />
      <circle cx="12.6" cy="4.2" r="2.05" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: "sm" | "md";
  showWordmark?: boolean;
  className?: string;
}) {
  const box = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const glyph = size === "sm" ? "h-4 w-4" : "h-4.5 w-4.5";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
          box
        )}
      >
        <LogoMark className={glyph} />
      </div>
      {showWordmark && <span className="font-semibold tracking-tight">Taskly</span>}
    </div>
  );
}
