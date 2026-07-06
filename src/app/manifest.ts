import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "챙겨펫",
    short_name: "챙겨펫",
    description: "반려동물의 오늘 일정과 반복 루틴을 확인하고 체크하는 앱",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#2f5d50",
  };
}
