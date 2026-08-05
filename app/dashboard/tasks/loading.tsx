export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 p-3 pb-24 md:space-y-7 md:p-6 lg:p-8">
      <div className="skeleton h-[92px] rounded-lg bg-card md:h-[104px]" />
      <div className="skeleton h-24 rounded-lg bg-card" />
      <div className="skeleton h-12 rounded-lg bg-card" />

      <div className="space-y-2.5">
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
        <div className="skeleton h-14 rounded-lg bg-card" />
      </div>
    </div>
  );
}
