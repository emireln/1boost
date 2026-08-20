import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "../i18n/useTranslation";
import { APP_LOGO_URL, CURATED_APPS } from "../constants/utilities";
import {
  DnsPreset,
  enableWindowsFeature,
  getCurrentDns,
  getDnsPresets,
  runSystemFix,
  runWinget,
  setDnsProvider,
  setUpdateMode,
  SystemFixId,
  UpdateMode,
} from "../services/utilities";
import { Tooltip } from "./GlobalTooltip";

type UtilSubTab = "dns" | "updates" | "fixes" | "features" | "apps";

interface StatusMsg {
  text: string;
  error: boolean;
}

/**
 * App brand icon with graceful degradation:
 * - image error -> generic letter avatar
 * - loaded -> official favicon logo on white backing for visibility
 */
const AppLogo: React.FC<{ domain: string; name: string }> = ({ domain, name }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [domain]);

  const showImage = !failed;

  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "8px",
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--outline-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {(!showImage || !loaded) && (
        <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--accent-color)" }}>
          {name[0]?.toUpperCase() || "?"}
        </span>
      )}
      {showImage && (
        <img
          src={APP_LOGO_URL(domain)}
          alt=""
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "3px",
            backgroundColor: "#FFFFFF",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        />
      )}
    </div>
  );
};

export const UtilitiesTab: React.FC = () => {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState<UtilSubTab>("dns");
  const [statusMsg, setStatusMsg] = useState<StatusMsg | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // DNS state
  const [dnsPresets, setDnsPresets] = useState<DnsPreset[]>([]);
  const [currentDns, setCurrentDns] = useState("");

  // Apps state
  const [appQuery, setAppQuery] = useState("");
  const [wingetOutput, setWingetOutput] = useState<string | null>(null);

  const refreshDns = async () => {
    const [presets, current] = await Promise.all([getDnsPresets(), getCurrentDns()]);
    setDnsPresets(presets);
    setCurrentDns(current.trim());
  };

  useEffect(() => {
    refreshDns();
  }, []);

  const run = async (key: string, fn: () => Promise<string>) => {
    setBusy(key);
    setStatusMsg(null);
    try {
      const res = await fn();
      setStatusMsg({ text: res, error: false });
      refreshDns();
    } catch (err: any) {
      setStatusMsg({ text: err?.message || String(err), error: true });
    } finally {
      setBusy(null);
    }
  };

  const activePresetKey = useMemo(() => {
    const first = currentDns.split(",")[0];
    if (!first) return "";
    return dnsPresets.find((p) => p.ipv4_primary === first)?.key || "";
  }, [currentDns, dnsPresets]);

  const handleUpdateMode = async (mode: UpdateMode) => {
    if (mode === "disable" && !window.confirm(t("util_confirm_disable_updates"))) return;
    await run(`update_${mode}`, () => setUpdateMode(mode));
  };

  const handleFix = async (fixId: SystemFixId) => {
    await run(`fix_${fixId}`, () => runSystemFix(fixId));
  };

  const handleFeature = async (featureId: string, enable: boolean) => {
    await run(`feature_${featureId}_${enable}`, () => enableWindowsFeature(featureId as any, enable));
  };

  const handleWingetSearch = async () => {
    const q = appQuery.trim();
    if (!q) return;
    setBusy("search");
    try {
      const out = await runWinget("search", q);
      setWingetOutput(out);
    } catch (err: any) {
      setWingetOutput(err?.message || String(err));
    } finally {
      setBusy(null);
    }
  };

  const handleAppAction = async (action: "install" | "uninstall", id: string) => {
    await run(`app_${action}_${id}`, () => runWinget(action, id));
  };

  const subTabs: { id: UtilSubTab; icon: string; label: string }[] = [
    { id: "dns", icon: "dns", label: t("util_dns") },
    { id: "updates", icon: "system_update", label: t("util_updates") },
    { id: "fixes", icon: "build", label: t("util_fixes") },
    { id: "features", icon: "widgets", label: t("util_features") },
    { id: "apps", icon: "apps", label: t("util_apps") },
  ];

  const fixes: { id: SystemFixId; icon: string; name: string; desc: string }[] = [
    { id: "network_reset", icon: "settings_ethernet", name: t("fix_network_reset"), desc: t("fix_network_reset_desc") },
    { id: "wu_reset", icon: "system_update", name: t("fix_wu_reset"), desc: t("fix_wu_reset_desc") },
    { id: "dism_scan", icon: "healing", name: t("fix_dism_scan"), desc: t("fix_dism_scan_desc") },
    { id: "ntp_pool", icon: "schedule", name: t("fix_ntp"), desc: t("fix_ntp_desc") },
    { id: "explorer_restart", icon: "folder", name: t("fix_explorer"), desc: t("fix_explorer_desc") },
    { id: "icon_cache", icon: "refresh", name: t("fix_icon_cache"), desc: t("fix_icon_cache_desc") },
  ];

  const features: { id: string; icon: string; name: string }[] = [
    { id: "dotnet", icon: "data_object", name: t("feature_dotnet") },
    { id: "wsl", icon: "terminal", name: t("feature_wsl") },
    { id: "hyperv", icon: "memory", name: t("feature_hyperv") },
    { id: "legacy_media", icon: "movie", name: t("feature_legacy_media") },
    { id: "sandbox", icon: "sandbox", name: t("feature_sandbox") },
    { id: "nfs", icon: "folder_shared", name: t("feature_nfs") },
    { id: "regbackup", icon: "backup", name: t("feature_regbackup") },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--surface-1)",
    border: "1px solid var(--outline-border)",
    borderRadius: "10px",
    padding: "16px",
  };

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "900px",
        margin: "0 auto",
        width: "100%",
        padding: "0 24px 24px 24px",
      }}
    >
      {/* Header */}
      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
          {t("util_title")}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
          {t("util_subtitle")}
        </p>
      </div>

      {/* Status message */}
      {statusMsg && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: statusMsg.error ? "var(--error-glow)" : "var(--success-glow)",
            border: `1px solid ${statusMsg.error ? "var(--error-color)" : "var(--success-color)"}`,
            color: statusMsg.error ? "#FF6B6B" : "var(--success-color)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {statusMsg.error ? "error" : "check_circle"}
          </span>
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Sub-tab switcher */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {subTabs.map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                height: "34px",
                padding: "0 16px",
                borderRadius: "17px",
                border: `1px solid ${isActive ? "var(--accent-color)" : "var(--outline-border)"}`,
                backgroundColor: isActive ? "var(--accent-glow)" : "var(--surface-2)",
                color: isActive ? "var(--accent-color)" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============ DNS VIEW ============ */}
      {subTab === "dns" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--accent-color)" }}>
                dns
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {t("dns_current")}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "Consolas, monospace" }}>
                  {currentDns || "—"}
                </div>
              </div>
            </div>
            <button
              className="btn-secondary"
              style={{ height: "34px", fontSize: "12px", flexShrink: 0 }}
              onClick={refreshDns}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>refresh</span>
              <span>{t("dns_refresh")}</span>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "12px",
            }}
          >
            {dnsPresets.map((preset) => {
              const isActive = activePresetKey === preset.key;
              return (
                <div
                  key={preset.key}
                  style={{
                    ...cardStyle,
                    border: `1px solid ${isActive ? "var(--accent-color)" : "var(--outline-border)"}`,
                    backgroundColor: isActive ? "var(--accent-glow)" : "var(--surface-1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {preset.label}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: "0.4px",
                          padding: "2px 7px",
                          borderRadius: "8px",
                          backgroundColor: "var(--accent-color)",
                          color: "#FFFFFF",
                        }}
                      >
                        {t("dns_active")}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "Consolas, monospace" }}>
                    {preset.ipv4_primary || "DHCP"}
                    {preset.ipv4_secondary ? ` / ${preset.ipv4_secondary}` : ""}
                  </div>
                  <button
                    className={isActive ? "btn-secondary" : "btn-primary"}
                    style={{ height: "32px", fontSize: "11px" }}
                    disabled={busy === `dns_${preset.key}` || isActive}
                    onClick={() => run(`dns_${preset.key}`, () => setDnsProvider(preset.key))}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                      {busy === `dns_${preset.key}` ? "sync" : "wifi_tethering"}
                    </span>
                    <span>{t("dns_apply")}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============ UPDATES VIEW ============ */}
      {subTab === "updates" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          {(
            [
              { mode: "default" as UpdateMode, icon: "restore", name: t("update_default"), desc: t("update_default_desc") },
              { mode: "security" as UpdateMode, icon: "security", name: t("update_security"), desc: t("update_security_desc") },
              { mode: "disable" as UpdateMode, icon: "block", name: t("update_disable"), desc: t("update_disable_desc") },
            ]
          ).map((item) => (
            <div key={item.mode} style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "10px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "26px", color: item.mode === "disable" ? "#FF6B6B" : "var(--accent-color)" }}>
                {item.icon}
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{item.name}</div>
                <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.45", marginTop: "2px" }}>
                  {item.desc}
                </div>
              </div>
              <button
                className={item.mode === "disable" ? "btn-secondary" : "btn-primary"}
                style={{
                  height: "34px",
                  fontSize: "12px",
                  ...(item.mode === "disable" ? { borderColor: "rgba(244, 67, 54, 0.4)", color: "#FF6B6B" } : {}),
                }}
                disabled={busy === `update_${item.mode}`}
                onClick={() => handleUpdateMode(item.mode)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  {busy === `update_${item.mode}` ? "sync" : "play_arrow"}
                </span>
                <span>{t("update_apply")}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ============ FIXES VIEW ============ */}
      {subTab === "fixes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {fixes.map((fix) => (
            <div key={fix.id} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "var(--accent-color)", flexShrink: 0 }}>
                  {fix.icon}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{fix.name}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{fix.desc}</div>
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ height: "34px", fontSize: "12px", flexShrink: 0 }}
                disabled={busy === `fix_${fix.id}`}
                onClick={() => handleFix(fix.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  {busy === `fix_${fix.id}` ? "sync" : "play_arrow"}
                </span>
                <span>{busy === `fix_${fix.id}` ? t("fix_running") : t("fix_run")}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ============ FEATURES VIEW ============ */}
      {subTab === "features" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "var(--warning-glow)",
              border: "1px solid rgba(255, 193, 7, 0.35)",
              color: "var(--warning-color)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>info</span>
            <span>{t("feature_reboot_notice")}</span>
          </div>

          {features.map((feat) => {
            const isBusy = busy === `feature_${feat.id}_true` || busy === `feature_${feat.id}_false`;
            return (
              <div key={feat.id} style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px", color: "var(--accent-color)", flexShrink: 0 }}>
                    {feat.icon}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{feat.name}</span>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button
                    className="btn-primary"
                    style={{ height: "32px", fontSize: "11px" }}
                    disabled={isBusy}
                    onClick={() => handleFeature(feat.id, true)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                      {busy === `feature_${feat.id}_true` ? "sync" : "check"}
                    </span>
                    <span>{t("feature_enable")}</span>
                  </button>
                  {feat.id !== "dotnet" && (
                    <button
                      className="btn-secondary"
                      style={{ height: "32px", fontSize: "11px" }}
                      disabled={isBusy}
                      onClick={() => handleFeature(feat.id, false)}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                        {busy === `feature_${feat.id}_false` ? "sync" : "close"}
                      </span>
                      <span>{t("feature_disable")}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============ APPS VIEW (WinGet) ============ */}
      {subTab === "apps" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Search + upgrade all */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
              <span
                className="material-symbols-outlined"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "17px",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              >
                search
              </span>
              <input
                type="text"
                value={appQuery}
                onChange={(e) => setAppQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleWingetSearch()}
                placeholder={t("apps_search_placeholder")}
                style={{
                  width: "100%",
                  height: "38px",
                  backgroundColor: "var(--surface-2)",
                  border: "1px solid var(--outline-border)",
                  borderRadius: "8px",
                  padding: "0 12px 0 38px",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
            <button className="btn-secondary" style={{ height: "38px" }} onClick={handleWingetSearch} disabled={busy === "search"}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                {busy === "search" ? "sync" : "search"}
              </span>
              <span>{t("apps_search_btn")}</span>
            </button>
            <Tooltip content={t("apps_upgrade_all_tooltip")}>
              <button
                className="btn-primary"
                style={{ height: "38px" }}
                disabled={busy === "upgrade_all"}
                onClick={() => run("upgrade_all", () => runWinget("upgrade_all"))}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  {busy === "upgrade_all" ? "sync" : "system_update"}
                </span>
                <span>{t("apps_upgrade_all")}</span>
              </button>
            </Tooltip>
          </div>

          {/* Winget output */}
          {wingetOutput && (
            <pre
              style={{
                backgroundColor: "#0D0D0D",
                border: "1px solid var(--outline-border)",
                borderRadius: "10px",
                padding: "14px",
                fontSize: "11px",
                lineHeight: "1.5",
                fontFamily: "Consolas, monospace",
                color: "var(--text-secondary)",
                maxHeight: "220px",
                overflowY: "auto",
                userSelect: "text",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {wingetOutput}
            </pre>
          )}

          {/* Curated apps grid */}
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "10px" }}>
              {t("apps_curated")} ({CURATED_APPS.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px" }}>
              {CURATED_APPS.map((app) => (
                <div
                  key={app.id}
                  style={{
                    ...cardStyle,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                    <AppLogo domain={app.domain} name={app.name} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {app.name}
                      </div>
                      <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{app.category}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <Tooltip content={t("apps_install")}>
                      <button
                        className="icon-btn-containerless"
                        style={{ width: "30px", height: "30px" }}
                        disabled={busy === `app_install_${app.id}`}
                        onClick={() => handleAppAction("install", app.id)}
                        aria-label={t("apps_install")}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "17px", color: busy === `app_install_${app.id}` ? "var(--text-muted)" : "var(--success-color)" }}>
                          {busy === `app_install_${app.id}` ? "sync" : "download"}
                        </span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
