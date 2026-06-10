# Changelog

이 파일의 형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)을 따릅니다.
버전은 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

## [Unreleased]

## [0.2.0] — 2026-06-03

### Added
- **커스터마이징 API** — 옵션 없이는 기존 기본 형태 그대로(비파괴적).
  - `appearance` — 색·폰트·모서리(radius)·간격·아바타 모양 토큰. 인라인 `--quipier-*` CSS 변수로 적용.
  - `features` — 정렬·배지·좋아요·답글·신고·메뉴·입력창·아바타 on/off.
  - `slots` — `comment`(row 전체) / `avatar` / `authorLabel` / `content` / `actions` / `header` / `composer` / `empty` 렌더 교체. `HTMLElement | string | VNode | null` 반환, `ctx.actions`·`ctx.defaultNode()`·`ctx.helpers` 제공.
  - 모든 요소에 `data-quipier-part` 부여(슬롯 없이 CSS 재배치).
  - styles.ts 토큰화: `--quipier-font/font-size/radius/radius-pill/avatar-radius/gap` 추가.
  - React 래퍼(`QuipierProvider`/`QuipierComments`)도 `appearance`/`features`/`slots` passthrough.

## [0.1.0] — 2026-05-17

### Added
- Initial extraction from the Quipier monorepo into a standalone public repository.
- Vite-based IIFE build (`dist/quipier.js`, ~20 kB raw / ~8 kB gzipped).
- Preact widget — comment list with keyset pagination, lazy wallet creation on first post, own-comment soft delete.
- API client with publishable key + Bearer JWT auth and typed `ApiError`.
- localStorage-based wallet identity persistence (private-mode tolerant).
- Scoped CSS auto-injection.
- Cloudflare Pages `_headers` (CORS `*`, content-type, moderate cache).
- `examples/static-demo/` — fake blog page demonstrating the embed.
