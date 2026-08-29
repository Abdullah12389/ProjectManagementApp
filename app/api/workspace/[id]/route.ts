import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

type Params = { params: Promise<{ id: string }> };

async function findWorkspaceForUser(id: number, userId: number) {
  const membership = await prisma.userWorkspace.findUnique({
    where: { workspace_id_user_id: { workspace_id: id, user_id: userId } },
  });

  if (!membership) return null;

  return prisma.workspace.findUnique({
    where: { id },
    include: { projects: { include: { tasks: { select: { status: true } } } } },
  });
}

export async function GET(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const workspace = await findWorkspaceForUser(Number(id), user.id);

  if (!workspace) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projects = workspace.projects.map((project) => {
    const done = project.tasks.filter((task) => task.status === "done").length;
    return {
      id: project.id,
      name: project.name,
      deadline: project.deadline,
      process_model: project.process_model,
      workspace_id: project.workspace_id,
      progress: project.tasks.length > 0 ? (done * 100) / project.tasks.length : 0,
    };
  });

  return NextResponse.json({
    workspace: { id: workspace.id, name: workspace.name },
    projects,
    isowner: workspace.owner_id === user.id,
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const workspace = await prisma.workspace.findUnique({ where: { id: Number(id) } });

  if (!workspace || workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, code } = await request.json();
  const updated = await prisma.workspace.update({
    where: { id: workspace.id },
    data: { name, code },
  });

  return NextResponse.json({ workspace: updated });
}

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await params;
  const workspace = await prisma.workspace.findUnique({ where: { id: Number(id) } });

  if (!workspace || workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.workspace.delete({ where: { id: workspace.id } });
  return NextResponse.json({ ok: true });
}
