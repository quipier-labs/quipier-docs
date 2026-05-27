---
title: Comments 연동
description: 스크립트 태그 · npm · React로 댓글 위젯 붙이기.
order: 1
---

# Comments 연동

댓글 위젯을 붙이는 방법은 세 가지입니다. 어느 쪽이든 같은 `projectId`·`apiKey`를 씁니다.

## 1. 스크립트 태그 (번들러 불필요)

```html
<script src="https://cdn.jsdelivr.net/npm/@quipier/sdk@0.1/dist/quipier.js"></script>
<div id="quipier-comments"></div>
<script>
  Quipier.init({
    container: "#quipier-comments",
    apiKey: "qp_YOUR_PUBLISHABLE_KEY",
    projectId: "YOUR_PROJECT_ID",
    pageId: location.pathname,
  });
</script>
```

전역 `Quipier`는 `init`/`destroy`를 노출합니다. 버전을 고정하려면 `@0.1` 대신 `@0.1.0`처럼 정확히 지정하세요.

## 2. npm (vanilla)

```bash
npm i @quipier/sdk
```

```ts
import { init } from "@quipier/sdk";

init({
  container: "#quipier-comments",
  apiKey: "qp_YOUR_PUBLISHABLE_KEY",
  projectId: "YOUR_PROJECT_ID",
  pageId: "/blog/post-1", // 미지정 시 location.pathname
});
```

## 3. React

```tsx
import { QuipierProvider, QuipierComments } from "@quipier/sdk/react";

function App() {
  return (
    <QuipierProvider config={{ apiKey: "qp_YOUR_PUBLISHABLE_KEY", projectId: "YOUR_PROJECT_ID" }}>
      <article>
        <h1>My post</h1>
        <QuipierComments pageId="/posts/my-post" />
      </article>
    </QuipierProvider>
  );
}
```

`QuipierProvider`가 config를 보관하면 하위 `QuipierComments`들이 자동으로 가져옵니다. 한 페이지에 여러 개를 두고 `pageId`만 다르게 주면 각각 다른 댓글 흐름으로 분리됩니다.

## `init` 옵션

- `container` — CSS 셀렉터 문자열 또는 `HTMLElement` (필수)
- `apiKey` — `qp_...` publishable key (또는 `data-quipier-api-key`)
- `projectId` — 프로젝트 ID (또는 `data-quipier-project-id`)
- `pageId` — 댓글 스레드 키. 기본 `location.pathname`
- `apiBase` — API 베이스 URL. 기본 `https://api.quipier.com`
- `walletAppOrigin` — 패스포트 팝업 origin. 기본 `https://passport.quipier.com`
- `theme` — `"light"` | `"dark"` | `"auto"`
- `dateFormat` — `"relative"`(기본) | `"absolute"`
- `maxDepth` — 답글 깊이. `2`(기본) | `1`(평면)
- `sort` — `"top"`(기본) | `"newest"`
- `onComment` — 새 댓글 작성 시 콜백

테마는 컨테이너의 CSS 커스텀 프로퍼티로도 덮어쓸 수 있습니다 (예: `--quipier-accent`).

## 모더레이션

대시보드의 **Comments** 탭에서 신고 처리(승인/삭제), 댓글 **숨김**(되돌릴 수 있음)·**삭제**(비가역), 그리고 **작성자(패스포트)·IP 차단**을 할 수 있습니다. 숨김·삭제된 댓글은 위젯에서 보이지 않습니다.
