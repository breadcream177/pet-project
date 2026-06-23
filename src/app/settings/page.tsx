import { LogoutButton } from "@/features/auth/components/LogoutButton";

export default function SettingsPage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Settings</p>
        <h1 className="mt-1 text-3xl font-bold">설정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          계정, 알림, 개인정보, 서비스 설정을 관리할 화면입니다.
        </p>
      </div>

      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">계정</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          Supabase 인증 연결 후 현재 로그인한 계정 정보를 표시합니다.
        </p>
        <div className="mt-5">
          <LogoutButton />
        </div>
      </section>

      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">알림 설정 준비 중</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          PWA 알림과 반복 일정 알림은 배포 전 별도 단계에서 연결합니다.
        </p>
      </section>
    </section>
  );
}
