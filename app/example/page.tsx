"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /example is split into /example/simple-comments and /example/feed.
 * Redirect here (preserving the dashboard's ?projectId=&apiKey= query so the
 * "예제로 보기" link still lands on the comments widget with creds applied).
 */
export default function ExampleIndex() {
  const router = useRouter();
  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`/example/simple-comments${search}`);
  }, [router]);
  return (
    <main className="qp-pg">
      <p className="muted">플레이그라운드로 이동 중…</p>
    </main>
  );
}
