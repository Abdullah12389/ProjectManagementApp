import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { content, task_id } = await request.json();
  const task = await prisma.task.findUnique({
    where: { id: Number(task_id) },
    include: { users: { where: { user_id: user.id } } },
  });

  if (!task || task.users.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const comment = await prisma.comment.create({
    data: { content, task_id: task.id, user_id: user.id },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ comment }, { status: 201 });
}
