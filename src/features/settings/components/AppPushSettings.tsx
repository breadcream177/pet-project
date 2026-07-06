"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  type PermissionStatus,
  type Token,
} from "@capacitor/push-notifications";
import {
  removeDeviceTokenAction,
  removeDeviceTokensByPlatformAction,
  saveDeviceTokenAction,
  saveNotificationPreferenceAction,
  sendTestAppPushNotificationAction,
} from "@/features/notifications/actions";

type AppPushSettingsProps = {
  initialPreference: {
    enabled: boolean;
    minutesBefore: number;
  };
};

type PushStatus =
  | "checking"
  | "disabled"
  | "enabled"
  | "blocked"
  | "unsupported";

type NativeCapacitorWindow = Window &
  typeof globalThis & {
    Capacitor?: {
      getPlatform?: () => string;
      isPluginAvailable?: (name: string) => boolean;
      isNativePlatform?: () => boolean;
      Plugins?: {
        PushNotifications?: unknown;
      };
    };
  };

const minuteOptions = [
  { label: "정시에 알림", value: 0 },
  { label: "5분 전", value: 5 },
  { label: "10분 전", value: 10 },
  { label: "30분 전", value: 30 },
  { label: "1시간 전", value: 60 },
];

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  return Promise.race([
    promise.then((value) => ({ timedOut: false as const, value })),
    new Promise<{ timedOut: true }>((resolve) => {
      window.setTimeout(() => resolve({ timedOut: true }), timeoutMs);
    }),
  ]);
}

function canUseAppPush() {
  if (typeof window === "undefined") {
    return false;
  }

  const nativeCapacitor = (window as NativeCapacitorWindow).Capacitor;
  const nativePlatform = nativeCapacitor?.getPlatform?.();

  return (
    Capacitor.isNativePlatform() ||
    nativeCapacitor?.isNativePlatform?.() === true ||
    nativePlatform === "android" ||
    nativePlatform === "ios"
  );
}

function getPermissionStatus(permission: PermissionStatus): PushStatus {
  if (permission.receive === "granted") {
    return "enabled";
  }

  if (permission.receive === "denied") {
    return "blocked";
  }

  return "disabled";
}

export function AppPushSettings({ initialPreference }: AppPushSettingsProps) {
  const [isPending, startTransition] = useTransition();
  const lastSavedTokenRef = useRef<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [minutesBefore, setMinutesBefore] = useState(
    initialPreference.minutesBefore,
  );
  const [status, setStatus] = useState<PushStatus>("checking");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let registrationListener: { remove: () => Promise<void> } | null = null;
    let registrationErrorListener: { remove: () => Promise<void> } | null =
      null;
    let notificationListener: { remove: () => Promise<void> } | null = null;

    const nativeCapacitor = (window as NativeCapacitorWindow).Capacitor;

    console.log("[app-push] capacitor", {
      coreNative: Capacitor.isNativePlatform(),
      corePlatform: Capacitor.getPlatform(),
      hasWindowCapacitor: Boolean(nativeCapacitor),
      pluginAvailable: Capacitor.isPluginAvailable("PushNotifications"),
      windowPluginAvailable:
        nativeCapacitor?.isPluginAvailable?.("PushNotifications"),
      hasWindowPushPlugin: Boolean(nativeCapacitor?.Plugins?.PushNotifications),
      windowNative: nativeCapacitor?.isNativePlatform?.(),
      windowPlatform: nativeCapacitor?.getPlatform?.(),
    });

    async function preparePush() {
      if (!canUseAppPush()) {
        setStatus("unsupported");
        return;
      }

      await PushNotifications.removeAllListeners();

      registrationListener = await PushNotifications.addListener(
        "registration",
        (tokenValue: Token) => {
          if (lastSavedTokenRef.current === tokenValue.value) {
            return;
          }

          lastSavedTokenRef.current = tokenValue.value;
          setToken(tokenValue.value);

          startTransition(async () => {
            const response = await saveDeviceTokenAction({
              deviceLabel: "Android app",
              platform: "android",
              token: tokenValue.value,
            });

            if (response.error) {
              setMessage(response.error);
              return;
            }

            setStatus("enabled");
            setMessage("앱 알림이 켜졌습니다.");
          });
        },
      );

      registrationErrorListener = await PushNotifications.addListener(
        "registrationError",
        (error) => {
          console.error("Failed to register push notifications", error);
          setMessage("알림을 켜지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
        },
      );

      notificationListener = await PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          setMessage(notification.title ?? "알림을 받았습니다.");
        },
      );

      let nextStatus: PushStatus = "disabled";

      try {
        const permissionResult = await withTimeout(
          PushNotifications.checkPermissions(),
          2500,
        );

        if (permissionResult.timedOut) {
          setStatus("disabled");
          setMessage("알림 상태를 확인하지 못했습니다. 알림 켜기를 눌러 다시 시도해 주세요.");
          return;
        }

        nextStatus = getPermissionStatus(permissionResult.value);
      } catch (error) {
        console.error("Push notification plugin is not available", error);
        setStatus("unsupported");
        return;
      }

      setStatus(nextStatus);

      if (nextStatus === "enabled" && initialPreference.enabled) {
        await PushNotifications.register();
      }
    }

    preparePush().catch((error) => {
      console.error("Failed to prepare app push notifications", error);
      setStatus("unsupported");
      setMessage("앱 알림 상태를 확인하지 못했습니다. 앱을 다시 실행한 뒤 시도해 주세요.");
    });

    return () => {
      registrationListener?.remove();
      registrationErrorListener?.remove();
      notificationListener?.remove();
    };
  }, [initialPreference.enabled]);

  async function enableNotifications() {
    setMessage("알림 권한을 확인하고 있습니다.");
    console.log("[app-push] enable clicked");

    if (!canUseAppPush()) {
      setStatus("unsupported");
      setMessage("현재 실행 환경에서는 앱 알림을 켤 수 없습니다. 앱을 다시 실행한 뒤 시도해 주세요.");
      return;
    }

    let permission: PermissionStatus;

    try {
      permission = await PushNotifications.requestPermissions();
      console.log("[app-push] permission", permission);
    } catch (error) {
      console.error("Failed to request push notification permission", error);
      setStatus("unsupported");
      setMessage("앱 알림을 사용할 수 없습니다. 앱을 다시 실행한 뒤 시도해 주세요.");
      return;
    }

    if (permission.receive !== "granted") {
      setStatus("blocked");
      setMessage("알림 권한이 꺼져 있습니다. 휴대폰 설정에서 챙겨펫 알림을 허용해 주세요.");
      return;
    }

    const preferenceResponse = await saveNotificationPreferenceAction({
      enabled: true,
      minutesBefore,
    });

    if (preferenceResponse.error) {
      setMessage(preferenceResponse.error);
      return;
    }

    setMessage("앱 알림을 준비하고 있습니다.");
    console.log("[app-push] register start");
    const registerResult = await withTimeout(PushNotifications.register(), 5000);

    if (registerResult.timedOut) {
      setMessage("알림 연결이 지연되고 있습니다. 잠시 뒤 다시 시도해 주세요.");
      return;
    }

    console.log("[app-push] register requested");
  }

  function disableNotifications() {
    setMessage("앱 알림을 끄고 있습니다.");
    console.log("[app-push] disable clicked");

    startTransition(async () => {
      const preferenceResponse = await saveNotificationPreferenceAction({
        enabled: false,
        minutesBefore,
      });

      if (preferenceResponse.error) {
        setMessage(preferenceResponse.error);
        return;
      }

      const tokenResponse = token
        ? await removeDeviceTokenAction(token)
        : await removeDeviceTokensByPlatformAction("android");

      if (tokenResponse.error) {
        setMessage(tokenResponse.error);
        return;
      }

      setToken(null);
      setStatus("disabled");
      setMessage("앱 알림을 껐습니다.");
    });
  }

  function updateMinutesBefore(value: number) {
    setMinutesBefore(value);
    console.log("[app-push] minutes changed", value);

    startTransition(async () => {
      const response = await saveNotificationPreferenceAction({
        enabled: status === "enabled",
        minutesBefore: value,
      });

      if (response.error) {
        setMessage(response.error);
        return;
      }

      setMessage("알림 시간이 저장되었습니다.");
    });
  }

  function sendTestPush() {
    setMessage("테스트 알림을 보내고 있습니다.");
    console.log("[app-push] test clicked");

    startTransition(async () => {
      const response = await sendTestAppPushNotificationAction();

      if (response.error) {
        setMessage(response.error);
        return;
      }

      setMessage("테스트 알림을 보냈습니다.");
    });
  }

  if (status === "unsupported") {
    return (
      <div className="rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4">
        <p className="font-semibold">앱 알림</p>
        <p className="mt-2 text-sm leading-6 text-[#746f66]">
          알림은 Android 앱에서 켤 수 있습니다. 앱에서 보고 있는데도 이 문구가
          계속 보이면 앱을 완전히 종료한 뒤 다시 실행해 주세요.
        </p>
        {message ? (
          <p className="mt-3 rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#a9472d]">
            {message}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold">앱 알림</p>
          <p className="mt-2 text-sm leading-6 text-[#746f66]">
            밥, 산책, 약, 병원 일정을 놓치지 않도록 이 휴대폰으로 알림을
            보내드립니다.
          </p>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2f5d50]">
          {status === "checking"
            ? "확인 중"
            : status === "enabled"
              ? "켜짐"
              : status === "blocked"
                ? "권한 필요"
                : "꺼짐"}
        </span>
      </div>

      <label className="block text-sm font-semibold text-[#4d473f]">
        언제 알려드릴까요?
        <select
          className="mt-2 w-full rounded-md border border-[#ddd6c8] bg-white px-3 py-3"
          disabled={isPending}
          onChange={(event) => updateMinutesBefore(Number(event.target.value))}
          value={minutesBefore}
        >
          {minuteOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        {status === "enabled" ? (
          <button
            className="rounded-md border border-[#ddd6c8] px-4 py-3 text-sm font-semibold text-[#a9472d] transition hover:border-[#a9472d] disabled:opacity-60"
            disabled={isPending}
            onClick={disableNotifications}
            type="button"
          >
            앱 알림 끄기
          </button>
        ) : (
          <button
            className="rounded-md bg-[#2f5d50] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42] disabled:opacity-60"
            disabled={isPending || status === "checking"}
            onClick={enableNotifications}
            type="button"
          >
            앱 알림 켜기
          </button>
        )}
        <button
          className="rounded-md border border-[#2f5d50] px-4 py-3 text-sm font-semibold text-[#2f5d50] transition hover:bg-[#eaf2e5] disabled:opacity-60"
          disabled={status !== "enabled" || isPending}
          onClick={sendTestPush}
          type="button"
        >
          테스트 알림 보내기
        </button>
      </div>

      {status === "blocked" ? (
        <p className="rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#a9472d]">
          휴대폰 설정에서 챙겨펫 알림이 차단되어 있습니다. 설정에서 알림을
          허용한 뒤 다시 켜 주세요.
        </p>
      ) : null}

      {message ? (
        <p className="rounded-md bg-[#eaf2e5] px-3 py-2 text-sm font-semibold text-[#2f5d50]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
