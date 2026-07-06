import type { CapacitorConfig } from "@capacitor/cli";

const nextServerUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: "com.chaenggyeopet.app",
  appName: "Chaenggyeo Pet",
  webDir: "www",
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  server: nextServerUrl
    ? {
        cleartext: nextServerUrl.startsWith("http://"),
        url: nextServerUrl,
      }
    : undefined,
};

export default config;
