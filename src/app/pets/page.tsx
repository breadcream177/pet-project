import { PetsManager } from "@/features/pets/PetsManager";
import { requireCurrentUser } from "@/features/auth/server";

export default async function PetsPage() {
  await requireCurrentUser();

  return <PetsManager />;
}
