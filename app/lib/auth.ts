import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

const AUTH_COOKIE = "pm_user_id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = Number(rawUserId);

  if (!Number.isInteger(userId)) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }) };
  }

  return { user, response: null };
}

export function setAuthCookie(response: NextResponse, userId: number) {
  response.cookies.set(AUTH_COOKIE, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE);
}
