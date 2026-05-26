import Link from "next/link";

export default function Filters({
  current,
}: {
  current: {
    status?: string;
    priority?: string;
    overdue?: boolean;
  };
}) {
  function build(params: Record<string, string | undefined>) {
    const cleaned = Object.entries(params).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    const q = new URLSearchParams(cleaned);
    return `/dashboard?${q.toString()}`;
  }

  function linkClass(isActive: boolean) {
    return `border px-3 py-1 rounded ${
      isActive ? "bg-muted text-foreground" : "text-muted-foreground"
    }`;
  }

  return (
    <div className="flex gap-2 text-sm">
      <Link
        href="/dashboard"
        className={linkClass(!current.status && !current.priority && !current.overdue)}
      >
        All
      </Link>

      <Link
        href={build({ status: "TODO" })}
        className={linkClass(current.status === "TODO")}
      >
        Todo
      </Link>

      <Link
        href={build({ status: "IN_PROGRESS" })}
        className={linkClass(current.status === "IN_PROGRESS")}
      >
        In Progress
      </Link>

      <Link
        href={build({ status: "COMPLETED" })}
        className={linkClass(current.status === "COMPLETED")}
      >
        Completed
      </Link>

      <Link href={build({ overdue: "1" })} className={linkClass(Boolean(current.overdue))}>
        Overdue
      </Link>
    </div>
  );
}
