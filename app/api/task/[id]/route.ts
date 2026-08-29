import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
    include: {
      users: { where: { user_id: user.id } },
      comments: { include: { user: { select: { id: true, name: true } } } },
    },
  });

  if (!task || task.users.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    comments: task.comments.map((comment) => ({
      ...comment,
      user: { id: comment.user.id, name: comment.user.id === user.id ? "You" : comment.user.name },
    })),
    task_id: task.id,
    description: task.description,
    name: task.title,
    user_id: user.id,
  });
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
    include: { project: { include: { workspace: true } } },
  });

  if (!task || task.project.workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id: task.id } });
  return NextResponse.json({ ok: true });
}
