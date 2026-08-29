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
        select: {
          id: true,
          name: true,
          projects: { select: { id: true, name: true } },
        },
      },
    },
  });

  return NextResponse.json({ workspace: memberships.map((membership) => membership.workspace) });
}
