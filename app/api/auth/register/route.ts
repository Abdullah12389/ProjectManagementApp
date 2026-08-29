import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { setAuthCookie } from "@/app/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, password_confirmation } = body;

  if (!name || !email || !password || password !== password_confirmation) {
    return NextResponse.json({ error: "Invalid registration data" }, { status: 422 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email: String(email).toLowerCase(),
      password: await bcrypt.hash(password, 12),
    },
  });

  const response = NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  setAuthCookie(response, user.id);
  return response;
}
