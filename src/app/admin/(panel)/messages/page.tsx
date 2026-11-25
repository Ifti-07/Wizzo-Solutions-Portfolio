import type { Metadata } from "next";
import { getContacts } from "@/lib/actions/admin";
import { MessagesAdmin } from "@/components/admin/messages-admin";

export const metadata: Metadata = { title: "Inquiries & Messages" };
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const contacts = await getContacts();
  return <MessagesAdmin contacts={contacts} />;
}
