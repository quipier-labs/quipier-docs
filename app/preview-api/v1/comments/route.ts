// Self-contained mock of GET /v1/comments for the customization doc previews.
// Lets <CustomizePreview> render the real widget with deterministic content,
// with no dependency on a live project/backend. Read-only canned data.
import { NextResponse } from "next/server";

// The docs site is statically exported (output: export). Constant canned data,
// so the GET response can be pre-rendered to a static JSON file.
export const dynamic = "force-static";

const NOW = Date.UTC(2026, 5, 3, 9, 0, 0);
const minsAgo = (m: number) => new Date(NOW - m * 60_000).toISOString();

const COMMENTS = [
  {
    id: "c1",
    project_id: "demo",
    author_id: "ALICE000000000000000000000000000",
    nickname: "민지",
    page_id: "/preview",
    content: "디자인 깔끔하네요! 우리 서비스에도 바로 붙일 수 있겠어요 👏",
    parent_id: null,
    is_deleted: false,
    is_hidden: false,
    created_at: minsAgo(12),
    likes_count: 8,
    liked_by_me: false,
  },
  {
    id: "c2",
    project_id: "demo",
    author_id: "BOB00000000000000000000000000000",
    nickname: "도현",
    page_id: "/preview",
    content: "답글이랑 좋아요까지 되는 게 좋네요. 토큰만 바꿔서 테마 맞췄습니다.",
    parent_id: "c1",
    is_deleted: false,
    is_hidden: false,
    created_at: minsAgo(7),
    likes_count: 2,
    liked_by_me: true,
  },
  {
    id: "c3",
    project_id: "demo",
    author_id: "CAROL000000000000000000000000000",
    nickname: "서연",
    page_id: "/preview",
    content: "커스텀 슬롯으로 우리 카드 디자인 그대로 넣었어요.",
    parent_id: null,
    is_deleted: false,
    is_hidden: false,
    created_at: minsAgo(2),
    likes_count: 0,
    liked_by_me: false,
  },
];

export function GET() {
  return NextResponse.json({ data: { comments: COMMENTS, next_cursor: null } });
}
