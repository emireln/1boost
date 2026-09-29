import React, { useState, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

interface TooltipPosition {
  top: number;
  left: number;
}

const overlapArea = (a: DOMRect, b: DOMRect): number => {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

const getTooltipPosition = (anchor: HTMLElement, bubble: HTMLElement): TooltipPosition => {
  const anchorRect = anchor.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  const margin = 12;
  const gap = 8;
  const bubbleWidth = Math.min(bubbleRect.width, viewportWidth - margin * 2);
  const bubbleHeight = Math.min(bubbleRect.height, viewportHeight - margin * 2);
  const area = bubbleWidth * bubbleHeight;
  const occupied: DOMRect[] = [];
  const viewportArea = viewportWidth * viewportHeight;

  let current: HTMLElement = anchor;
  for (let depth = 0; depth < 4; depth += 1) {
    const parent = current.parentElement;
    if (!parent) break;

    for (const sibling of Array.from(parent.children)) {
      if (!(sibling instanceof HTMLElement) || sibling === current) continue;
      if (sibling.closest("#global-tooltip-portal")) continue;

      const rect = sibling.getBoundingClientRect();
      const siblingArea = rect.width * rect.height;
      if (siblingArea < 500 || siblingArea > viewportArea * 0.4) continue;

      const style = window.getComputedStyle(sibling);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
      occupied.push(rect);
    }

    current = parent;
  }

  const centerX = anchorRect.left + anchorRect.width / 2;
  const centerY = anchorRect.top + anchorRect.height / 2;
  const candidates = [
    { top: anchorRect.top - bubbleHeight - gap, left: centerX - bubbleWidth / 2 },
    { top: anchorRect.bottom + gap, left: centerX - bubbleWidth / 2 },
    { top: centerY - bubbleHeight / 2, left: anchorRect.right + gap },
    { top: centerY - bubbleHeight / 2, left: anchorRect.left - bubbleWidth - gap },
  ];

  return candidates
    .map(({ top, left }) => {
      const placedTop = clamp(top, margin, viewportHeight - margin - bubbleHeight);
      const placedLeft = clamp(left, margin, viewportWidth - margin - bubbleWidth);
      const placedRect = new DOMRect(placedLeft, placedTop, bubbleWidth, bubbleHeight);
      const edgeShift = Math.abs(placedTop - top) + Math.abs(placedLeft - left);
      const occupiedRatio = area
        ? occupied.reduce((total, rect) => total + overlapArea(placedRect, rect), 0) / area
        : 0;
      const anchorRatio = area ? overlapArea(placedRect, anchorRect) / area : 0;

      return {
        top: placedTop,
        left: placedLeft,
        score: edgeShift * 20 + occupiedRatio * 500 + anchorRatio * 1000,
      };
    })
    .sort((a, b) => a.score - b.score)[0];
};

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const targetRef = useRef<HTMLSpanElement | null>(null);
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!visible || !targetRef.current || !bubbleRef.current) return;

    const updatePosition = () => {
      if (!targetRef.current || !bubbleRef.current) return;
      setPosition(getTooltipPosition(targetRef.current, bubbleRef.current));
    };
    const dismiss = () => setVisible(false);

    updatePosition();
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", dismiss, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", dismiss, true);
    };
  }, [visible, content]);

  const portalEl = document.getElementById("global-tooltip-portal");

  return (
    <>
      <span
        ref={targetRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocusCapture={() => setVisible(true)}
        onBlurCapture={() => setVisible(false)}
        style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}
      >
        {children}
      </span>
      {visible &&
        portalEl &&
        ReactDOM.createPortal(
          <div
            ref={bubbleRef}
            className="md3-tooltip-bubble"
            style={{
              top: `${position?.top ?? 0}px`,
              left: `${position?.left ?? 0}px`,
              visibility: position ? "visible" : "hidden",
            }}
          >
            {content}
          </div>,
          portalEl
        )}
    </>
  );
};
