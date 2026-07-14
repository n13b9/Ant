import crypto from "crypto";
import { cookies } from "next/headers";

export async function isAdmin(): Promise<boolean> {
  const cookie = (await cookies()).get("admin_session")?.value;
  const expected = process.env.ADMIN_COOKIE_VALUE!;
  if (!cookie) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD!;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
