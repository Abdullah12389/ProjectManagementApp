import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const comment = await prisma.comment.findUnique({ where: { id: Number(id) } });
  return NextResponse.json({ comment });
}

export async function PUT(request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const { content } = await request.json();
  const comment = await prisma.comment.updateMany({
    where: { id: Number(id), user_id: user.id },
    data: { content },
  });

  return NextResponse.json({ comment });
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  await prisma.comment.deleteMany({ where: { id: Number(id), user_id: user.id } });
  return NextResponse.json({ ok: true });
}
