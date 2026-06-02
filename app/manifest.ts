import type { MetadataRoute } from "next";

// docs uses `output: export` (static), so route handlers must opt into static.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Quipier Docs",
    short_name: "Quipier Docs",
    description: "Quipier — 임베드 댓글 위젯 문서 + SDK 플레이그라운드.",
    start_url: "/",
    display: "standalone",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
