// Small pure helpers shared by components and exposed to slot functions via
// CommentCtx.helpers.

const AVATAR_PALETTE = [
  "#ff4500",
  "#ff8717",
  "#ffb000",
  "#46d160",
  "#24a0ed",
  "#7193ff",
  "#a55eea",
  "#ea4c89",
  "#3aa57c",
  "#d63a3a",
];

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Deterministic avatar background color for a seed (author id / nickname). */
export function avatarColor(seed: string): string {
  return AVATAR_PALETTE[hash(seed) % AVATAR_PALETTE.length]!;
}

/** Human-friendly timestamp. `relative` = "3분 전"; `absolute` = locale date. */
export function formatTime(
  iso: string,
  format: "relative" | "absolute" = "relative",
): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  if (format === "absolute") return d.toLocaleString();
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "방금 전";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}일 전`;
  return d.toLocaleDateString();
}
