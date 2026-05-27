# quipier-docs

Quipier 문서 사이트(**Fumadocs**, 정적) + **SDK 플레이그라운드**. `docs.quipier.com`에 배포됩니다.

- `/` — 랜딩
- `/docs`, `/docs/*` — 문서 (Fumadocs · MDX · 검색)
- `/example` — [`@quipier/sdk`](https://github.com/quipier-labs/quipier.js) 통합을 바로 시험하는 React 플레이그라운드
- `/llms.txt`, `/llms-full.txt` — **AI용 문서**([llms.txt 표준](https://llmstxt.org/)), 빌드 시 자동 생성

> 대시보드 Comments의 **사용법 / 예제로 보기** 링크가 `/example`로 연결됩니다
> (`projectId`·`apiKey`·`apiBase`·`walletAppOrigin`을 쿼리스트링으로 받아 위젯 마운트).

## 개발

```bash
npm install
npm run dev        # http://localhost:5174  (docs), /example (playground)
```

## 빌드 / 배포

```bash
npm run build         # 정적 export → out/
npm run preview:site  # serve out -l 5175 (빌드 결과 로컬 확인)
npm run deploy:dev    # docs-dev.quipier.com  (Cloudflare assets)
npm run deploy:prod   # docs.quipier.com
```

정적(`output: 'export'`)이라 Worker 없이 Cloudflare `assets`로 서빙합니다.

## 콘텐츠

- 문서: `content/docs/*.mdx` (frontmatter `title`·`description`) + `content/docs/meta.json`(사이드바 순서). `.md` 추가 후 `meta.json`에 이름만 넣으면 사이드바·검색·llms에 자동 포함됩니다.
- 플레이그라운드: `app/example/`(React, `@quipier/sdk` 사용).
- AI 문서: `app/llms.txt/route.ts`·`app/llms-full.txt/route.ts`가 문서에서 자동 생성.

## 스택

Next 16 (`output: export`) · Fumadocs(`fumadocs-ui`/`core`/`mdx`) · Tailwind v4 · Orama(정적 검색) · `@quipier/sdk`(npm).
