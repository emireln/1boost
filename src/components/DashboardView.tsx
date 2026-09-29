import React from "react";
import { TweakProgressPayload } from "../types/tweak";
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
    <main className="dashboard-view">
      {/* Optional Parallax Stars Background Layer */}
      {enableParallaxStars && <ParallaxStars />}

      <section className="dashboard-hero" aria-label={t("nav_boost")}>
        <button
          className={`hero-boost-button ${isRunning ? "running" : ""}`}
          onClick={onRunBoost}
          disabled={isRunning || selectedCount === 0}
          aria-label={isRunning ? t("boosting") : t("boost_now")}
          aria-busy={isRunning}
        >
          {isRunning ? (
            <span className="material-symbols-outlined hero-boost-icon" aria-hidden="true">
              sync
            </span>
          ) : (
            <svg className="hero-boost-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.2 2.5 5.7 13h5l-.8 8.5L18.3 10h-5.1z" fill="currentColor" />
            </svg>
          )}
          <span className="hero-boost-label">
            {isRunning ? t("boosting") : t("boost_now")}
          </span>
        </button>

        {isRunning && (
          <div className="dashboard-progress">
            <div className="dashboard-progress-track">
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
              <span className="dashboard-progress-label">
                {progress.step_name} ({percentage}%)
              </span>
            )}
          </div>
        )}

        {!isRunning && (
          <div className="dashboard-status">
            <span className="dashboard-status-count">
              {selectedCount > 0
                ? `${selectedCount} ${t("optimizations_queued")}`
                : t("ready_to_optimize")}
            </span>
            {lastRunTime && (
              <span className="dashboard-status-time">
                {t("system_optimized")}: {lastRunTime}
              </span>
            )}
          </div>
        )}
      </section>
    </main>
  );
};
