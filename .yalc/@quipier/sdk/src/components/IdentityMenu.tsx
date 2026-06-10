import { useEffect, useRef } from "preact/hooks";

interface Props {
  nickname: string;
  tokenId: string;
  /** Passport management page URL (passportAppOrigin + "/me"). */
  manageUrl: string;
  onDisconnect: () => void;
  onClose: () => void;
}

export function IdentityMenu({ nickname, tokenId, manageUrl, onDisconnect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div ref={ref} class="quipier-menu" role="menu">
      <div class="quipier-menu-head">
        <strong class="quipier-menu-nick">{nickname || "(no nickname)"}</strong>
        <span class="quipier-menu-token">{truncate(tokenId)}</span>
      </div>
      <div class="quipier-menu-sep" />
      <a
        class="quipier-menu-item"
        role="menuitem"
        href={manageUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
      >
        패스포트 관리 ↗
      </a>
      <button
        class="quipier-menu-item"
        role="menuitem"
        onClick={() => {
          onDisconnect();
          onClose();
        }}
      >
        로그아웃
      </button>
    </div>
  );
}

function truncate(s: string): string {
  if (s.length <= 12) return s;
  return s.slice(0, 6) + "…" + s.slice(-4);
}
