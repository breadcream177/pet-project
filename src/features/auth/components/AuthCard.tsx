import Link from "next/link";
import type { AuthMode } from "../types";

type AuthCardProps = {
  errorMessage?: string;
  mode: AuthMode;
  successMessage?: string;
};

const authCopy = {
  login: {
    action: "/auth/login",
    buttonLabel: "로그인",
    description: "내 반려동물과 일정을 불러옵니다.",
    helper: "아직 계정이 없나요?",
    href: "/signup",
    hrefLabel: "회원가입",
    title: "로그인",
  },
  signup: {
    action: "/auth/signup",
    buttonLabel: "회원가입",
    description: "챙겨펫에서 사용할 계정을 만듭니다.",
    helper: "이미 계정이 있나요?",
    href: "/login",
    hrefLabel: "로그인",
    title: "회원가입",
  },
};

export function AuthCard({
  errorMessage,
  mode,
  successMessage,
}: AuthCardProps) {
  const copy = authCopy[mode];
  const isSignup = mode === "signup";

  return (
    <section className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-md items-center">
      <div className="w-full rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#68735f]">Account</p>
        <h1 className="mt-1 text-3xl font-bold">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          {copy.description}
        </p>

        <form action={copy.action} className="mt-6 space-y-4" method="post">
          {isSignup ? (
            <label className="block">
              <span className="text-sm font-semibold text-[#4d473f]">이름</span>
              <input
                autoComplete="name"
                className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
                name="displayName"
                placeholder="예: 홍길동"
                required
                type="text"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">이메일</span>
            <input
              autoComplete="email"
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">비밀번호</span>
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              minLength={isSignup ? 8 : 1}
              name="password"
              placeholder="8자 이상"
              required
              type="password"
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
            className="h-11 w-full rounded-md bg-[#2f5d50] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42]"
            type="submit"
          >
            {copy.buttonLabel}
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
