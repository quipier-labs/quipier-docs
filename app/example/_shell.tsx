"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QuipierProvider } from "@quipier/sdk/react";
import { QUIPIER_URLS } from "@/lib/urls";

const STORAGE_KEY = "quipier-example:config";
const DEFAULT_API_BASE = QUIPIER_URLS.api;
const DEFAULT_WALLET_APP_ORIGIN = QUIPIER_URLS.passport;

export interface Config {
  projectId: string;
  apiKey: string;
  apiBase: string;
  walletAppOrigin: string;
}

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
    window.history.replaceState({}, "", window.location.pathname);
    return fromUrl;
  }
  return loadConfig();
}

/** Tab nav between the two playgrounds. */
function PlaygroundNav() {
  const pathname = usePathname();
  const tabs = [
    { href: "/example/simple-comments", label: "Simple Comments" },
    { href: "/example/feed", label: "Feed" },
  ];
  return (
    <nav className="pg-nav" role="tablist">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          role="tab"
          aria-selected={pathname === t.href}
          className={"pg-nav-tab" + (pathname === t.href ? " is-active" : "")}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Shared playground shell: handles project config (localStorage / dashboard URL),
 * shows the config form until creds are entered, then wraps `children` in a
 * QuipierProvider plus a Simple Comments / Feed tab switcher. Config is shared
 * across both routes (same storage key).
 */
export function ExampleShell({
  children,
}: {
  children: (config: Config) => ReactNode;
}) {
  const [config, setConfig] = useState<Config | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const c = initialConfig();
    if (c) setConfig(c);
  }, []);

  return (
    <main className="qp-pg">
      <header>
        <h1>Quipier 플레이그라운드</h1>
        <p className="muted">
          <a href={QUIPIER_URLS.app} target="_blank" rel="noreferrer">
            대시보드
          </a>
          에서 프로젝트를 만들고 <code>project id</code>와 <code>publishable key</code>를 가져오세요.
        </p>
      </header>

      <PlaygroundNav />

      {config && !editing ? (
        <QuipierProvider config={config}>
          <ConfigSummary config={config} onEdit={() => setEditing(true)} />
          {children(config)}
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
      setJsonText(fieldsAsJson());
    } else {
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
          입력값은 브라우저 localStorage에만 저장되며 서버로 전송되지 않습니다. 설정은 두 탭(댓글·피드)이
          공유합니다.
        </p>
      )}
    </form>
  );
}
