import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { setAuthCookie } from "@/app/lib/auth";

export async function POST(request: Request) {
  const { name, password } = await request.json();
  const user = await prisma.user.findFirst({ where: { name } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Credentials did not match" }, { status: 422 });
  }

  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  setAuthCookie(response, user.id);
  return response;
}
