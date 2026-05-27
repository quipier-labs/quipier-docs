# quipier-docs

Quipier 문서 사이트 + **SDK 플레이그라운드**. `docs.quipier.com`에 배포됩니다.

- `/`, `/comments`, `/passport`, `/modes` — **human 문서**. `docs/*.md`를 무의존 빌드 스크립트로 정적 HTML 렌더
- `/llms.txt`, `/llms-full.txt` — **AI용 문서**([llms.txt 표준](https://llmstxt.org/)) — 인덱스 + 전문, 빌드 시 자동 생성
- `/example` — [`@quipier/sdk`](https://github.com/quipier-labs/quipier.js) 통합을 바로 시험하는 React 플레이그라운드(Vite)

> 대시보드의 Comments → **사용법**, **예제로 보기** 링크가 이 `/example`로 연결됩니다
> (`projectId`·`apiKey`·`apiBase`·`walletAppOrigin`을 쿼리스트링으로 받아 위젯을 마운트).

## 빠른 시작

```bash
npm install
npm run dev          # http://localhost:5174/example
```

폼(또는 우측 상단 JSON 입력)에 값만 넣으면 두 게시글의 댓글 위젯이 각각 마운트됩니다.

| 필드 | 값 |
| :--- | :--- |
| Project ID | 대시보드 프로젝트 Overview |
| Publishable API key | `qp_...` — 같은 Overview의 API key |
| API base (선택) | 기본 `https://api.quipier.com` (로컬: `http://localhost:8787`) |
| Passport app origin (선택) | 기본 `https://passport.quipier.com` (로컬: `http://localhost:3100`) |

입력값은 브라우저 `localStorage`에만 저장됩니다.

## 구조 / 배포

정적 사이트(Cloudflare `assets`, Worker 없음). `npm run build`가 두 가지를 합칩니다:

1. **문서** — `docs/*.md`(frontmatter: `title`·`description`·`order`)를 `scripts/build-docs.mjs`(무의존 markdown 렌더)가 정적 HTML로 빌드 → `dist/`(`/`, `/comments` …) + `dist/llms.txt`·`dist/llms-full.txt`.
2. **플레이그라운드** — Vite + React, `base:"/example/"` → `dist/example/`.

Cloudflare가 `./dist`를 도메인 루트에 서빙 → `/`·`/comments` = 문서, `/example` = 플레이그라운드, `/llms.txt` = AI 문서.

> 문서를 추가하려면 `docs/`에 `.md` 파일을 만들고 frontmatter에 `order`만 주면 사이드바·llms에 자동 포함됩니다.

| 명령 | 설명 |
| :--- | :--- |
| `npm run dev` | 플레이그라운드 Vite dev (`localhost:5174/example`) |
| `npm run build` | 문서 HTML + llms.txt + 플레이그라운드 → `dist/` |
| `npm run preview:site` | 빌드 결과 전체 로컬 서빙 (`localhost:5175`) |
| `npm run deploy:dev` | `docs-dev.quipier.com` 배포 |
| `npm run deploy:prod` | `docs.quipier.com` 배포 |

## 통합 패턴 (Provider + Component)

```tsx
import { QuipierProvider, QuipierComments } from "@quipier/sdk/react";

function App() {
  return (
    <QuipierProvider config={{ apiKey: "qp_YOUR_KEY", projectId: "YOUR_PROJECT_ID" }}>
      <article>
        <h1>아침 커피 한 잔의 여유</h1>
        <QuipierComments pageId="/posts/morning-coffee" />
      </article>
    </QuipierProvider>
  );
}
```

`QuipierProvider`가 config를 보관하면 하위 `QuipierComments`들이 자동으로 가져오고, `pageId`만 다르게 주면 댓글 흐름이 분리됩니다. 전체 흐름은 [`src/App.tsx`](./src/App.tsx).

## 로컬 개발 (npm 배포 전, yalc)

```bash
cd ../quipier.js && npm run yalc:publish   # SDK 빌드 + push
cd ../quipier-docs && npm install          # .yalc 링크 사용
```
