export default function SettingsPage() {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Settings</p>
        <h1 className="mt-1 text-3xl font-bold">설정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          알림, 계정, 개인정보, 서비스 설정을 관리할 화면입니다.
        </p>
      </div>

      <div className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">설정 항목 준비 중</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          실제 배포 단계에서는 개인정보 노출, 권한, 알림 설정을 안전하게 분리합니다.
        </p>
      </div>
    </section>
  );
}
