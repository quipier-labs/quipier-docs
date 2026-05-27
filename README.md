# quipier-docs

Quipier 문서 사이트 + **SDK 플레이그라운드**. `docs.quipier.com`에 배포됩니다.

- `/` — 문서 랜딩 (`static/index.html`, 현재 placeholder · 프레임워크는 추후 도입)
- `/example` — [`@quipier/sdk`](https://github.com/quipier-labs/quipier.js) 통합을 바로 시험하는 React 플레이그라운드

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

- Vite + React 정적 빌드. `base: "/example/"`, 산출물은 `dist/example/`.
- `npm run build`가 example을 빌드한 뒤 `static/index.html`을 `dist/index.html`(랜딩)로 복사합니다.
- Cloudflare `assets`(Worker 없음)로 `./dist`를 도메인 루트에 서빙 → `/`=랜딩, `/example`=플레이그라운드.

| 명령 | 설명 |
| :--- | :--- |
| `npm run dev` | Vite dev (`localhost:5174/example`) |
| `npm run build` | 타입체크 + 빌드(`dist/`) + 랜딩 복사 |
| `npm run preview` | 빌드 산출물 프리뷰 |
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
