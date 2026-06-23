import Link from "next/link";
import type { AuthMode } from "../types";

type AuthCardProps = {
  mode: AuthMode;
};

const authCopy = {
  login: {
    title: "로그인",
    description: "계정에 연결된 반려동물과 일정을 불러옵니다.",
    buttonLabel: "로그인 연결 예정",
    helper: "아직 계정이 없나요?",
    href: "/signup",
    hrefLabel: "회원가입",
  },
  signup: {
    title: "회원가입",
    description: "챙겨펫에서 사용할 계정을 만드는 화면입니다.",
    buttonLabel: "회원가입 연결 예정",
    helper: "이미 계정이 있나요?",
    href: "/login",
    hrefLabel: "로그인",
  },
};

export function AuthCard({ mode }: AuthCardProps) {
  const copy = authCopy[mode];

  return (
    <section className="mx-auto flex min-h-[calc(100vh-180px)] w-full max-w-md items-center">
      <div className="w-full rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-[#68735f]">Account</p>
        <h1 className="mt-1 text-3xl font-bold">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">{copy.description}</p>

        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">이메일</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-[#4d473f]">비밀번호</span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-[#d8d0c4] bg-[#fbfaf7] px-3 outline-none transition focus:border-[#2f5d50] focus:bg-white"
              placeholder="8자 이상"
              type="password"
            />
          </label>

          <button
            className="h-11 w-full cursor-not-allowed rounded-md bg-[#a8b2a4] px-4 text-sm font-semibold text-white"
            disabled
            type="button"
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
