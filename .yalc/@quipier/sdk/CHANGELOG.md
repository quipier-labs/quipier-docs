# Changelog

이 파일의 형식은 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)을 따릅니다.
버전은 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)을 따릅니다.

## [Unreleased]

### Planned
- npm 배포 (`@quipier/sdk`)
- `@quipier/react` 래퍼

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
