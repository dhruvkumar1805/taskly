export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <div className="rounded-lg border border-border bg-card p-4 md:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="skeleton h-8 w-20 rounded bg-muted md:h-9" />
            <div className="skeleton h-4 w-32 rounded bg-muted" />
          </div>
        </div>
        <div className="skeleton mt-4 h-2 rounded-full bg-muted" />
        <div className="mt-3 flex gap-4">
          <div className="skeleton h-3.5 w-16 rounded bg-muted" />
          <div className="skeleton h-3.5 w-20 rounded bg-muted" />
          <div className="skeleton h-3.5 w-24 rounded bg-muted" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-2.5 md:p-3">
        <div className="mb-2.5 flex items-center justify-between gap-3 px-1">
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-20 rounded bg-muted" />
            <div className="skeleton hidden h-3 w-40 rounded bg-muted sm:block" />
          </div>
        </div>
        <div className="skeleton h-10 rounded-md bg-muted" />
      </div>

      <div className="space-y-2.5">
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
      </div>
    </div>
  );
}
