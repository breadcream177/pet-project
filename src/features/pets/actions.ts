"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/features/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PetFormValues } from "./types";

export type PetActionResult = {
  error?: string;
};

export async function createPetAction(
  values: PetFormValues,
): Promise<PetActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const name = values.name.trim();
  const species =
    values.species === "기타" ? values.customSpecies.trim() : values.species;
  const memo = values.memo.trim();

  if (!name) {
    return { error: "이름을 입력해 주세요." };
  }

  if (!species) {
    return { error: "종류를 입력해 주세요." };
  }

  const { error } = await supabase.from("pets").insert({
    color: values.color,
    memo: memo || null,
    name,
    species,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/pets");
  revalidatePath("/schedules");
  revalidatePath("/");

  return {};
}
