import { useEffect, useRef, useState } from "preact/hooks";
import { LIMITS } from "../constants.js";

interface Props {
  disabled?: boolean;
  placeholder?: string;
  submitLabel?: string;
  initialValue?: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
}

export function CommentForm({
  disabled,
  placeholder = "댓글 추가...",
  submitLabel = "Post",
  initialValue = "",
  onSubmit,
  onCancel,
  autoFocus = true,
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const ta = ref.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [value]);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const content = value.trim();
    if (content.length === 0 || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(content);
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form class="quipier-composer" onSubmit={handleSubmit}>
      <div class="quipier-composer-input is-expanded">
        <textarea
          ref={ref}
          class="quipier-composer-textarea"
          value={value}
          rows={1}
          maxLength={LIMITS.COMMENT_CONTENT_MAX}
          placeholder={placeholder}
          disabled={disabled || submitting}
          onInput={(e) => setValue((e.target as HTMLTextAreaElement).value)}
        />
      </div>
      {error ? <div class="quipier-error">{error}</div> : null}
      <div class="quipier-composer-actions">
        {onCancel ? (
          <button
            type="button"
            class="quipier-button-ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            취소
          </button>
        ) : null}
        <button
          type="submit"
          class="quipier-button"
          disabled={disabled || submitting || value.trim().length === 0}
        >
          {submitting ? "Posting…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
