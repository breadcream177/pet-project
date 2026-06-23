"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.refresh();
      router.push("/login");
    } catch {
      setErrorMessage(
        "Supabase 환경 변수가 설정되지 않았습니다. .env.local을 확인해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <button
        className="h-11 rounded-md border border-[#d8d0c4] bg-white px-4 text-sm font-semibold text-[#9f3f2f] transition hover:border-[#9f3f2f]"
        disabled={isSubmitting}
        onClick={() => {
          void handleLogout();
        }}
        type="button"
      >
        {isSubmitting ? "로그아웃 중..." : "로그아웃"}
      </button>

      {errorMessage ? (
        <p className="mt-3 rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#9f3f2f]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
