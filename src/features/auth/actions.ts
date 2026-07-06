"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}
