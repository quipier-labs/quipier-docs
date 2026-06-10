import { useEffect, useRef, useState } from "preact/hooks";
import type { ReportReason } from "../types.js";

interface Props {
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReport: (reason: ReportReason) => void;
  /** Show the report path for non-own comments. Default true. */
  canReport?: boolean;
}

const REPORT_REASONS: [ReportReason, string][] = [
  ["spam", "스팸/광고"],
  ["harassment", "욕설/혐오"],
  ["adult", "음란물"],
  ["privacy", "개인정보 노출"],
  ["other", "기타"],
];

export function CommentMenu({
  isOwn,
  onEdit,
  onDelete,
  onReport,
  canReport = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setReportMode(false);
      return;
    }
    function onDocDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close(fn: () => void) {
    return () => {
      setOpen(false);
      fn();
    };
  }

  return (
    <div class="quipier-rowmenu" ref={ref}>
      <button
        type="button"
        class="quipier-rowmenu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="더보기"
        onClick={() => setOpen((v) => !v)}
      >
        <DotsIcon />
      </button>
      {open ? (
        <div class="quipier-menu quipier-rowmenu-popover" role="menu">
          {isOwn ? (
            <>
              <button class="quipier-menu-item" role="menuitem" onClick={close(onEdit)}>
                수정
              </button>
              <button
                class="quipier-menu-item is-danger"
                role="menuitem"
                onClick={close(onDelete)}
              >
                삭제
              </button>
            </>
          ) : !canReport ? null : reportMode ? (
            <>
              <div class="quipier-menu-head">
                <span class="quipier-menu-nick">신고 사유</span>
              </div>
              {REPORT_REASONS.map(([reason, label]) => (
                <button
                  key={reason}
                  class="quipier-menu-item"
                  role="menuitem"
                  onClick={close(() => onReport(reason))}
                >
                  {label}
                </button>
              ))}
            </>
          ) : (
            <button
              class="quipier-menu-item"
              role="menuitem"
              onClick={() => setReportMode(true)}
            >
              신고하기
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function DotsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <circle cx="5" cy="12" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="12" r="1.8" />
    </svg>
  );
}
