import React from "react";
import { TweakProgressPayload } from "../types/tweak";
import { LogoBanner } from "./LogoBanner";
import { ParallaxStars } from "./ParallaxStars";
import { useTranslation } from "../i18n/useTranslation";

interface DashboardViewProps {
  onRunBoost: () => void;
  isRunning: boolean;
  progress: TweakProgressPayload | null;
  selectedCount: number;
  lastRunTime: string | null;
  createRestorePoint: boolean;
  enableParallaxStars: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onRunBoost,
  isRunning,
  progress,
  selectedCount,
  lastRunTime,
  enableParallaxStars,
}) => {
  const percentage = progress ? Math.min(100, Math.max(0, progress.percentage)) : 0;
  const { t } = useTranslation();

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {/* Optional Parallax Stars Background Layer */}
      {enableParallaxStars && <ParallaxStars />}

      {/* Top Vector Banner */}
      <div
        style={{
          position: "absolute",
          top: "36px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <LogoBanner height={88} />
      </div>

      {/* Hero Boost Button - Exactly Middle of Screen */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          zIndex: 2,
        }}
      >
        <button
          className={`hero-boost-button ${isRunning ? "running" : ""}`}
          onClick={onRunBoost}
          disabled={isRunning || selectedCount === 0}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "56px", lineHeight: "1" }}
          >
            {isRunning ? "sync" : "bolt"}
          </span>
          <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase" }}>
            {isRunning ? t("boosting") : t("boost_now")}
          </span>
        </button>

        {/* Minimalist Progress Track (Only displayed during active boost) */}
        {isRunning && (
          <div
            style={{
              width: "280px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "var(--surface-2)",
                borderRadius: "3px",
                overflow: "hidden",
                border: "1px solid var(--outline-border)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percentage}%`,
                  backgroundColor: "var(--accent-color)",
                  borderRadius: "3px",
                  boxShadow: "0 0 12px rgba(235, 93, 61, 0.5)",
                  transition: "width 0.25s ease-in-out",
                }}
              />
            </div>
            {progress?.step_name && (
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                  maxWidth: "280px",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {progress.step_name} ({percentage}%)
              </span>
            )}
          </div>
        )}

        {/* Status Subtitle Below Button */}
        {!isRunning && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {selectedCount > 0
                ? `${selectedCount} ${t("optimizations_queued")}`
                : t("ready_to_optimize")}
            </span>
            {lastRunTime && (
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {t("system_optimized")}: {lastRunTime}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
