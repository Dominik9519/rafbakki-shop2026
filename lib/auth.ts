import { cookies } from "next/headers";

const COOKIE = "rafbakki_admin";

export function isAuthed() {
  const c = cookies().get(COOKIE)?.value;
  return c === "1";
}

export function setAuthedCookie() {
  cookies().set(COOKIE, "1", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60*60*12 });
}

export function clearAuthCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 0 });
}
