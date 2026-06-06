"use client";

import { QuipierFeed } from "@quipier/sdk/react";
import { QUIPIER_URLS } from "@/lib/urls";
import { ExampleShell } from "../_shell";

export default function FeedExample() {
  return (
    <ExampleShell>
      {() => (
        <>
          <div className="help-block">
            <h2>프로젝트 전역 피드 (트위터형)</h2>
            <p>
              <code>Simple Comments</code>가 페이지별 댓글이라면, <strong>Feed</strong>는 페이지에
              묶이지 않은 <strong>프로젝트 전역 타임라인</strong>입니다. 유저가 직접 포스트를
              올리고 답글·좋아요를 남깁니다(<code>pageId</code> 없음).
            </p>
            <p>
              포스트를 단 뒤{" "}
              <a href={QUIPIER_URLS.app} target="_blank" rel="noreferrer">
                대시보드
              </a>{" "}
              의 <strong>Projects → 내 프로젝트 → Feed</strong> 탭에서 모더레이션할 수 있습니다.
            </p>
          </div>
          <article className="post">
            <QuipierFeed className="quipier-card" />
          </article>
        </>
      )}
    </ExampleShell>
  );
}
