"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/features/auth/actions";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    setErrorMessage("");

    startTransition(async () => {
      try {
        await logoutAction();
        router.replace("/login");
        router.refresh();
      } catch {
        setErrorMessage("로그아웃하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      }
    });
  };

  return (
    <div>
      <button
        className={`rounded-md border border-[#d8d0c4] bg-white px-4 text-sm font-semibold text-[#9f3f2f] transition hover:border-[#9f3f2f] disabled:cursor-not-allowed disabled:opacity-60 ${
          compact ? "h-10" : "h-11"
        }`}
        disabled={isPending}
        onClick={handleLogout}
        type="button"
      >
        {isPending ? "로그아웃 중..." : "로그아웃"}
      </button>

      {errorMessage ? (
        <p className="mt-3 rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#9f3f2f]">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
