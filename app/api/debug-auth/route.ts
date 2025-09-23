import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const ck = cookies();
  const admin = ck.get("admin")?.value ?? null;
  const host = headers().get("host");
  const envSet = !!process.env.ADMIN_PASSWORD;

  return NextResponse.json({ host, admin, envSet });
}
