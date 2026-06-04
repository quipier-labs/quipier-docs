"use client";

import { QuipierComments, QuipierProvider } from "@quipier/sdk/react";
import type {
  Appearance,
  Features,
  QuipierCommentView,
  Slots,
} from "@quipier/sdk";

// Live previews for the customization docs. Each named recipe mirrors a code
// block on the page and renders the REAL widget (dogfooding the 0.2.0 API)
// against the docs' own mock endpoint (/preview-api) — no external project.

interface Recipe {
  theme?: "light" | "dark";
  appearance?: Appearance;
  features?: Features;
  slots?: Slots;
}

const el = (css: string, text?: string) => {
  const d = document.createElement("div");
  d.style.cssText = css;
  if (text) d.textContent = text;
  return d;
};

const RECIPES: Record<string, Recipe> = {
  default: {},

  brand: {
    appearance: {
      accent: "#16a34a",
      accentText: "#ffffff",
      link: "#16a34a",
      like: "#16a34a",
      font: "Pretendard, -apple-system, sans-serif",
      radius: 10,
      pillRadius: 10,
    },
  },

  dark: {
    theme: "dark",
    appearance: {
      accent: "#22d3ee",
      accentText: "#04222a",
      surface: "#0b1020",
      gap: 24,
    },
  },

  minimal: {
    features: { sort: false, badge: false, avatars: false },
    appearance: { gap: 14, fontSize: 13 },
  },

  readonly: {
    features: {
      composer: false,
      likes: false,
      replies: false,
      report: false,
      menu: false,
    },
  },

  avatar: {
    slots: {
      avatar: (view: QuipierCommentView) =>
        el(
          "width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;background:linear-gradient(135deg,#f97316,#db2777)",
          (view.author.nickname || "?").charAt(0).toUpperCase(),
        ),
      authorLabel: (view: QuipierCommentView) =>
        `<span style="font-weight:800">${
          view.author.nickname ?? "anon"
        }</span> <span style="font-size:11px;background:#fce7f3;color:#db2777;padding:1px 6px;border-radius:999px">VIP</span>`,
    },
  },

  highlight: {
    slots: {
      comment: (view, ctx) => {
        if (view.likes.count < 5) return null; // 인기 댓글만 강조
        const wrap = el(
          "border-left:3px solid #f59e0b;padding-left:10px;background:#fffbeb;border-radius:6px",
        );
        wrap.append(
          el("font-size:11px;font-weight:700;color:#b45309;padding:4px 0", "⭐ 인기 댓글"),
          ctx.defaultNode(),
        );
        return wrap;
      },
    },
  },

  card: {
    slots: {
      comment: (view, ctx) => {
        if (view.isDeleted) return null;
        const card = el(
          "border:1px solid #e5e7eb;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px",
        );
        const head = el(
          "display:flex;justify-content:space-between;align-items:center",
        );
        head.innerHTML =
          `<strong style="font-size:13px">${view.author.nickname ?? "익명"}</strong>` +
          `<time style="color:#9ca3af;font-size:12px">${ctx.helpers.formatTime(
            view.createdAt,
          )}</time>`;
        const body = el("margin:0;font-size:14px;line-height:1.55");
        body.textContent = view.content;
        const like = document.createElement("button");
        like.textContent = `${view.likes.likedByMe ? "♥" : "♡"} ${view.likes.count}`;
        like.style.cssText =
          "align-self:flex-start;border:none;background:#f3f4f6;border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer";
        like.onclick = () =>
          view.likes.likedByMe ? ctx.actions.unlike() : ctx.actions.like();
        card.append(head, body, like);
        return card;
      },
    },
  },
};

export function CustomizePreview({ recipe = "default" }: { recipe?: string }) {
  const r = RECIPES[recipe] ?? RECIPES.default;
  const boxBg = r.appearance?.surface ?? "#ffffff";
  const dark = r.theme === "dark";

  return (
    <div
      className="qp-preview"
      style={{
        background: boxBg,
        border: `1px solid ${dark ? "#1e293b" : "#e5e7eb"}`,
        borderRadius: 12,
        padding: 18,
        marginBottom: 8,
      }}
    >
      <QuipierProvider
        config={{
          projectId: "demo",
          apiKey: "qp_demo",
          apiBase: "/preview-api",
          passportAppOrigin: "https://passport.quipier.com",
        }}
      >
        <QuipierComments
          pageId={`/preview/${recipe}`}
          theme={r.theme}
          appearance={r.appearance}
          features={r.features}
          slots={r.slots}
        />
      </QuipierProvider>
    </div>
  );
}
