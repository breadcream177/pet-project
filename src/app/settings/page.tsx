import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { requireCurrentUser } from "@/features/auth/server";
import { AppPushSettings } from "@/features/settings/components/AppPushSettings";
import { WebPushDeveloperPanel } from "@/features/settings/components/WebPushDeveloperPanel";
import { maskEmail } from "@/lib/privacy";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const maskedEmail = maskEmail(user.email);

  const { data: notificationPreference } = await supabase
    .from("notification_preferences")
    .select("enabled, minutes_before")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#68735f]">Settings</p>
        <h1 className="mt-1 text-3xl font-bold">설정</h1>
        <p className="mt-3 text-sm leading-6 text-[#746f66]">
          계정, 알림, 개인정보 보호에 필요한 설정을 관리합니다.
        </p>
      </div>

      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">계정</h2>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          현재 로그인한 계정입니다. 화면에서는 이메일을 일부 가려 표시합니다.
        </p>
        <p className="mt-3 rounded-md bg-[#fbfaf7] px-3 py-2 text-sm font-semibold text-[#4d473f]">
          {maskedEmail}
        </p>
        <div className="mt-5">
          <LogoutButton />
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold">알림</h2>
          <p className="mt-2 text-sm leading-6 text-[#746f66]">
            챙겨야 할 일정이 있을 때 Android 앱으로 알려드립니다.
          </p>
        </div>
        <AppPushSettings
          initialPreference={{
            enabled: notificationPreference?.enabled ?? false,
            minutesBefore: notificationPreference?.minutes_before ?? 10,
          }}
        />
        {process.env.NODE_ENV !== "production" ? (
          <WebPushDeveloperPanel />
        ) : null}
      </section>

      <section className="rounded-lg border border-[#ddd6c8] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">개인정보 보호</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#746f66]">
          <li>로그인 세션은 Supabase Auth가 관리합니다.</li>
          <li>반려동물과 일정 데이터는 로그인한 사용자 본인에게만 보입니다.</li>
          <li>앱 알림 정보는 알림 발송 목적으로만 저장합니다.</li>
          <li>서비스 역할 키나 시크릿 키는 브라우저에 노출하지 않습니다.</li>
        </ul>
      </section>
    </section>
  );
}
