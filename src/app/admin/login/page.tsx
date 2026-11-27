import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Authorized Login",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "ADMIN" ? "/admin" : "/dashboard");
  return <LoginForm portal="admin" />;
}
