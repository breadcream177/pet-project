import { PetsManager } from "@/features/pets/PetsManager";
import { requireCurrentUser } from "@/features/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PetsPage() {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <PetsManager pets={pets ?? []} />;
}
