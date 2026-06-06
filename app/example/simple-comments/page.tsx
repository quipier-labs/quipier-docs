"use client";

import { QuipierComments } from "@quipier/sdk/react";
import { QUIPIER_URLS } from "@/lib/urls";
import { ExampleShell } from "../_shell";

interface Post {
  pageId: string;
  title: string;
  body: string;
}

const POSTS: Post[] = [
  {
    pageId: "/posts/morning-coffee",
    title: "아침 커피 한 잔의 여유",
    body: "오늘은 평소보다 30분 일찍 일어났다. 갓 내린 커피 한 잔과 함께 창밖을 바라보는 시간이 하루 중 가장 좋다. 여러분은 어떤 아침 루틴을 가지고 있나요?",
  },
  {
    pageId: "/posts/late-night-thoughts",
    title: "늦은 밤의 잡념",
    body: "잠이 안 올 때, 무슨 생각을 하나요? 저는 보통 내일 할 일이나, 오늘 못 끝낸 일들을 떠올리며 뒤척이게 됩니다. 가벼운 마음으로 잠드는 비법이 있으면 공유해주세요.",
  },
];

export default function SimpleCommentsExample() {
  return (
    <ExampleShell>
      {() => (
        <>
          <div className="help-block">
            <h2>아래 두 게시글에 각각 댓글을 달아보세요</h2>
            <p>
              각 게시글은 서로 다른 <code>page_id</code>를 사용해 댓글이 분리됩니다.
              하나의 패스포트로 두 게시글 모두에 댓글을 달 수 있습니다.
            </p>
            <p>
              댓글을 단 뒤{" "}
              <a href={QUIPIER_URLS.app} target="_blank" rel="noreferrer">
                대시보드
              </a>{" "}
              의 <strong>Projects → 내 프로젝트 → Simple Comments</strong> 탭에서
              페이지별로 그룹화된 댓글을 모더레이션할 수 있습니다.
            </p>
          </div>
          <div className="posts">
            {POSTS.map((post) => (
              <article className="post" key={post.pageId}>
                <h3 className="post-title">{post.title}</h3>
                <p className="post-body">{post.body}</p>
                <div className="post-page-id">
                  <span className="muted">page_id</span>
                  <code>{post.pageId}</code>
                </div>
                <QuipierComments pageId={post.pageId} className="quipier-card" />
              </article>
            ))}
          </div>
        </>
      )}
    </ExampleShell>
  );
}
