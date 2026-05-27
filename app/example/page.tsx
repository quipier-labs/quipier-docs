import type { Metadata } from "next";
import { Playground } from "./Playground";

export const metadata: Metadata = {
  title: "플레이그라운드 · Quipier",
  description: "프로젝트 key로 Quipier 댓글 위젯을 즉시 시험해 보세요.",
};

export default function ExamplePage() {
  return <Playground />;
}
