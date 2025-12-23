import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getTasks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}
