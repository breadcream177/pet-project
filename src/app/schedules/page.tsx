import { SchedulesManager } from "@/features/schedules/SchedulesManager";
import { requireCurrentUser } from "@/features/auth/server";

export default async function SchedulesPage() {
  await requireCurrentUser();

  return <SchedulesManager />;
}
