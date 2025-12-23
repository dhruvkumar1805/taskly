import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Welcome, {session.user?.email}</h1>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="border px-4 py-2">Sign out</button>
      </form>
    </div>
  );
}
