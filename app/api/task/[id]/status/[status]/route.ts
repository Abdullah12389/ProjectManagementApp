import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string; status: string }> };

export async function PATCH(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id, status } = await params;
  const task = await prisma.task.findUnique({
    where: { id: Number(id) },
    include: { users: { where: { user_id: user.id } } },
  });

  if (!task || task.users.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.task.update({ where: { id: task.id }, data: { status } });
  return NextResponse.json({ task: updated });
}
