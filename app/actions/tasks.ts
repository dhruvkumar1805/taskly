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
