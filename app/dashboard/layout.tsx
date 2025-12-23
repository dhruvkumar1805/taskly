import { auth } from "@/lib/auth";
import Sidebar from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen">
      <Sidebar user={session?.user} />
      <main className="flex-1 overflow-y-auto [color-scheme:dark]">
        {children}
      </main>
    </div>
  );
}
