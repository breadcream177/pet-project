import Link from "next/link";

const navItems = [
  { href: "/", label: "오늘", shortLabel: "오늘" },
  { href: "/schedules", label: "일정", shortLabel: "일정" },
  { href: "/pets", label: "반려동물", shortLabel: "동물" },
  { href: "/settings", label: "설정", shortLabel: "설정" },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] pb-20 text-[#25221d] lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-[#ddd6c8] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="w-fit">
            <p className="text-sm font-semibold text-[#68735f]">Chaenggyeo Pet</p>
            <span className="mt-1 block text-2xl font-bold">챙겨펫</span>
          </Link>

          <nav aria-label="주요 메뉴" className="hidden flex-wrap gap-2 md:flex">
            {navItems.map((item) => (
              <Link
                className="rounded-md border border-[#ddd6c8] bg-[#fbfaf7] px-3 py-2 text-sm font-semibold transition hover:border-[#2f5d50] hover:text-[#2f5d50]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden gap-2 md:flex">
            <Link
              className="rounded-md border border-[#ddd6c8] px-3 py-2 text-sm font-semibold transition hover:border-[#2f5d50] hover:text-[#2f5d50]"
              href="/login"
            >
              로그인
            </Link>
            <Link
              className="rounded-md bg-[#2f5d50] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42]"
              href="/signup"
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        {children}
      </main>

      <nav
        aria-label="모바일 주요 메뉴"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ddd6c8] bg-white md:hidden"
      >
        <div className="grid grid-cols-4">
          {navItems.map((item) => (
            <Link
              className="flex min-h-16 items-center justify-center text-sm font-bold text-[#4d473f] transition hover:text-[#2f5d50]"
              href={item.href}
              key={item.href}
            >
              {item.shortLabel}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
