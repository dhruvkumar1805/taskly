"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { getNextOccurrence } from "@/app/lib/recurrence";
import type { Priority, Recurrence } from "@/generated/prisma/client";

const RECURRENCE_VALUES = ["DAILY", "WEEKDAYS", "WEEKLY", "MONTHLY", "YEARLY"] as const;

function parseRecurrence(value: FormDataEntryValue | null): Recurrence | null {
  const str = value?.toString();
  return str && (RECURRENCE_VALUES as readonly string[]).includes(str)
    ? (str as Recurrence)
    : null;
}

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function createTask(formData: FormData) {
  const userId = await requireUserId();

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const priority = formData.get("priority")?.toString() as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | undefined;
  const dueDateRaw = formData.get("dueDate")?.toString();
  const recurrence = parseRecurrence(formData.get("recurrence"));

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority ?? "MEDIUM",
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      // A recurrence only means something with a due date to recur from.
      recurrence: dueDateRaw ? recurrence : null,
      userId,
    },
  });

  revalidatePath("/dashboard", "layout");
}

async function createNextOccurrence(
  tx: Pick<typeof prisma, "task">,
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: Priority;
    dueDate: Date | null;
    recurrence: Recurrence | null;
    recurrenceCreatedAt: Date | null;
    userId: string;
  },
) {
  // Guarded so toggling complete -> incomplete -> complete again on the
  // same task can't spawn a second successor for the same due date.
  if (!task.recurrence || !task.dueDate || task.recurrenceCreatedAt) return;

  await tx.task.create({
    data: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: getNextOccurrence(task.dueDate, task.recurrence),
      recurrence: task.recurrence,
      userId: task.userId,
    },
  });

  await tx.task.update({
    where: { id: task.id },
    data: { recurrenceCreatedAt: new Date() },
  });
}

export async function toggleTaskStatus(taskId: string) {
  const userId = await requireUserId();

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
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

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        status: nextStatus,
        completedAt: nextStatus === "COMPLETED" ? new Date() : null,
      },
    });
    if (nextStatus === "COMPLETED") await createNextOccurrence(tx, task);
  });

  revalidatePath("/dashboard", "layout");
}

export async function toggleTaskCompleted(taskId: string) {
  const userId = await requireUserId();

  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const nextStatus = task.status === "COMPLETED" ? "IN_PROGRESS" : "COMPLETED";

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: taskId },
      data: {
        status: nextStatus,
        completedAt: nextStatus === "COMPLETED" ? new Date() : null,
      },
    });
    if (nextStatus === "COMPLETED") await createNextOccurrence(tx, task);
  });

  revalidatePath("/dashboard", "layout");
}

export async function deleteTask(taskId: string) {
  const userId = await requireUserId();

  await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });

  revalidatePath("/dashboard", "layout");
}

export async function updateTask(taskId: string, formData: FormData) {
  const userId = await requireUserId();

  const title = formData.get("title")?.toString();
  const priority = formData.get("priority")?.toString() as
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | undefined;
  const dueDateRaw = formData.get("dueDate")?.toString();
  const recurrence = parseRecurrence(formData.get("recurrence"));

  if (!title) {
    throw new Error("Title is required");
  }

  await prisma.task.update({
    where: {
      id: taskId,
      userId,
    },
    data: {
      title,
      description: formData.get("description")?.toString() || null,
      priority,
      dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
      recurrence: dueDateRaw ? recurrence : null,
    },
  });

  revalidatePath("/dashboard", "layout");
}
