"use server";

import { createSign } from "crypto";
import { revalidatePath } from "next/cache";
import webpush from "web-push";
import { requireCurrentUser } from "@/features/auth/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type PushSubscriptionPayload = {
  auth: string;
  endpoint: string;
  expirationTime?: number | null;
  p256dh: string;
};

type DeviceTokenPayload = {
  deviceLabel?: string | null;
  platform: "android" | "ios" | "web";
  token: string;
};

export type NotificationPreferencePayload = {
  enabled: boolean;
  minutesBefore: number;
};

export type NotificationActionResult = {
  error?: string;
};

type FcmMessagePayload = {
  body: string;
  title: string;
};

type FcmAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getFirebaseAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    return { error: "앱 알림 발송 설정이 아직 완료되지 않았습니다." };
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64UrlEncode(
    JSON.stringify({
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
    }),
  );
  const unsignedJwt = `${header}.${claim}`;
  const signature = createSign("RSA-SHA256")
    .update(unsignedJwt)
    .sign(privateKey);
  const jwt = `${unsignedJwt}.${base64UrlEncode(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    body: new URLSearchParams({
      assertion: jwt,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });
  const data = (await response.json()) as FcmAccessTokenResponse;

  if (!response.ok || !data.access_token) {
    console.error("Failed to issue Firebase access token", data);

    return {
      error:
        data.error_description ??
        data.error ??
        "앱 알림 발송 인증에 실패했습니다.",
    };
  }

  return { accessToken: data.access_token };
}

async function sendFcmMessage(token: string, payload: FcmMessagePayload) {
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    return { error: "앱 알림 발송 설정이 아직 완료되지 않았습니다." };
  }

  const accessTokenResult = await getFirebaseAccessToken();

  if (accessTokenResult.error || !accessTokenResult.accessToken) {
    return { error: accessTokenResult.error };
  }

  const response = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      body: JSON.stringify({
        message: {
          android: {
            notification: {
              channel_id: "default",
            },
          },
          data: {
            url: "/",
          },
          notification: {
            body: payload.body,
            title: payload.title,
          },
          token,
        },
      }),
      headers: {
        Authorization: `Bearer ${accessTokenResult.accessToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to send FCM message", errorText);

    return { error: "앱 알림 발송에 실패했습니다." };
  }

  return {};
}

export async function saveNotificationPreferenceAction(
  payload: NotificationPreferencePayload,
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const allowedMinutes = [0, 5, 10, 30, 60];
  const minutesBefore = allowedMinutes.includes(payload.minutesBefore)
    ? payload.minutesBefore
    : 10;

  const { error } = await supabase.from("notification_preferences").upsert(
    {
      enabled: payload.enabled,
      minutes_before: minutesBefore,
      user_id: user.id,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function saveDeviceTokenAction(
  payload: DeviceTokenPayload,
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  if (!payload.token.trim()) {
    return { error: "알림을 받을 앱 정보를 확인하지 못했습니다." };
  }

  const { error } = await supabase.from("device_tokens").upsert(
    {
      device_label: payload.deviceLabel ?? null,
      last_seen_at: new Date().toISOString(),
      platform: payload.platform,
      token: payload.token,
      user_id: user.id,
    },
    { onConflict: "user_id,token" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function removeDeviceTokenAction(
  token: string,
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  if (!token) {
    return {};
  }

  const { error } = await supabase
    .from("device_tokens")
    .delete()
    .eq("token", token)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function removeDeviceTokensByPlatformAction(
  platform: DeviceTokenPayload["platform"],
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("device_tokens")
    .delete()
    .eq("platform", platform)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function sendTestAppPushNotificationAction(): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  const { data: tokens, error } = await supabase
    .from("device_tokens")
    .select("token")
    .eq("user_id", user.id)
    .eq("platform", "android")
    .order("last_seen_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  if (!tokens.length) {
    return {
      error: "알림을 받을 앱이 아직 연결되지 않았습니다. 앱에서 알림을 먼저 켜 주세요.",
    };
  }

  const failedTokens: string[] = [];

  for (const deviceToken of tokens) {
    const response = await sendFcmMessage(deviceToken.token, {
      body: "챙겨펫 알림이 정상적으로 연결되었습니다.",
      title: "챙겨펫 테스트 알림",
    });

    if (response.error) {
      failedTokens.push(deviceToken.token);
    }
  }

  if (failedTokens.length === tokens.length) {
    return {
      error: "테스트 알림을 보내지 못했습니다. Firebase 설정을 확인해 주세요.",
    };
  }

  return {};
}

export async function savePushSubscriptionAction(
  subscription: PushSubscriptionPayload,
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  if (!subscription.endpoint || !subscription.p256dh || !subscription.auth) {
    return { error: "알림 구독 정보가 올바르지 않습니다." };
  }

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      auth_key: subscription.auth,
      endpoint: subscription.endpoint,
      expiration_time: subscription.expirationTime
        ? new Date(subscription.expirationTime).toISOString()
        : null,
      p256dh_key: subscription.p256dh,
      user_id: user.id,
    },
    { onConflict: "user_id,endpoint" },
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function removePushSubscriptionAction(
  endpoint: string,
): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();

  if (!endpoint) {
    return {};
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");

  return {};
}

export async function sendTestPushNotificationAction(): Promise<NotificationActionResult> {
  const user = await requireCurrentUser();
  const supabase = await createSupabaseServerClient();
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT ?? "mailto:admin@chaenggyeo-pet.local";

  if (!publicKey || !privateKey) {
    return { error: "웹 알림 키가 설정되지 않았습니다." };
  }

  const { data: subscription, error } = await supabase
    .from("push_subscriptions")
    .select("auth_key, endpoint, p256dh_key")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  if (!subscription) {
    return { error: "저장된 웹 알림 구독이 없습니다. 먼저 웹 알림을 켜 주세요." };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.auth_key,
          p256dh: subscription.p256dh_key,
        },
      },
      JSON.stringify({
        body: "테스트 알림이 도착했습니다. 웹 알림 연결은 정상입니다.",
        tag: "chaenggyeo-pet-test",
        title: "챙겨펫 테스트 알림",
        url: "/",
      }),
    );
  } catch (sendError) {
    console.error("Failed to send test web push notification", sendError);

    const statusCode =
      typeof sendError === "object" &&
      sendError !== null &&
      "statusCode" in sendError
        ? Number(sendError.statusCode)
        : null;

    if (statusCode === 404 || statusCode === 410) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .eq("endpoint", subscription.endpoint)
        .eq("user_id", user.id);

      return {
        error: "만료된 웹 알림 구독을 삭제했습니다. 알림을 다시 켜 주세요.",
      };
    }

    return { error: "테스트 알림 발송에 실패했습니다." };
  }

  return {};
}
