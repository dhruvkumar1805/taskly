"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priority = formData.get("priority")?.toString() as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | undefined;
  const dueDateRaw = formData.get("dueDate")?.toString();

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority ?? "MEDIUM",
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function toggleTaskStatus(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: session.user.id,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const nextStatus =
    task.status === "TODO"
      ? "IN_PROGRESS"
      : task.status === "IN_PROGRESS"
      ? "COMPLETED"
      : "TODO";

  await prisma.task.update({
    where: { id: task.id },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const title = formData.get("title")?.toString();
  if (!title) return;

  await prisma.task.update({
    where: {
      id: taskId,
      userId: session.user.id,
    },
    data: {
      title,
      description: formData.get("description")?.toString() || null,
      priority: formData.get("priority") as any,
      dueDate: formData.get("dueDate")
        ? new Date(formData.get("dueDate") as string)
        : null,
    },
  });

  revalidatePath("/dashboard");
}
