import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { LIMITS } from "../constants.js";
import { FeaturesContext } from "../context.js";
import { fileToDataUrl } from "../image.js";
import { Avatar } from "./Avatar.js";
import { IdentityMenu } from "./IdentityMenu.js";

interface Props {
  // null when not connected — clicking the composer triggers connect instead.
  session: { tokenId: string; nickname: string } | null;
  onSubmit: (content: string, image?: string | null) => Promise<void>;
  onConnectRequest: () => void;
  onDisconnect: () => void;
  /** Passport management page URL, passed through to the identity menu. */
  manageUrl: string;
  placeholder?: string;
  /** Show an image-attach button (feed posts). Default false. */
  allowImage?: boolean;
}

export function Composer({
  session,
  onSubmit,
  onConnectRequest,
  onDisconnect,
  manageUrl,
  placeholder = "댓글 추가...",
  allowImage = false,
}: Props) {
  const features = useContext(FeaturesContext);
  const [value, setValue] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [value, focused]);

  function pickImage() {
    if (!session) {
      onConnectRequest();
      return;
    }
    fileRef.current?.click();
  }

  async function onPickImage(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = ""; // allow re-picking the same file
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImage(dataUrl);
      setFocused(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "이미지를 불러오지 못했습니다");
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const content = value.trim();
    if ((content.length === 0 && !image) || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(content, image);
      setValue("");
      setImage(null);
      setFocused(false);
      textareaRef.current?.blur();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "failed to post";
      const friendly =
        /blocked from commenting|blocked from posting/i.test(raw) || /차단/.test(raw)
          ? "이 패스포트는 운영자에 의해 차단되어 작성할 수 없습니다."
          : /this IP is blocked/i.test(raw)
            ? "이 위치(IP)에서는 일시적으로 작성이 차단됐어요. 잠시 후 다시 시도해주세요."
            : /quota exceeded/i.test(raw)
              ? "이 프로젝트의 한도에 도달해 잠시 작성이 막혔습니다."
              : /≤|too large|KB/i.test(raw)
                ? "이미지를 처리하지 못했어요. 다른 이미지로 다시 시도해주세요."
                : raw;
      setError(friendly);
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    setValue("");
    setImage(null);
    setFocused(false);
    setError(null);
    textareaRef.current?.blur();
  }

  const expanded = focused || value.length > 0 || !!image;
  const seed = session?.tokenId ?? "guest";
  const label = session?.nickname ?? null;
  const canSubmit = (value.trim().length > 0 || !!image) && !submitting;

  return (
    <form class="quipier-composer" data-quipier-part="composer" onSubmit={handleSubmit}>
      <div class="quipier-composer-row">
        {features.avatars ? (
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
        ) : null}
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
        {allowImage ? (
          <button
            type="button"
            class="quipier-composer-imgbtn"
            onClick={pickImage}
            aria-label="이미지 첨부"
            title="이미지 첨부"
          >
            <ImageIcon />
          </button>
        ) : null}
      </div>

      {image ? (
        <div class="quipier-composer-image">
          <img src={image} alt="첨부 이미지 미리보기" />
          <button
            type="button"
            class="quipier-composer-image-remove"
            onClick={() => setImage(null)}
            aria-label="이미지 제거"
          >
            ×
          </button>
        </div>
      ) : null}

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
          <button type="submit" class="quipier-button" disabled={!canSubmit}>
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      ) : null}

      {allowImage ? (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style="display:none"
          onChange={onPickImage}
        />
      ) : null}
    </form>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}
