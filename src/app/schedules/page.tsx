import { SchedulesManager } from "@/features/schedules/SchedulesManager";
import { requireCurrentUser } from "@/features/auth/server";
import {
  getPetsForUser,
  getSchedulesForUser,
} from "@/features/schedules/queries";

export default async function SchedulesPage() {
  const user = await requireCurrentUser();
  const [pets, schedules] = await Promise.all([
    getPetsForUser(user.id),
    getSchedulesForUser(user.id),
  ]);

  return <SchedulesManager pets={pets} schedules={schedules} />;
}
