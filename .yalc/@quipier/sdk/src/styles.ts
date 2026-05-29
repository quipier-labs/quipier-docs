const CSS = `
/* Palette — overridable per-container via CSS custom properties
   (e.g. .my-comments { --quipier-accent: #e11; }). */
.quipier-root {
  --quipier-fg: #1a1a1a;
  --quipier-muted: #6a6c6f;
  --quipier-faint: #888888;
  --quipier-surface: #ffffff;
  --quipier-border: #d7d9dc;
  --quipier-border-soft: #ececec;
  --quipier-hover: #f0f1f2;
  --quipier-accent: #1a1a1a;
  --quipier-accent-fg: #ffffff;
  --quipier-link: #2667e6;
  --quipier-link-hover: #eaf2ff;
  --quipier-like: #ff4500;
  --quipier-like-hover: #ffe9e0;
  --quipier-danger: #bb0000;
  --quipier-danger-hover: #fdecec;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: var(--quipier-fg);
  font-size: 14px;
}

.quipier-root[data-quipier-theme="dark"] {
  --quipier-fg: #ededed;
  --quipier-muted: #a0a0a0;
  --quipier-faint: #8a8a8a;
  --quipier-surface: #1f1f1f;
  --quipier-border: #3a3a3a;
  --quipier-border-soft: #2c2c2c;
  --quipier-hover: #2a2a2a;
  --quipier-accent: #ededed;
  --quipier-accent-fg: #141414;
  --quipier-link: #5b9bff;
  --quipier-link-hover: rgba(91, 155, 255, 0.16);
  --quipier-like: #ff6a3d;
  --quipier-like-hover: rgba(255, 106, 61, 0.18);
  --quipier-danger: #ff8080;
  --quipier-danger-hover: rgba(255, 128, 128, 0.16);
}
@media (prefers-color-scheme: dark) {
  .quipier-root[data-quipier-theme="auto"] {
    --quipier-fg: #ededed;
    --quipier-muted: #a0a0a0;
    --quipier-faint: #8a8a8a;
    --quipier-surface: #1f1f1f;
    --quipier-border: #3a3a3a;
    --quipier-border-soft: #2c2c2c;
    --quipier-hover: #2a2a2a;
    --quipier-accent: #ededed;
    --quipier-accent-fg: #141414;
    --quipier-link: #5b9bff;
    --quipier-link-hover: rgba(91, 155, 255, 0.16);
    --quipier-like: #ff6a3d;
    --quipier-like-hover: rgba(255, 106, 61, 0.18);
    --quipier-danger: #ff8080;
    --quipier-danger-hover: rgba(255, 128, 128, 0.16);
  }
}

/* ---------- header ---------- */
.quipier-header { display: flex; align-items: center; gap: 24px; margin-bottom: 20px; }
.quipier-count { font-size: 16px; font-weight: 700; color: var(--quipier-fg); }
.quipier-sort { position: relative; }
.quipier-sort-button { display: inline-flex; align-items: center; gap: 8px; padding: 6px 8px; background: transparent; border: none; color: inherit; font: inherit; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 6px; }
.quipier-sort-button:hover { background: var(--quipier-hover); }
.quipier-sort-menu { top: calc(100% + 4px); left: 0; }

/* ---------- composer ---------- */
.quipier-composer { margin-bottom: 24px; }
.quipier-composer-row { display: flex; gap: 12px; align-items: flex-start; }
.quipier-composer-avatar { position: relative; flex-shrink: 0; }
.quipier-avatar-button { padding: 0; border: none; background: transparent; cursor: pointer; border-radius: 50%; }
.quipier-avatar-button:disabled { cursor: default; }
.quipier-avatar-button:not(:disabled):hover { opacity: 0.85; }
.quipier-composer-input { flex: 1; min-width: 0; border-bottom: 1px solid var(--quipier-border); transition: border-color 0.15s; }
.quipier-composer-input.is-expanded { border-bottom-color: var(--quipier-fg); border-bottom-width: 2px; }
.quipier-composer-textarea { width: 100%; padding: 6px 0; border: none; outline: none; resize: none; font: inherit; background: transparent; color: inherit; line-height: 1.5; overflow: hidden; box-sizing: border-box; }
.quipier-composer-textarea::placeholder { color: var(--quipier-muted); }
.quipier-composer-textarea:disabled { background: transparent; cursor: not-allowed; }
.quipier-composer-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }

/* ---------- buttons ---------- */
.quipier-button { padding: 7px 16px; border: none; border-radius: 999px; background: var(--quipier-accent); color: var(--quipier-accent-fg); cursor: pointer; font: inherit; font-weight: 600; font-size: 13px; }
.quipier-button:disabled { opacity: 0.4; cursor: not-allowed; }
.quipier-button-ghost { background: transparent; color: var(--quipier-fg); border: none; padding: 7px 14px; border-radius: 999px; cursor: pointer; font: inherit; font-weight: 600; font-size: 13px; }
.quipier-button-ghost:hover:not(:disabled) { background: var(--quipier-hover); }
.quipier-button-ghost:disabled { opacity: 0.4; cursor: not-allowed; }
.quipier-loadmore { padding: 6px 14px; border: 1px solid var(--quipier-border); background: var(--quipier-surface); color: inherit; border-radius: 999px; cursor: pointer; font: inherit; font-size: 13px; align-self: center; margin-top: 12px; }

/* ---------- avatar ---------- */
.quipier-avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: #fff; font-weight: 700; flex-shrink: 0; user-select: none; line-height: 1; }

/* ---------- overlay menu (shared by identity + sort + row 3-dot) ---------- */
.quipier-menu { position: absolute; min-width: 160px; background: var(--quipier-surface); border: 1px solid var(--quipier-border); border-radius: 10px; box-shadow: 0 6px 24px rgba(0,0,0,0.18); padding: 6px; z-index: 20; }
.quipier-composer-avatar .quipier-menu { top: calc(100% + 6px); left: 0; }
.quipier-menu-head { padding: 8px 10px; display: flex; flex-direction: column; gap: 2px; }
.quipier-menu-nick { color: var(--quipier-fg); font-size: 14px; font-weight: 700; }
.quipier-menu-token { color: var(--quipier-muted); font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.quipier-menu-sep { height: 1px; background: var(--quipier-border-soft); margin: 4px 0; }
.quipier-menu-item { display: flex; width: 100%; align-items: center; padding: 8px 10px; background: transparent; border: none; cursor: pointer; font: inherit; font-size: 14px; color: var(--quipier-fg); border-radius: 6px; text-align: left; }
.quipier-menu-item:hover { background: var(--quipier-hover); }
.quipier-menu-item.is-active { font-weight: 700; }
.quipier-menu-item.is-danger { color: var(--quipier-danger); }
.quipier-menu-item.is-danger:hover { background: var(--quipier-danger-hover); }

/* ---------- comment list / thread ---------- */
.quipier-list { display: flex; flex-direction: column; gap: 20px; }
.quipier-empty { color: var(--quipier-faint); padding: 16px 0; text-align: center; font-size: 14px; }
.quipier-error { color: var(--quipier-danger); font-size: 13px; padding: 6px 0; }
.quipier-thread { display: flex; flex-direction: column; }
/* Replies: indented so the "ㄴ" connector emerges from parent avatar's center column. */
.quipier-thread-children { margin-top: 8px; margin-left: 16px; padding-left: 28px; display: flex; flex-direction: column; gap: 16px; position: relative; overflow: hidden; }
.quipier-thread-children > * { position: relative; }
.quipier-thread-children > *::before { content: ""; position: absolute; top: -9999px; height: calc(9999px + 12px); left: -28px; width: 16px; border-left: 1px solid var(--quipier-border); border-bottom: 1px solid var(--quipier-border); border-bottom-left-radius: 12px; pointer-events: none; }
.quipier-thread-children > .quipier-thread-toggle::before,
.quipier-thread-children > .quipier-thread-more::before { display: none; }

/* toggle / load-more buttons */
.quipier-thread-toggle, .quipier-thread-more { display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; padding: 4px 10px; background: transparent; border: none; cursor: pointer; font: inherit; font-size: 13px; font-weight: 700; color: var(--quipier-link); border-radius: 999px; }
.quipier-thread-toggle:hover, .quipier-thread-more:hover { background: var(--quipier-link-hover); }
.quipier-thread-more { color: var(--quipier-muted); font-weight: 600; }
.quipier-thread-more:hover { background: var(--quipier-hover); color: var(--quipier-fg); }

/* ---------- comment item ---------- */
.quipier-item { display: flex; gap: 10px; align-items: flex-start; position: relative; }
.quipier-item-body { flex: 1; min-width: 0; }
.quipier-item-head { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--quipier-muted); margin-bottom: 4px; }
.quipier-item-author { font-weight: 700; color: var(--quipier-fg); font-size: 13px; }
.quipier-item-dot { color: var(--quipier-faint); }
.quipier-item-content { white-space: pre-wrap; word-break: break-word; line-height: 1.5; color: var(--quipier-fg); }
.quipier-item-content.is-deleted { color: var(--quipier-faint); font-style: italic; }
.quipier-item-content.is-hidden { color: var(--quipier-faint); font-style: italic; display: flex; align-items: center; gap: 8px; }
.quipier-hidden-banner {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 4px 8px; margin-bottom: 4px;
  background: var(--quipier-hover);
  border-left: 2px solid var(--quipier-faint);
  border-radius: 4px;
  font-size: 12px; color: var(--quipier-muted);
}
.quipier-hidden-toggle {
  border: none; background: transparent;
  font: inherit; font-size: 12px; font-weight: 600;
  color: var(--quipier-link, #6366f1);
  cursor: pointer; padding: 2px 6px; border-radius: 4px;
}
.quipier-hidden-toggle:hover { background: var(--quipier-hover); }
.quipier-author-badge {
  font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 999px;
  line-height: 1.4;
}
.quipier-author-blocked {
  background: rgba(220, 38, 38, 0.1);
  color: rgb(220, 38, 38);
}

/* row 3-dot menu, pinned to the right of the header line */
.quipier-rowmenu { margin-left: auto; position: relative; }
.quipier-rowmenu-trigger { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; border: none; background: transparent; color: var(--quipier-muted); cursor: pointer; border-radius: 50%; }
.quipier-rowmenu-trigger:hover { background: var(--quipier-hover); color: var(--quipier-fg); }
.quipier-rowmenu-popover { top: calc(100% + 4px); right: 0; }

/* actions row */
.quipier-actions { display: flex; align-items: center; gap: 4px; margin-top: 6px; margin-left: -8px; }
.quipier-action { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border: none; background: transparent; border-radius: 999px; color: var(--quipier-muted); cursor: pointer; font: inherit; font-size: 12px; font-weight: 600; }
.quipier-action:hover { background: var(--quipier-hover); color: var(--quipier-fg); }
.quipier-action.is-active { color: var(--quipier-like); }
.quipier-action.is-active:hover { background: var(--quipier-like-hover); }
.quipier-action svg { width: 14px; height: 14px; }

/* ---------- reply / edit form (inside item) ---------- */
.quipier-reply-form, .quipier-edit-form { margin-top: 8px; }
`;

let injected = false;

export function injectStyles(): void {
  if (injected) return;
  injected = true;
  const style = document.createElement("style");
  style.setAttribute("data-quipier", "");
  style.textContent = CSS;
  document.head.appendChild(style);
}
