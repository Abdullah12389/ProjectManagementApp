import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

export async function GET() {
  const { user, response } = await requireUser();
  if (!user) return response;

  const memberships = await prisma.userWorkspace.findMany({
    where: { user_id: user.id },
    include: {
      workspace: {
        include: {
          owner: { select: { id: true, name: true } },
          _count: { select: { projects: true, users: true } },
        },
      },
    },
  });

  const workspaces = memberships.map(({ workspace }) => ({
    id: workspace.id,
    name: workspace.name,
    code: workspace.code,
    owner_id: workspace.owner_id,
    owner: {
      id: workspace.owner.id,
      name: workspace.owner.id === user.id ? "You" : workspace.owner.name,
    },
    project_count: workspace._count.projects,
    user_count: workspace._count.users,
  }));

  return NextResponse.json({ workspaces });
}

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { name, code } = await request.json();
  if (!name || !code) {
    return NextResponse.json({ error: "Workspace name and code are required" }, { status: 422 });
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      code,
      owner_id: user.id,
      users: { create: { user_id: user.id } },
    },
  });

  return NextResponse.json({ workspace }, { status: 201 });
}
