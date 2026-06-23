import Link from "next/link";

const navItems = [
  { href: "/", label: "오늘" },
  { href: "/schedules", label: "일정" },
  { href: "/pets", label: "반려동물" },
  { href: "/settings", label: "설정" },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#25221d]">
      <header className="border-b border-[#ddd6c8] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <Link href="/" className="w-fit">
            <p className="text-sm font-semibold text-[#68735f]">Chaenggyeo Pet</p>
            <span className="mt-1 block text-2xl font-bold">챙겨펫</span>
          </Link>

          <nav aria-label="주요 메뉴" className="flex flex-wrap gap-2">
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
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        {children}
      </main>
    </div>
  );
}
