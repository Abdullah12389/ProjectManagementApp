import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { name, deadline, process_model, workspace_id } = await request.json();
  const workspace = await prisma.workspace.findUnique({ where: { id: Number(workspace_id) } });

  if (!workspace || workspace.owner_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      deadline: new Date(deadline),
      process_model,
      workspace_id: workspace.id,
    },
  });

  return NextResponse.json({ project }, { status: 201 });
}
