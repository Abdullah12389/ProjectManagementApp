import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: {
      workspace: {
        include: { users: { where: { user_id: user.id } } },
      },
      tasks: {
        where: { users: { some: { user_id: user.id } } },
        include: { users: { include: { user: { select: { id: true, name: true } } } } },
      },
    },
  });

  if (!project || project.workspace.users.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.userWorkspace.findMany({
    where: { workspace_id: project.workspace_id },
    include: { user: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    project: { id: project.id, name: project.name },
    tasks: project.tasks.map((task) => ({
      ...task,
      user: task.users.map((assignment) => assignment.user),
    })),
    users: users.map((membership) => membership.user),
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const data = await request.json();
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { workspace: true } });

  if (!project || project.workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.project.update({
    where: { id: project.id },
    data,
  });

  return NextResponse.json({ project: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id: Number(id) }, include: { workspace: true } });

  if (!project || project.workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: project.id } });
  return NextResponse.json({ ok: true });
}
