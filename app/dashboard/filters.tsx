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

  return (
    <div className="flex gap-2 text-sm">
      <Link href="/dashboard" className="border px-3 py-1 rounded">
        All
      </Link>

      <Link
        href={build({ status: "TODO" })}
        className="border px-3 py-1 rounded"
      >
        Todo
      </Link>

      <Link
        href={build({ status: "IN_PROGRESS" })}
        className="border px-3 py-1 rounded"
      >
        In Progress
      </Link>

      <Link
        href={build({ status: "COMPLETED" })}
        className="border px-3 py-1 rounded"
      >
        Completed
      </Link>

      <Link href={build({ overdue: "1" })} className="border px-3 py-1 rounded">
        Overdue
      </Link>
    </div>
  );
}
