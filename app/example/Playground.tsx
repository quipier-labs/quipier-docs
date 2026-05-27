"use client";

import { useEffect, useState } from "react";
import { QuipierComments, QuipierProvider } from "@quipier/sdk/react";

const STORAGE_KEY = "quipier-example:config";
const DEFAULT_API_BASE = "https://api.quipier.com";
const DEFAULT_WALLET_APP_ORIGIN = "https://passport.quipier.com";

interface Config {
  projectId: string;
  apiKey: string;
  apiBase: string;
  walletAppOrigin: string;
}

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

function loadConfig(): Config | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Config>;
    if (!parsed.projectId || !parsed.apiKey) return null;
    return {
      projectId: parsed.projectId,
      apiKey: parsed.apiKey,
      apiBase: parsed.apiBase || DEFAULT_API_BASE,
      walletAppOrigin: parsed.walletAppOrigin || DEFAULT_WALLET_APP_ORIGIN,
    };
  } catch {
    return null;
  }
}

/** Config passed from the dashboard "예제로 보기" link (?projectId=&apiKey=&apiBase=). */
function configFromUrl(): Config | null {
  try {
    const p = new URLSearchParams(window.location.search);
    const projectId = p.get("projectId");
    const apiKey = p.get("apiKey");
    if (!projectId || !apiKey) return null;
    return {
      projectId,
      apiKey,
      apiBase: p.get("apiBase") || DEFAULT_API_BASE,
      walletAppOrigin: p.get("walletAppOrigin") || DEFAULT_WALLET_APP_ORIGIN,
    };
  } catch {
    return null;
  }
}

function initialConfig(): Config | null {
  const fromUrl = configFromUrl();
  if (fromUrl) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
    } catch {
      // ignore
    }
    // Strip credentials from the address bar after applying.
    window.history.replaceState({}, "", window.location.pathname);
    return fromUrl;
  }
  return loadConfig();
}

export function Playground() {
  // Start null so SSR and the first client render agree (both → ConfigForm).
  const [config, setConfig] = useState<Config | null>(null);
  const [editing, setEditing] = useState(false);

  // localStorage / URL params are browser-only — read them after mount, not in
  // render, otherwise the server (null) and client (saved config) HTML diverge
  // and React throws a hydration mismatch.
  useEffect(() => {
    const c = initialConfig();
    if (c) setConfig(c);
  }, []);

  return (
    <main className="qp-pg">
      <header>
        <h1>Quipier 플레이그라운드</h1>
        <p className="muted">
          <a href="https://app.quipier.com" target="_blank" rel="noreferrer">
            대시보드
          </a>
          에서 프로젝트를 만들고 <code>project id</code>와 <code>publishable key</code>를 가져오세요.
        </p>
      </header>

      {config && !editing ? (
        <QuipierProvider config={config}>
          <ConfigSummary config={config} onEdit={() => setEditing(true)} />
          <HelpBlock />
          <div className="posts">
            {POSTS.map((post) => (
              <PostCard key={post.pageId} post={post} />
            ))}
          </div>
        </QuipierProvider>
      ) : (
        <ConfigForm
          initial={config}
          onSubmit={(next) => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setConfig(next);
            setEditing(false);
          }}
          onCancel={config ? () => setEditing(false) : undefined}
        />
      )}
    </main>
  );
}

function ConfigSummary({ config, onEdit }: { config: Config; onEdit: () => void }) {
  return (
    <div className="config-summary">
      <div>
        <strong>{config.projectId}</strong>
        <span className="muted"> · {config.apiBase}</span>
      </div>
      <button className="link" type="button" onClick={onEdit}>
        설정 변경
      </button>
    </div>
  );
}

function HelpBlock() {
  return (
    <div className="help-block">
      <h2>아래 두 게시글에 각각 댓글을 달아보세요</h2>
      <p>
        각 게시글은 서로 다른 <code>page_id</code>를 사용해 댓글이 분리됩니다.
        하나의 패스포트로 두 게시글 모두에 댓글을 달 수 있습니다.
      </p>
      <p>
        댓글을 단 뒤{" "}
        <a href="https://app.quipier.com" target="_blank" rel="noreferrer">
          대시보드
        </a>{" "}
        의 <strong>Projects → 내 프로젝트 → Comments</strong> 탭에서
        페이지별로 그룹화된 댓글 목록을 확인하고 모더레이션할 수 있습니다.
        작성자(유저)는{" "}
        <a href="https://app.quipier.com/user/me" target="_blank" rel="noreferrer">
          /user/me
        </a>{" "}
        에서 자기가 단 댓글을 다시 볼 수 있습니다.
      </p>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="post">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
      <div className="post-page-id">
        <span className="muted">page_id</span>
        <code>{post.pageId}</code>
      </div>
      <QuipierComments pageId={post.pageId} className="quipier-card" />
    </article>
  );
}

/** Parse a pasted JSON blob into a Config. Accepts camelCase and snake_case keys. */
function parseConfigJson(text: string): { config?: Config; error?: string } {
  if (!text.trim()) return { error: "JSON을 입력하세요" };
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { error: "JSON 형식이 올바르지 않습니다" };
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { error: "JSON 객체를 입력하세요" };
  }
  const o = raw as Record<string, unknown>;
  const pick = (...keys: string[]): string => {
    for (const k of keys) {
      const v = o[k];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  };
  const projectId = pick("projectId", "project_id", "projectID");
  const apiKey = pick("apiKey", "api_key", "publishableKey", "publishable_key", "key");
  const apiBase = pick("apiBase", "api_base");
  const walletAppOrigin = pick(
    "walletAppOrigin",
    "wallet_app_origin",
    "passportAppOrigin",
    "passport_app_origin",
  );
  if (!projectId || !apiKey) {
    return { error: "projectId와 apiKey(publishable key)가 필요합니다" };
  }
  return {
    config: {
      projectId,
      apiKey,
      apiBase: apiBase || DEFAULT_API_BASE,
      walletAppOrigin: walletAppOrigin || DEFAULT_WALLET_APP_ORIGIN,
    },
  };
}

function ConfigForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Config | null;
  onSubmit: (config: Config) => void;
  onCancel?: () => void;
}) {
  const [mode, setMode] = useState<"form" | "json">("form");
  const [projectId, setProjectId] = useState(initial?.projectId ?? "");
  const [apiKey, setApiKey] = useState(initial?.apiKey ?? "");
  const [apiBase, setApiBase] = useState(initial?.apiBase ?? DEFAULT_API_BASE);
  const [walletAppOrigin, setWalletAppOrigin] = useState(
    initial?.walletAppOrigin ?? DEFAULT_WALLET_APP_ORIGIN,
  );
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function fieldsAsJson(): string {
    return JSON.stringify(
      {
        projectId: projectId.trim(),
        apiKey: apiKey.trim(),
        apiBase: apiBase.trim() || DEFAULT_API_BASE,
        walletAppOrigin: walletAppOrigin.trim() || DEFAULT_WALLET_APP_ORIGIN,
      },
      null,
      2,
    );
  }

  function switchMode(next: "form" | "json") {
    if (next === mode) return;
    setError(null);
    if (next === "json") {
      // Seed the editor with the current field values as a template.
      setJsonText(fieldsAsJson());
    } else {
      // Best-effort: fold whatever is in the editor back into the fields.
      const { config } = parseConfigJson(jsonText);
      if (config) {
        setProjectId(config.projectId);
        setApiKey(config.apiKey);
        setApiBase(config.apiBase);
        setWalletAppOrigin(config.walletAppOrigin);
      }
    }
    setMode(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "json") {
      const { config, error: err } = parseConfigJson(jsonText);
      if (!config) {
        setError(err ?? "JSON을 확인하세요");
        return;
      }
      onSubmit(config);
      return;
    }
    if (!projectId.trim() || !apiKey.trim()) {
      setError("project id와 publishable key를 모두 입력하세요");
      return;
    }
    onSubmit({
      projectId: projectId.trim(),
      apiKey: apiKey.trim(),
      apiBase: apiBase.trim() || DEFAULT_API_BASE,
      walletAppOrigin: walletAppOrigin.trim() || DEFAULT_WALLET_APP_ORIGIN,
    });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-head">
        <h2>설정</h2>
        <div className="seg" role="tablist" aria-label="입력 방식">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "form"}
            className={"seg-btn" + (mode === "form" ? " is-active" : "")}
            onClick={() => switchMode("form")}
          >
            폼
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "json"}
            className={"seg-btn" + (mode === "json" ? " is-active" : "")}
            onClick={() => switchMode("json")}
          >
            JSON
          </button>
        </div>
      </div>

      {mode === "form" ? (
        <>
          <label>
            <span>Project ID</span>
            <input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="prj_..."
              autoFocus
            />
          </label>
          <label>
            <span>Publishable API key</span>
            <input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="qp_..."
            />
          </label>
          <label>
            <span>API base (선택)</span>
            <input
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              placeholder={DEFAULT_API_BASE}
            />
          </label>
          <label>
            <span>Passport app origin (선택)</span>
            <input
              value={walletAppOrigin}
              onChange={(e) => setWalletAppOrigin(e.target.value)}
              placeholder={DEFAULT_WALLET_APP_ORIGIN}
            />
          </label>
        </>
      ) : (
        <label>
          <span>설정 JSON</span>
          <textarea
            className="json-input"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            autoFocus
            placeholder={'{\n  "projectId": "prj_...",\n  "apiKey": "qp_..."\n}'}
          />
        </label>
      )}

      {error && <div className="error">{error}</div>}
      <div className="form-actions">
        <button type="submit">{initial ? "저장" : "시작"}</button>
        {onCancel ? (
          <button type="button" className="link" onClick={onCancel}>
            취소
          </button>
        ) : null}
      </div>
      {mode === "json" ? (
        <p className="hint">
          <code>projectId</code> · <code>apiKey</code> · <code>apiBase</code> ·{" "}
          <code>walletAppOrigin</code> 키를 사용합니다. snake_case(<code>api_key</code> 등)도
          인식해요. 입력값은 브라우저 localStorage에만 저장되며 서버로 전송되지 않습니다.
        </p>
      ) : (
        <p className="hint">
          page_id는 각 게시글에서 자동으로 정해집니다. 설정에는 더 이상 page_id가 없어요.
          입력값은 브라우저 localStorage에만 저장되며 서버로 전송되지 않습니다.
        </p>
      )}
    </form>
  );
}
