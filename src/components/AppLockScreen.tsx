import React, { useState } from "react";
import { verifyPassword } from "../utils/appLockCrypto";
import { LogoBanner } from "./LogoBanner";
import { useTranslation } from "../i18n/useTranslation";

interface AppLockScreenProps {
  storedHash: string;
  onUnlock: () => void;
}

export const AppLockScreen: React.FC<AppLockScreenProps> = ({ storedHash, onUnlock }) => {
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { t } = useTranslation();

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || isVerifying) return;

    setIsVerifying(true);
    setError(false);

    try {
      const isValid = await verifyPassword(passwordInput, storedHash);
      if (isValid) {
        onUnlock();
      } else {
        setError(true);
        setPasswordInput("");
      }
    } catch {
      setError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999999,
        padding: "24px",
        boxSizing: "border-box",
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "28px",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        {/* Banner */}
        <LogoBanner height={72} />

        {/* Lock Security Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            backgroundColor: "var(--accent-glow)",
            border: "1px solid rgba(235, 93, 61, 0.3)",
            color: "var(--accent-color)",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            lock
          </span>
          <span>{t("app_lock_protected")}</span>
        </div>

        {/* Unlock Form */}
        <form
          onSubmit={handleUnlockSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                autoFocus
                required
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setError(false);
                }}
                placeholder={t("app_lock_placeholder")}
                style={{
                  width: "100%",
                  height: "42px",
                  backgroundColor: "var(--surface-2)",
                  border: `1px solid ${error ? "#FF6B6B" : "var(--outline-border)"}`,
                  borderRadius: "10px",
                  padding: "0 44px 0 14px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="button"
                className="icon-btn-containerless"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "6px",
                  width: "32px",
                  height: "32px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>

            {error && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#FF6B6B",
                  marginTop: "6px",
                  fontWeight: 600,
                }}
              >
                {t("app_lock_incorrect")}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!passwordInput.trim() || isVerifying}
            style={{
              width: "100%",
              height: "40px",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              key
            </span>
            <span>{isVerifying ? t("app_lock_verifying") : t("app_lock_unlock")}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
