import type { Metadata } from "next";
import {
  getUsers,
  getTeamOptions,
  adminGetAnnouncements,
  adminGetCertificates,
} from "@/lib/actions/admin";
import { UsersAdmin } from "@/components/admin/users-admin";

export const metadata: Metadata = { title: "Team & Interns" };
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [employees, interns, admins, team, announcements, certificates] = await Promise.all([
    getUsers("EMPLOYEE"),
    getUsers("INTERN"),
    getUsers("ADMIN"),
    getTeamOptions(),
    adminGetAnnouncements(),
    adminGetCertificates(),
  ]);

  return (
    <UsersAdmin
      employees={employees}
      interns={interns}
      admins={admins}
      team={team}
      announcements={announcements}
      certificates={certificates}
    />
  );
}
