"use client";

import { useEffect, useState } from "react";

/**
 * Copies a phone number or email address, then confirms in place for a moment.
 * Useful on desktop, where a tel: link has nothing to open.
 *
 * If the clipboard is blocked the button simply does nothing: the value is
 * printed right beside it and can still be selected by hand.
 */
export function CopyButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      /* clipboard unavailable; the value stays selectable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="meta copy-button"
      data-copied={copied ? "true" : undefined}
    >
      <span className="link-underline">{copied ? copiedLabel : label}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
