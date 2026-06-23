import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "챙겨펫",
  description: "밥, 산책, 약, 병원 일정을 챙기는 반려동물 캘린더",
  applicationName: "챙겨펫",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#2f5d50",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
