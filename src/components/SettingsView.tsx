import React, { useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { Language } from "../i18n/translations";
import { hashPassword } from "../utils/appLockCrypto";

interface SettingsViewProps {
  createRestorePoint: boolean;
  setCreateRestorePoint: (val: boolean) => void;
  enableParallaxStars: boolean;
  setEnableParallaxStars: (val: boolean) => void;
  minimizeToTray: boolean;
  setMinimizeToTray: (val: boolean) => void;
  appLockEnabled: boolean;
  setAppLockEnabled: (val: boolean) => void;
  onSetLockHash: (hash: string) => void;
  isAdmin?: boolean;
  osInfo?: string;
  onResetTweaks: () => void;
  onCheckForUpdates: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  createRestorePoint,
  setCreateRestorePoint,
  enableParallaxStars,
  setEnableParallaxStars,
  minimizeToTray,
  setMinimizeToTray,
  appLockEnabled,
  setAppLockEnabled,
  onSetLockHash,
  onResetTweaks,
  onCheckForUpdates,
}) => {
  const { language, setLanguage, t } = useTranslation();
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);

  const handlePromptSetPassword = async () => {
    const pwd = window.prompt("Enter a security password for 1boost:");
    if (!pwd || !pwd.trim()) return;

    const hash = await hashPassword(pwd.trim());
    onSetLockHash(hash);
    setAppLockEnabled(true);
    setPwdMsg("Security password set & app lock enabled!");
    setTimeout(() => setPwdMsg(null), 3000);
  };

  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        maxWidth: "680px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Title Banner */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>
          {t("settings_title")}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          {t("settings_subtitle")}
        </p>
      </div>

      {pwdMsg && (
        <div
          style={{
            backgroundColor: "var(--success-glow)",
            border: "1px solid var(--success-color)",
            color: "var(--success-color)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {pwdMsg}
        </div>
      )}

      {/* 1. LANGUAGE SELECTOR */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
            {t("app_language")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {t("app_language_desc")}
          </div>
        </div>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          style={{
            height: "36px",
            backgroundColor: "var(--surface-2)",
            border: "1px solid var(--outline-border)",
            borderRadius: "8px",
            padding: "0 12px",
            color: "var(--text-primary)",
            fontSize: "13px",
            fontWeight: 600,
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="en">English (EN)</option>
          <option value="pt-BR">Português (PT-BR)</option>
        </select>
      </div>

      {/* 2. APP LOCK WITH PASSWORD */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--accent-color)" }}>
                lock
              </span>
              <span>{t("app_lock")}</span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
              {t("app_lock_desc")}
            </div>
          </div>

          <label
            style={{
              position: "relative",
              display: "inline-block",
              width: "44px",
              height: "24px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={appLockEnabled}
              onChange={(e) => {
                if (e.target.checked) {
                  handlePromptSetPassword();
                } else {
                  setAppLockEnabled(false);
                }
              }}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: appLockEnabled ? "var(--accent-color)" : "var(--surface-2)",
                borderRadius: "24px",
                border: "1px solid var(--outline-border)",
                transition: "0.2s ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "18px",
                  width: "18px",
                  left: appLockEnabled ? "21px" : "2px",
                  bottom: "2px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "50%",
                  transition: "0.2s ease",
                }}
              />
            </span>
          </label>
        </div>

        {appLockEnabled && (
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "8px", borderTop: "1px solid var(--outline-border)" }}>
            <button className="btn-secondary" onClick={handlePromptSetPassword} style={{ height: "32px", fontSize: "12px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                key
              </span>
              <span>{t("btn_set_lock_password")}</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. AUTO-UPDATES & CHECK FOR UPDATES */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
            {t("check_for_updates")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {t("check_for_updates_desc")}
          </div>
        </div>

        <button className="btn-primary" onClick={onCheckForUpdates} style={{ height: "36px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            refresh
          </span>
          <span>{t("btn_check_updates")}</span>
        </button>
      </div>

      {/* 4. SYSTEM TRAY MINIMIZE */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
            {t("minimize_to_tray")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {t("minimize_to_tray_desc")}
          </div>
        </div>

        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "44px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={minimizeToTray}
            onChange={(e) => setMinimizeToTray(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: minimizeToTray ? "var(--accent-color)" : "var(--surface-2)",
              borderRadius: "24px",
              border: "1px solid var(--outline-border)",
              transition: "0.2s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                content: '""',
                height: "18px",
                width: "18px",
                left: minimizeToTray ? "21px" : "2px",
                bottom: "2px",
                backgroundColor: "#FFFFFF",
                borderRadius: "50%",
                transition: "0.2s ease",
              }}
            />
          </span>
        </label>
      </div>

      {/* 5. VISUAL EFFECTS */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
            {t("parallax_stars")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {t("parallax_stars_desc")}
          </div>
        </div>

        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "44px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={enableParallaxStars}
            onChange={(e) => setEnableParallaxStars(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: enableParallaxStars ? "var(--accent-color)" : "var(--surface-2)",
              borderRadius: "24px",
              border: "1px solid var(--outline-border)",
              transition: "0.2s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                content: '""',
                height: "18px",
                width: "18px",
                left: enableParallaxStars ? "21px" : "2px",
                bottom: "2px",
                backgroundColor: "#FFFFFF",
                borderRadius: "50%",
                transition: "0.2s ease",
              }}
            />
          </span>
        </label>
      </div>

      {/* 6. SYSTEM RESTORE POINT SAFETY */}
      <div
        style={{
          backgroundColor: "var(--surface-1)",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
            {t("auto_restore_point")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
            {t("auto_restore_point_desc")}
          </div>
        </div>

        <label
          style={{
            position: "relative",
            display: "inline-block",
            width: "44px",
            height: "24px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={createRestorePoint}
            onChange={(e) => setCreateRestorePoint(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: createRestorePoint ? "var(--accent-color)" : "var(--surface-2)",
              borderRadius: "24px",
              border: "1px solid var(--outline-border)",
              transition: "0.2s ease",
            }}
          >
            <span
              style={{
                position: "absolute",
                content: '""',
                height: "18px",
                width: "18px",
                left: createRestorePoint ? "21px" : "2px",
                bottom: "2px",
                backgroundColor: "#FFFFFF",
                borderRadius: "50%",
                transition: "0.2s ease",
              }}
            />
          </span>
        </label>
      </div>

      {/* 7. RESET TWEAKS TO DEFAULT */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
        <button className="btn-secondary" onClick={onResetTweaks}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
            restart_alt
          </span>
          <span>{t("reset_default")}</span>
        </button>
      </div>
    </div>
  );
};
