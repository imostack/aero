import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "aj_admin";

function sessionValue(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("aerojim-admin-session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function passwordMatches(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const h = (s: string) => createHmac("sha256", "cmp").update(s).digest("hex");
  return safeEqual(h(input), h(password));
}

export async function setAdminSession() {
  const value = sessionValue();
  if (!value) return;
  const store = await cookies();
  store.set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  // Read cookies first, unconditionally, so every admin route is always dynamic.
  const store = await cookies();
  const expected = sessionValue();
  if (!expected) return false;
  const actual = store.get(COOKIE)?.value;
  return !!actual && safeEqual(actual, expected);
}

/** Call at the top of every admin page and every admin server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
