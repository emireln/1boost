import React from "react";
import { UpdateStatus } from "../hooks/useUpdater";
import { AppLogoIcon } from "./AppLogoIcon";
import { useTranslation } from "../i18n/useTranslation";
import pkg from "../../package.json";

interface UpdateModalProps {
  status: UpdateStatus;
  onClose: () => void;
  onCheckAgain: () => void;
  onDownloadAndInstall: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  status,
  onClose,
  onCheckAgain,
  onDownloadAndInstall,
}) => {
  const { t } = useTranslation();
  const progressPercent = status.totalBytes
    ? Math.min(100, Math.round((status.downloadedBytes / status.totalBytes) * 100))
    : 0;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "24px",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "460px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.8)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AppLogoIcon size={24} />
            <span style={{ fontWeight: 700, fontSize: "16px", color: "var(--text-primary)" }}>
              {t("updater_title")}
            </span>
          </div>

          <button className="icon-btn-containerless" onClick={onClose} aria-label={t("close")}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Checking State */}
        {status.checking && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <span
              className="material-symbols-outlined spin"
              style={{ fontSize: "42px", color: "var(--accent-color)", marginBottom: "12px" }}
            >
              sync
            </span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
              {t("updater_checking")}
            </p>
          </div>
        )}

        {/* Update Available State */}
        {!status.checking && status.available && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--accent-color)",
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--accent-color)", textTransform: "uppercase" }}>
                  {t("updater_new_release")}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                  v{status.version}
                </div>
              </div>

              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: "var(--accent-color)" }}>
                system_update
              </span>
            </div>

            {/* Release Notes */}
            <div
              style={{
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--outline-border)",
                borderRadius: "8px",
                padding: "12px 14px",
                fontSize: "12px",
                color: "var(--text-secondary)",
                maxHeight: "140px",
                overflowY: "auto",
              }}
            >
              <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                {t("updater_whats_new")} v{status.version}:
              </div>
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{status.body}</p>
            </div>

            {/* Downloading Progress Bar */}
            {status.downloading && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
                  <span>{t("updater_downloading")}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div
                  style={{
                    height: "6px",
                    backgroundColor: "var(--surface-2)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progressPercent}%`,
                      backgroundColor: "var(--accent-color)",
                      transition: "width 0.2s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Download CTA Button */}
            <button
              className="btn-primary"
              onClick={onDownloadAndInstall}
              disabled={status.downloading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <span className="material-symbols-outlined">download</span>
              <span>{status.downloading ? t("updater_installing") : t("updater_relaunch_btn")}</span>
            </button>
          </div>
        )}

        {/* Up to Date State */}
        {!status.checking && !status.available && !status.error && (
          <div style={{ textAlign: "center", padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: "var(--success-color)" }}>
              check_circle
            </span>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                {t("updater_latest")}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "4px" }}>
                1boost v{pkg.version} {t("updater_up_to_date")}
              </div>
            </div>

            <button className="btn-secondary" onClick={onCheckAgain} style={{ marginTop: "10px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                refresh
              </span>
              <span>{t("updater_check_again")}</span>
            </button>
          </div>
        )}

        {/* Error State */}
        {status.error && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: "13px", color: "#FF6B6B", marginBottom: "14px" }}>
              {status.error}
            </div>
            <button className="btn-secondary" onClick={onCheckAgain}>
              {t("updater_retry")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
