import { useEffect, useRef, useState } from "preact/hooks";
import { LIMITS } from "../constants.js";
import { Avatar } from "./Avatar.js";
import { IdentityMenu } from "./IdentityMenu.js";

interface Props {
  // null when not connected — clicking the composer triggers connect instead.
  session: { tokenId: string; nickname: string } | null;
  onSubmit: (content: string) => Promise<void>;
  onConnectRequest: () => void;
  onDisconnect: () => void;
  /** Passport management page URL, passed through to the identity menu. */
  manageUrl: string;
  placeholder?: string;
}

export function Composer({
  session,
  onSubmit,
  onConnectRequest,
  onDisconnect,
  manageUrl,
  placeholder = "댓글 추가...",
}: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [value, focused]);

  function focusInput() {
    if (!session) {
      onConnectRequest();
      return;
    }
    textareaRef.current?.focus();
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const content = value.trim();
    if (content.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(content);
      setValue("");
      setFocused(false);
      textareaRef.current?.blur();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "failed to post";
      // Surface the operator's anti-abuse blocks with friendlier copy than the
      // raw server message ("this passport is blocked from commenting" etc.).
      const friendly =
        /blocked from commenting/i.test(raw) || /차단/.test(raw)
          ? "이 패스포트는 운영자에 의해 차단되어 댓글을 작성할 수 없습니다."
          : /this IP is blocked/i.test(raw)
            ? "이 위치(IP)에서는 일시적으로 댓글 작성이 차단됐어요. 잠시 후 다시 시도해주세요."
            : /quota exceeded/i.test(raw)
              ? "이 프로젝트의 댓글 한도에 도달해 잠시 작성이 막혔습니다."
              : raw;
      setError(friendly);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setValue("");
    setFocused(false);
    setError(null);
    textareaRef.current?.blur();
  }

  const expanded = focused || value.length > 0;
  const seed = session?.tokenId ?? "guest";
  const label = session?.nickname ?? null;

  return (
    <form class="quipier-composer" onSubmit={handleSubmit}>
      <div class="quipier-composer-row">
        <div class="quipier-composer-avatar">
          <button
            type="button"
            class="quipier-avatar-button"
            onClick={() => session && setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={!session}
          >
            <Avatar seed={seed} label={label} size={32} />
          </button>
          {menuOpen && session ? (
            <IdentityMenu
              nickname={session.nickname}
              tokenId={session.tokenId}
              manageUrl={manageUrl}
              onDisconnect={onDisconnect}
              onClose={() => setMenuOpen(false)}
            />
          ) : null}
        </div>
        <div class={`quipier-composer-input${expanded ? " is-expanded" : ""}`}>
          <textarea
            ref={textareaRef}
            class="quipier-composer-textarea"
            value={value}
            rows={1}
            maxLength={LIMITS.COMMENT_CONTENT_MAX}
            placeholder={placeholder}
            disabled={submitting}
            onClick={() => {
              if (!session) onConnectRequest();
            }}
            onFocus={() => {
              if (!session) {
                onConnectRequest();
                textareaRef.current?.blur();
                return;
              }
              setFocused(true);
            }}
            onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
            readOnly={!session}
          />
        </div>
      </div>
      {error ? <div class="quipier-error">{error}</div> : null}
      {expanded ? (
        <div class="quipier-composer-actions">
          <button
            type="button"
            class="quipier-button-ghost"
            onClick={handleCancel}
            disabled={submitting}
          >
            취소
          </button>
          <button
            type="submit"
            class="quipier-button"
            disabled={submitting || value.trim().length === 0}
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      ) : null}
    </form>
  );
}
