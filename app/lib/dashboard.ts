import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [total, todo, inProgress, completed, overdue] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({
      where: { userId, status: "TODO" },
    }),
    prisma.task.count({
      where: { userId, status: "IN_PROGRESS" },
    }),
    prisma.task.count({
      where: { userId, status: "COMPLETED" },
    }),
    prisma.task.count({
      where: {
        userId,
        dueDate: { lt: startOfToday },
        status: { not: "COMPLETED" },
      },
    }),
  ]);

  return {
    total,
    todo,
    inProgress,
    completed,
    overdue,
  };
}
