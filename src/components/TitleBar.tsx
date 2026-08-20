import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Tooltip } from "./GlobalTooltip";
import { AppLogoIcon } from "./AppLogoIcon";
import { useTranslation } from "../i18n/useTranslation";
import { Translations } from "../i18n/translations";

export type ViewTab = "dashboard" | "grid" | "utilities" | "logs" | "settings";

interface TitleBarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  isAdmin: boolean;
  osInfo: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  activeTab,
  onTabChange,
  isAdmin,
  osInfo,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const appWindow = getCurrentWindow();
        setIsMaximized(await appWindow.isMaximized());
      } catch (e) {
        // Fallback for browser dev mode
      }
    };
    checkMaximized();
  }, []);

  const handleMinimize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await invoke("minimize_window");
    } catch {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.minimize();
      } catch (err) {
        console.log("Minimize failed", err);
      }
    }
  };

  const handleToggleMaximize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await invoke("toggle_maximize_window");
      setIsMaximized(!isMaximized);
    } catch {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.toggleMaximize();
        setIsMaximized(await appWindow.isMaximized());
      } catch (err) {
        console.log("Maximize failed", err);
      }
    }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await invoke("close_window");
    } catch {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.close();
      } catch (err) {
        console.log("Close failed", err);
      }
    }
  };

  const navItems: { id: ViewTab; icon: string; labelKey: keyof Translations }[] = [
    { id: "dashboard", icon: "rocket_launch", labelKey: "nav_boost" },
    { id: "grid", icon: "tune", labelKey: "nav_tweaks" },
    { id: "utilities", icon: "handyman", labelKey: "nav_utilities" },
    { id: "logs", icon: "terminal", labelKey: "nav_logs" },
    { id: "settings", icon: "settings", labelKey: "nav_settings" },
  ];

  return (
    <div
      data-tauri-drag-region
      style={{
        height: "44px",
        backgroundColor: "var(--surface-1)",
        borderBottom: "1px solid var(--outline-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px 0 14px",
        userSelect: "none",
        WebkitAppRegion: "drag",
        position: "relative",
        zIndex: 100,
      } as React.CSSProperties}
    >
      {/* Left: App Branding (Clickable Logo Redirection to Dashboard without Tooltip) & Admin Status */}
      <div
        data-tauri-drag-region
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          WebkitAppRegion: "no-drag",
        } as React.CSSProperties}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onTabChange("dashboard");
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.15s ease",
          }}
          className="logo-clickable-btn"
        >
          <AppLogoIcon size={24} />
        </div>

        {/* Admin Badge */}
        <Tooltip content={isAdmin ? `Elevated Rights Active (${osInfo})` : "Standard User Mode"}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "8px",
              backgroundColor: isAdmin ? "var(--accent-glow)" : "rgba(255, 255, 255, 0.06)",
              color: isAdmin ? "var(--accent-color)" : "var(--text-muted)",
              border: `1px solid ${isAdmin ? "rgba(235, 93, 61, 0.3)" : "var(--outline-border)"}`,
              display: "inline-flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
              {isAdmin ? "verified_user" : "shield"}
            </span>
            {isAdmin ? t("admin_active") : t("admin_user")}
          </span>
        </Tooltip>
      </div>

      {/* Right Group: Containerless Submenu Buttons + Caption Buttons */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          WebkitAppRegion: "no-drag",
        } as React.CSSProperties}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Navigation Submenu Icons (Containerless, matching Caption Hover) */}
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const labelText = t(item.labelKey);
          return (
            <Tooltip key={item.id} content={labelText}>
              <button
                className={`icon-btn-containerless ${isActive ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange(item.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  WebkitAppRegion: "no-drag",
                } as React.CSSProperties}
                aria-label={labelText}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "19px" }}>
                  {item.icon}
                </span>
              </button>
            </Tooltip>
          );
        })}

        {/* Vertical Divider */}
        <div style={{ height: "16px", width: "1px", backgroundColor: "var(--outline-border)", margin: "0 4px" }} />

        {/* Window Caption Control Buttons (Minimize, Maximize, Close) */}
        <Tooltip content={t("minimize")}>
          <button
            className="icon-btn-containerless"
            onClick={handleMinimize}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            aria-label="Minimize"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
        </Tooltip>

        <Tooltip content={isMaximized ? "Restore" : t("maximize")}>
          <button
            className="icon-btn-containerless"
            onClick={handleToggleMaximize}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            aria-label="Maximize"
          >
            <span className="material-symbols-outlined">
              {isMaximized ? "filter_none" : "crop_square"}
            </span>
          </button>
        </Tooltip>

        <Tooltip content={t("close")}>
          <button
            className="icon-btn-containerless danger"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
