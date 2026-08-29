import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { requireUser } from "@/app/lib/auth";

export async function POST(request: Request) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { code } = await request.json();
  const workspace = await prisma.workspace.findUnique({ where: { code } });

  if (!workspace) {
    return NextResponse.json({ error: "Invalid workspace code" }, { status: 422 });
  }

  const exists = await prisma.userWorkspace.findUnique({
    where: { workspace_id_user_id: { workspace_id: workspace.id, user_id: user.id } },
  });

  if (exists) {
    return NextResponse.json({ error: "You are already a member" }, { status: 422 });
  }

  await prisma.userWorkspace.create({ data: { workspace_id: workspace.id, user_id: user.id } });
  return NextResponse.json({ workspace });
}
