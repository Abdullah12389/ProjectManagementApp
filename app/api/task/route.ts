import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { name, description, deadline, assigned_to, project_id } = await request.json();
  const project = await prisma.project.findUnique({
    where: { id: Number(project_id) },
    include: { workspace: true },
  });

  if (!project || project.workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assignees: number[] = Array.isArray(assigned_to) ? assigned_to.map(Number) : [];
  const task = await prisma.task.create({
    data: {
      title: name,
      description,
      due_date: new Date(deadline),
      project_id: project.id,
      status: "todo",
      users: {
        create: assignees.map((userId) => ({ user_id: userId })),
      },
    },
  });

  return NextResponse.json({ task }, { status: 201 });
}
