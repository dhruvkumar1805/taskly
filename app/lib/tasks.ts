import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const getTasks = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
});
