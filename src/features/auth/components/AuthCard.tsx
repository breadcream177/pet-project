"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthFormValues, AuthMode } from "../types";

type AuthCardProps = {
  mode: AuthMode;
};

const initialValues: AuthFormValues = {
  displayName: "",
  email: "",
  password: "",
};

const authCopy = {
  login: {
    title: "로그인",
    description: "내 반려동물과 일정을 불러옵니다.",
    buttonLabel: "로그인",
    helper: "아직 계정이 없나요?",
    href: "/signup",
    hrefLabel: "회원가입",
    successMessage: "로그인했습니다.",
  },
  signup: {
    title: "회원가입",
    description: "챙겨펫에서 사용할 계정을 만듭니다.",
    buttonLabel: "회원가입",
    helper: "이미 계정이 있나요?",
    href: "/login",
    hrefLabel: "로그인",
    successMessage: "회원가입을 완료했습니다. 이메일 확인이 필요할 수 있습니다.",
  },
};

export function AuthCard({ mode }: AuthCardProps) {
  const copy = authCopy[mode];
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [values, setValues] = useState<AuthFormValues>(initialValues);

  const isSignup = mode === "signup";
  const canSubmit =
    values.email.trim().length > 0 &&
    values.password.length >= 8 &&
    (!isSignup || values.displayName.trim().length > 0);

  const handleChange = (field: keyof AuthFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();

      const response = isSignup
        ? await supabase.auth.signUp({
            email: values.email.trim(),
            password: values.password,
            options: {
              data: {
                display_name: values.displayName.trim(),
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email: values.email.trim(),
            password: values.password,
          });

      if (response.error) {
        setErrorMessage(response.error.message);
        return;
      }

      setSuccessMessage(copy.successMessage);

      if (!isSignup || response.data.session) {
        router.refresh();
        router.push("/");
      }
    } catch {
      setErrorMessage(
        "Supabase 환경 변수가 설정되지 않았습니다. .env.local을 확인해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-md items-center">
      <div className="w-full rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#68735f]">Account</p>
        <h1 className="mt-1 text-3xl font-bold">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">{copy.description}</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          {isSignup ? (
            <label className="block">
              <span className="text-sm font-semibold text-[#4d473f]">이름</span>
              <input
                autoComplete="name"
                className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
                onChange={(event) => handleChange("displayName", event.target.value)}
                placeholder="예: 홍길동"
                type="text"
                value={values.displayName}
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">이메일</span>
            <input
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">비밀번호</span>
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="8자 이상"
              type="password"
              value={values.password}
            />
          </label>

          {errorMessage ? (
            <p className="rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#9f3f2f]">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-md bg-[#eaf2e5] px-3 py-2 text-sm font-semibold text-[#2f5d50]">
              {successMessage}
            </p>
          ) : null}

          <button
            className="h-11 w-full rounded-md bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42] disabled:cursor-not-allowed disabled:bg-[#a8b2a4]"
            disabled={!canSubmit || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "처리 중..." : copy.buttonLabel}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#746f66]">
          {copy.helper}{" "}
          <Link className="font-bold text-[#2f5d50]" href={copy.href}>
            {copy.hrefLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
