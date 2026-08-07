export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-3 p-3 pb-24 md:space-y-5 md:p-6 lg:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="skeleton h-7 w-44 rounded bg-muted md:h-8 md:w-52" />
          <div className="skeleton h-4 w-36 rounded bg-muted" />
        </div>
        <div className="skeleton hidden h-4 w-28 rounded bg-muted sm:block" />
      </div>

      <div className="skeleton h-12 rounded-lg bg-card" />

      <div className="space-y-2.5">
        <div className="skeleton h-4 w-24 rounded bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
      </div>
    </div>
  );
}
