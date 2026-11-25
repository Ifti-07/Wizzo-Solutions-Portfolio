import type { Metadata } from "next";
import { adminGetTasks, getTeamOptions } from "@/lib/actions/admin";
import { TasksAdmin } from "@/components/admin/tasks-admin";

export const metadata: Metadata = { title: "Task Assignment" };
export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, team] = await Promise.all([adminGetTasks(), getTeamOptions()]);
  return <TasksAdmin tasks={tasks} team={team} />;
}
