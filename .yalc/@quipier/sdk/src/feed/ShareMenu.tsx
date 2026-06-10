import { useEffect, useRef, useState } from "preact/hooks";
import { ShareIcon } from "./util.js";

interface Props {
  url: string;
  title?: string;
  text?: string;
}

/** Share affordance for a post: a small menu with "링크 복사" (always) and
 *  "공유하기" (native share sheet, only where the Web Share API exists). The
 *  copy option means a link is one click away even when the OS sheet buries it. */
export function ShareMenu({ url, title, text }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyLink() {
    setOpen(false);
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permissions) — last-resort prompt.
      window.prompt("링크 복사", url);
    }
  }

  async function nativeShare() {
    setOpen(false);
    try {
      await navigator.share({ title, text, url });
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
    }
  }

  return (
    <div class="quipier-share-menu" ref={ref}>
      <button
        type="button"
        class="quipier-action"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="공유"
        onClick={() => setOpen((v) => !v)}
      >
        <ShareIcon />
        <span>{copied ? "링크 복사됨" : "공유"}</span>
      </button>
      {open ? (
        <div class="quipier-menu quipier-share-popover" role="menu">
          <button class="quipier-menu-item" role="menuitem" onClick={copyLink}>
            링크 복사
          </button>
          {canNativeShare ? (
            <button class="quipier-menu-item" role="menuitem" onClick={nativeShare}>
              공유하기…
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
