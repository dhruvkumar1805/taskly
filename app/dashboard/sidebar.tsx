import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Taskly</h1>
        <p className="text-sm text-muted-foreground">Task Manager</p>
      </div>

      <Separator className="mb-4" />

      <nav className="space-y-2 text-sm">
        <Link
          href="/dashboard"
          className="block rounded px-3 py-2 hover:bg-muted"
        >
          Dashboard
        </Link>

        <span className="block rounded px-3 py-2 text-muted-foreground cursor-not-allowed">
          Tasks
        </span>
      </nav>
    </aside>
  );
}
