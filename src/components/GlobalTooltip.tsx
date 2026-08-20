import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    const tooltipHeight = 32;
    const tooltipWidth = 140; // estimated fallback

    let top = rect.top - tooltipHeight - 6;
    let left = rect.left + rect.width / 2;

    // Boundary detection & flip logic
    if (top < 10) {
      top = rect.bottom + 6; // Flip to bottom
    }

    if (left - tooltipWidth / 2 < 10) {
      left = tooltipWidth / 2 + 10;
    } else if (left + tooltipWidth / 2 > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth / 2 - 10;
    }

    setPosition({ top, left });
    setVisible(true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  useEffect(() => {
    const handleScroll = () => setVisible(false);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  const portalEl = document.getElementById("global-tooltip-portal");

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {children}
      </div>
      {visible &&
        portalEl &&
        ReactDOM.createPortal(
          <div
            className="md3-tooltip-bubble"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: "translateX(-50%)",
            }}
          >
            {content}
          </div>,
          portalEl
        )}
    </>
  );
};
