"use client";

import { useEffect } from "react";
import type { TodayScheduleItem } from "@/features/schedules/types";

const SETTINGS_KEY = "chaenggyeo-pet:notification-settings";
const firedReminderIds = new Set<string>();

type TodayReminderSetupProps = {
  tasks: TodayScheduleItem[];
};

type NotificationPreference = {
  enabled: boolean;
  minutesBefore: number;
};

function readPreference(): NotificationPreference {
  const savedValue = window.localStorage.getItem(SETTINGS_KEY);

  if (!savedValue) {
    return { enabled: false, minutesBefore: 10 };
  }

  try {
    const parsed = JSON.parse(savedValue) as Partial<NotificationPreference>;

    return {
      enabled: Boolean(parsed.enabled),
      minutesBefore:
        typeof parsed.minutesBefore === "number" ? parsed.minutesBefore : 10,
    };
  } catch {
    return { enabled: false, minutesBefore: 10 };
  }
}

function getTodayTargetTime(time: string, minutesBefore: number) {
  const [hour, minute] = time.split(":").map(Number);
  const target = new Date();

  target.setHours(hour, minute - minutesBefore, 0, 0);

  return target.getTime();
}

export function TodayReminderSetup({ tasks }: TodayReminderSetupProps) {
  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }

    const timeoutIds: number[] = [];

    function scheduleReminders() {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.length = 0;

      const preference = readPreference();

      if (!preference.enabled || Notification.permission !== "granted") {
        return;
      }

      tasks
        .filter((task) => !task.completed)
        .forEach((task) => {
          const reminderId = `${task.id}:${task.time}:${preference.minutesBefore}`;

          if (firedReminderIds.has(reminderId)) {
            return;
          }

          const delay = getTodayTargetTime(task.time, preference.minutesBefore) - Date.now();

          if (delay < 0 || delay > 24 * 60 * 60 * 1000) {
            return;
          }

          const timeoutId = window.setTimeout(() => {
            firedReminderIds.add(reminderId);

            new Notification(`챙겨펫: ${task.title}`, {
              body: `${task.petName} 일정이 ${task.time}에 예정되어 있어요.`,
              tag: reminderId,
            });
          }, delay);

          timeoutIds.push(timeoutId);
        });
    }

    scheduleReminders();
    window.addEventListener(
      "chaenggyeo-pet:notification-settings-changed",
      scheduleReminders,
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      window.removeEventListener(
        "chaenggyeo-pet:notification-settings-changed",
        scheduleReminders,
      );
    };
  }, [tasks]);

  return null;
}
