# Quipier SDK (`@quipier/sdk`)

> 어떤 웹사이트에든 붙이는 임베드 댓글 위젯. 끝 사용자는 패스포트(월렛) 기반 익명 신원으로
> 로그인 없이 댓글을 답니다.

- 📖 **문서 · 라이브 예제**: [docs.quipier.com](https://docs.quipier.com) ([플레이그라운드](https://docs.quipier.com/example))
- **번들 크기**: ~43 kB raw / ~14.5 kB gzipped (Preact 포함)
- **의존성**: `preact` 하나 — self-contained (필요한 타입은 내부 inline)
- **운영 의존**: Quipier API (`https://api.quipier.com`)

---

## Install — script tag / CDN (번들러 불필요)

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

전역 `Quipier`는 `init`/`destroy`를 노출합니다. 버전을 고정하려면 `@0.1` 대신 `@0.1.0`처럼 정확한 버전을 쓰세요.

## Install — npm (vanilla JS)

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

## Install — React

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

`QuipierComments`는 `init`/`destroy`를 React 라이프사이클에 맞춰 호출합니다. 한 페이지에 여러 개를 두면 각각 다른 `pageId`로 댓글 흐름이 분리됩니다. Provider config는 컴포넌트 prop으로 인스턴스 단위 override 가능 (`apiKey`, `apiBase`, `walletAppOrigin`).

## Options (`init`)

```ts
init({
  container: "#quipier-comments",        // string 셀렉터 또는 HTMLElement
  apiKey: "qp_...",                      // data-quipier-api-key 로 대체 가능
  projectId: "...",                      // data-quipier-project-id
  pageId: "/blog/post-1",                // 기본: location.pathname
  apiBase: "https://api.quipier.com",    // 환경별 베이스 URL
  walletAppOrigin: "https://passport.quipier.com",
  theme: "auto",                         // "light" | "dark" | "auto"(기본, OS 따라감)
  dateFormat: "relative",                // "relative"(기본) | "absolute"
  maxDepth: 2,                           // 답글 깊이 2(기본) | 1(평면)
  sort: "top",                           // "top"(기본) | "newest"
  onComment: (comment) => {},            // 새 댓글 작성 콜백
});
```

테마는 컨테이너의 CSS 커스텀 프로퍼티로도 덮어쓸 수 있습니다 (예: `--quipier-accent`).

## API key

[quipier.com](https://quipier.com) 대시보드에서 프로젝트를 만들면 `publishable key`(`qp_*`)와 `project id`가 발급됩니다. publishable key는 HTML에 노출 가능하도록 설계됐고, 프로젝트의 인증 도메인(Origin) 검증으로 무단 사용을 제한합니다.

## License

MIT

---

> 이 패키지는 [`quipier.js`](https://github.com/quipier-labs/quipier.js) 모노레포에서 빌드됩니다. 문서·예제는 [`quipier-docs`](https://github.com/quipier-labs/quipier-docs) ([docs.quipier.com](https://docs.quipier.com)). 로컬 개발·릴리스·내부 패키지(`@quipier/shared`)는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)를 참고하세요.
