"use client";

import { useEffect, useState, useTransition } from "react";
import {
  removePushSubscriptionAction,
  savePushSubscriptionAction,
  sendTestPushNotificationAction,
} from "@/features/notifications/actions";

const SETTINGS_KEY = "chaenggyeo-pet:notification-settings";
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type NotificationPreference = {
  enabled: boolean;
  minutesBefore: number;
};

const defaultPreference: NotificationPreference = {
  enabled: false,
  minutesBefore: 10,
};

function getNotificationSupport() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

function readPreference(): NotificationPreference {
  const savedValue = window.localStorage.getItem(SETTINGS_KEY);

  if (!savedValue) {
    return defaultPreference;
  }

  try {
    const parsed = JSON.parse(savedValue) as Partial<NotificationPreference>;

    return {
      enabled: Boolean(parsed.enabled),
      minutesBefore:
        typeof parsed.minutesBefore === "number"
          ? parsed.minutesBefore
          : defaultPreference.minutesBefore,
    };
  } catch {
    return defaultPreference;
  }
}

function savePreference(preference: NotificationPreference) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(preference));
  window.dispatchEvent(new Event("chaenggyeo-pet:notification-settings-changed"));
}

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);

  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function getSubscriptionPayload(subscription: PushSubscription) {
  const json = subscription.toJSON();

  return {
    auth: json.keys?.auth ?? "",
    endpoint: json.endpoint ?? "",
    expirationTime: json.expirationTime,
    p256dh: json.keys?.p256dh ?? "",
  };
}

async function getReadyServiceWorkerRegistration() {
  await navigator.serviceWorker.register("/sw.js");

  const registration = await navigator.serviceWorker.ready;
  await registration.update();

  return registration;
}

export function NotificationSettings() {
  const [isPending, startTransition] = useTransition();
  const [isSupported, setIsSupported] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [preference, setPreference] =
    useState<NotificationPreference>(defaultPreference);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    window.setTimeout(async () => {
      const supported = getNotificationSupport();

      setIsSupported(supported);
      setPreference(readPreference());

      if (!supported) {
        return;
      }

      setPermission(Notification.permission);

      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();

      setSubscribed(Boolean(subscription));
    }, 0);
  }, []);

  async function enableNotifications() {
    setMessage("알림 구독을 준비하고 있습니다.");

    if (!getNotificationSupport()) {
      setIsSupported(false);
      return;
    }

    if (!vapidPublicKey) {
      setMessage("VAPID 공개키가 없어 푸시 알림을 켤 수 없습니다.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result !== "granted") {
      setMessage("알림 권한이 허용되지 않았습니다.");
      return;
    }

    const registration = await getReadyServiceWorkerRegistration();
    const existingSubscription =
      await registration.pushManager.getSubscription();
    const subscription =
      existingSubscription ??
      (await registration.pushManager.subscribe({
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        userVisibleOnly: true,
      }));

    startTransition(async () => {
      const response = await savePushSubscriptionAction(
        getSubscriptionPayload(subscription),
      );

      if (response.error) {
        setMessage(response.error);
        return;
      }

      const nextPreference = { ...preference, enabled: true };
      setPreference(nextPreference);
      savePreference(nextPreference);
      setSubscribed(true);
      setMessage("알림 구독이 저장되었습니다.");
    });
  }

  async function disableNotifications() {
    setMessage(null);

    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    const endpoint = subscription?.endpoint;

    if (subscription) {
      await subscription.unsubscribe();
    }

    startTransition(async () => {
      if (endpoint) {
        const response = await removePushSubscriptionAction(endpoint);

        if (response.error) {
          setMessage(response.error);
          return;
        }
      }

      const nextPreference = { ...preference, enabled: false };
      setPreference(nextPreference);
      savePreference(nextPreference);
      setSubscribed(false);
      setMessage("알림 구독을 해제했습니다.");
    });
  }

  function updatePreference(nextPreference: NotificationPreference) {
    setPreference(nextPreference);
    savePreference(nextPreference);
  }

  function sendBrowserTestNotification() {
    if (Notification.permission !== "granted") {
      setMessage("먼저 알림 권한을 허용해야 합니다.");
      return;
    }

    new Notification("챙겨펫 브라우저 테스트", {
      body: "이 알림이 보이면 Chrome/Windows 알림 권한은 정상입니다.",
      tag: "chaenggyeo-pet-browser-test",
    });

    setMessage("브라우저 직접 알림을 보냈습니다.");
  }

  function sendServerPushTestNotification() {
    setMessage("서버 푸시 테스트 알림을 보내고 있습니다.");

    startTransition(async () => {
      const response = await sendTestPushNotificationAction();

      if (response.error) {
        setMessage(response.error);
        return;
      }

      setMessage("서버 푸시 테스트 알림을 보냈습니다.");
    });
  }

  if (!isSupported) {
    return (
      <p className="mt-3 text-sm leading-6 text-[#746f66]">
        현재 브라우저에서는 PWA 푸시 알림을 지원하지 않습니다. Android Chrome
        또는 iPhone Safari의 홈 화면 추가 환경에서 다시 확인해 주세요.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-[#eee7dc] bg-[#fbfaf7] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">모바일 푸시 알림</p>
          <p className="mt-1 text-sm leading-6 text-[#746f66]">
            PWA로 설치한 기기에 일정 알림을 보낼 준비를 합니다.
          </p>
        </div>
        {subscribed && permission === "granted" ? (
          <button
            className="rounded-md border border-[#ddd6c8] px-4 py-3 text-sm font-semibold text-[#a9472d] transition hover:border-[#a9472d]"
            disabled={isPending}
            onClick={disableNotifications}
            type="button"
          >
            알림 끄기
          </button>
        ) : (
          <button
            className="rounded-md bg-[#2f5d50] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#264c42] disabled:opacity-60"
            disabled={isPending}
            onClick={enableNotifications}
            type="button"
          >
            알림 켜기
          </button>
        )}
      </div>

      <label className="block text-sm font-semibold text-[#4d473f]">
        몇 분 전에 알려줄까요?
        <select
          className="mt-2 w-full rounded-md border border-[#ddd6c8] bg-white px-3 py-3"
          disabled={!subscribed || permission !== "granted"}
          onChange={(event) =>
            updatePreference({
              ...preference,
              minutesBefore: Number(event.target.value),
            })
          }
          value={preference.minutesBefore}
        >
          <option value={0}>정시에 알림</option>
          <option value={5}>5분 전</option>
          <option value={10}>10분 전</option>
          <option value={30}>30분 전</option>
          <option value={60}>1시간 전</option>
        </select>
      </label>

      <div className="grid gap-2 sm:grid-cols-2">
        <button
          className="rounded-md border border-[#2f5d50] px-4 py-3 text-sm font-semibold text-[#2f5d50] transition hover:bg-[#eaf2e5] disabled:opacity-60"
          disabled={permission !== "granted" || isPending}
          onClick={sendBrowserTestNotification}
          type="button"
        >
          브라우저 알림 확인
        </button>
        <button
          className="rounded-md border border-[#2f5d50] px-4 py-3 text-sm font-semibold text-[#2f5d50] transition hover:bg-[#eaf2e5] disabled:opacity-60"
          disabled={!subscribed || permission !== "granted" || isPending}
          onClick={sendServerPushTestNotification}
          type="button"
        >
          서버 푸시 테스트
        </button>
      </div>

      {message ? (
        <p className="rounded-md bg-[#eaf2e5] px-3 py-2 text-sm font-semibold text-[#2f5d50]">
          {message}
        </p>
      ) : null}

      {permission === "denied" ? (
        <p className="rounded-md bg-[#fff1ed] px-3 py-2 text-sm font-semibold text-[#a9472d]">
          브라우저에서 알림이 차단되어 있습니다. 주소창 왼쪽 사이트 설정에서
          알림을 허용해야 사용할 수 있어요.
        </p>
      ) : null}

      <p className="text-xs leading-5 text-[#746f66]">
        브라우저 알림 확인은 기기 알림 권한을 확인하는 테스트입니다. 서버 푸시
        테스트는 Supabase에 저장된 푸시 구독으로 실제 Web Push를 발송합니다.
      </p>
    </div>
  );
}
