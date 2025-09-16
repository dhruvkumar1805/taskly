import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const task = await prisma.task.update({
    where: { id: Number(params.id) },
    data: {
      completed: body.completed,
      title: body.title,
    },
  });

  return NextResponse.json(task);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.task.delete({
    where: { id: Number(params.id) },
  });
  return NextResponse.json({ message: "Task deleted" });
}
