"use client";

import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { NotificationSettings } from "@/features/settings/components/NotificationSettings";

type NativeCapacitorWindow = Window &
  typeof globalThis & {
    Capacitor?: {
      getPlatform?: () => string;
      isNativePlatform?: () => boolean;
    };
  };

function isNativeApp() {
  if (typeof window === "undefined") {
    return false;
  }

  const nativeCapacitor = (window as NativeCapacitorWindow).Capacitor;
  const platform = nativeCapacitor?.getPlatform?.();

  return (
    Capacitor.isNativePlatform() ||
    nativeCapacitor?.isNativePlatform?.() === true ||
    platform === "android" ||
    platform === "ios"
  );
}

export function WebPushDeveloperPanel() {
  const showPanel = useSyncExternalStore(
    () => () => {},
    () => !isNativeApp(),
    () => false,
  );

  if (!showPanel) {
    return null;
  }

  return (
    <details className="rounded-md border border-[#eee7dc] bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-[#4d473f]">
        개발용 웹 알림 테스트
      </summary>
      <NotificationSettings />
    </details>
  );
}
