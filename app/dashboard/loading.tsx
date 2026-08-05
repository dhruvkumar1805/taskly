export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-3 pb-24 md:space-y-7 md:p-6 lg:p-7">
      <div className="skeleton h-[76px] rounded-lg bg-card" />
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
