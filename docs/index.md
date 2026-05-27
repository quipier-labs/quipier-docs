---
title: 시작하기
description: Quipier 임베드 댓글 — 5분 안에 붙이기.
order: 0
---

# Quipier 문서

Quipier는 **어떤 웹사이트에든 붙이는 임베드 댓글 위젯**입니다. 끝 사용자는 회원가입·로그인 없이 **패스포트(익명 신원)** 로 댓글을 답니다.

## 5분 빠른 시작

1. [대시보드](https://app.quipier.com)에서 프로젝트를 만들고 `project id`와 `publishable key`(`qp_...`)를 확인합니다.
2. 페이지에 스크립트 한 줄과 컨테이너를 넣습니다.

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

3. 끝입니다. 같은 `projectId`라도 `pageId`가 다르면 페이지별로 댓글 흐름이 분리됩니다.

> 바로 시험해 보고 싶다면 [플레이그라운드](/example/)에서 `projectId`·`apiKey`만 넣으면 위젯이 즉시 뜹니다.

## 핵심 개념

- **프로젝트** — 댓글이 묶이는 단위. `publishable key`로 위젯을 인증합니다.
- **page_id** — 한 프로젝트 안에서 댓글 스레드를 나누는 키(보통 `location.pathname`).
- **패스포트** — 끝 사용자의 익명 신원. 로그인 대신 패스포트로 작성합니다.
- **모드** — `development`(모든 origin 허용) / `production`(인증된 도메인만).

## 다음 단계

- [Comments 연동](/comments/) — 스크립트 태그 · npm · React · `init` 옵션
- [패스포트](/passport/) — 익명 신원이 동작하는 방식
- [Test / Live 모드](/modes/) — origin·도메인 인증 차이
