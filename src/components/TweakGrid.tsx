import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TweakStep } from "../types/tweak";
import { useTranslation } from "../i18n/useTranslation";
import { getAppliedTweaks, undoTweak, revertAllTweaks } from "../services/tweakEngine";
import { Tooltip } from "./GlobalTooltip";

interface TweakGridProps {
  tweaks: TweakStep[];
  onToggleTweak: (id: string) => void;
  onToggleCategory?: (category: TweakStep["category"]) => void;
  onImportProfile?: (tweakData: Record<string, boolean>) => void;
  isRunning: boolean;
}

export const TweakGrid: React.FC<TweakGridProps> = ({
  tweaks,
  onToggleTweak,
  onImportProfile,
  isRunning,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedTweaks, setAppliedTweaks] = useState<Map<string, { applied_at: string }>>(new Map());
  const [undoStatus, setUndoStatus] = useState<string | null>(null);
  const [undoBusy, setUndoBusy] = useState<string | null>(null);
  const { t, language } = useTranslation();

  // Refresh the list of applied (revertible) tweaks from the Rust engine
  const refreshApplied = useCallback(async () => {
    try {
      const list = await getAppliedTweaks();
      setAppliedTweaks(new Map(list.map((a) => [a.tweak_id, { applied_at: a.applied_at }])));
    } catch {
      setAppliedTweaks(new Map());
    }
  }, []);

  useEffect(() => {
    refreshApplied();
  }, [refreshApplied]);

  const handleUndoTweak = async (id: string) => {
    setUndoBusy(id);
    try {
      const msg = await undoTweak(id);
      setUndoStatus(msg);
      setTimeout(() => setUndoStatus(null), 3000);
    } catch (err: any) {
      setUndoStatus(err?.message || String(err));
      setTimeout(() => setUndoStatus(null), 4000);
    } finally {
      setUndoBusy(null);
      refreshApplied();
    }
  };

  const handleRevertAll = async () => {
    setUndoBusy("__all__");
    try {
      const count = await revertAllTweaks();
      setUndoStatus(count > 0 ? `${count} ${t("tweaks_reverted_toast")}` : t("no_revertible_tweaks"));
      setTimeout(() => setUndoStatus(null), 3500);
    } catch (err: any) {
      setUndoStatus(err?.message || String(err));
      setTimeout(() => setUndoStatus(null), 4000);
    } finally {
      setUndoBusy(null);
      refreshApplied();
    }
  };

  const handleExportProfile = () => {
    const data: Record<string, boolean> = {};
    tweaks.forEach((t) => {
      data[t.id] = t.enabled;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `1boost_profile_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setUndoStatus(t("profile_exported_toast"));
    setTimeout(() => setUndoStatus(null), 3000);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && typeof parsed === "object") {
          if (onImportProfile) {
            onImportProfile(parsed);
          }
          setUndoStatus(t("profile_imported_toast"));
          setTimeout(() => setUndoStatus(null), 3000);
        }
      } catch {
        setUndoStatus(t("invalid_json_profile"));
        setTimeout(() => setUndoStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const categories: { id: string; labelKey: keyof ReturnType<typeof useTranslation>["t"] extends string ? any : any }[] = [
    { id: "ALL", labelKey: "cat_all" },
    { id: "SAFETY", labelKey: "cat_safety" },
    { id: "TELEMETRY", labelKey: "cat_telemetry" },
    { id: "GAMING", labelKey: "cat_gaming" },
    { id: "POWER", labelKey: "cat_power" },
    { id: "DEBLOAT", labelKey: "cat_debloat" },
    { id: "CLEANUP", labelKey: "cat_cleanup" },
    { id: "PREFERENCES", labelKey: "cat_preferences" },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "SAFETY":
        return "shield";
      case "TELEMETRY":
        return "shield";
      case "GAMING":
        return "sports_esports";
      case "POWER":
        return "bolt";
      case "DEBLOAT":
        return "delete_sweep";
      case "CLEANUP":
        return "cleaning_services";
      case "PREFERENCES":
        return "palette";
      default:
        return "tune";
    }
  };

  // Advanced-tier tweaks require an explicit acknowledgement before enabling
  const handleToggle = (tweak: TweakStep) => {
    if (isRunning) return;
    if (!tweak.enabled && tweak.risk === "advanced") {
      if (!window.confirm(t("advanced_confirm"))) return;
    }
    onToggleTweak(tweak.id);
  };

  // Helper to dynamically fetch localized name & description
  const getLocalizedTweak = (tweak: TweakStep) => {
    if (language === "en") return { name: tweak.name, description: tweak.description };

    switch (tweak.id) {
      case "gaming_mouse_accel":
        return { name: t("tweak_mouse_accel_name"), description: t("tweak_mouse_accel_desc") };
      case "gaming_mouse_hover_time":
        return { name: t("tweak_mouse_hover_name"), description: t("tweak_mouse_hover_desc") };
      case "gaming_hags":
        return { name: t("tweak_hags_name"), description: t("tweak_hags_desc") };
      case "gaming_mmcss_priority":
        return { name: t("tweak_mmcss_name"), description: t("tweak_mmcss_desc") };
      case "gaming_gamedvr":
        return { name: t("tweak_gamedvr_name"), description: t("tweak_gamedvr_desc") };
      case "gaming_nagle":
        return { name: t("tweak_nagle_name"), description: t("tweak_nagle_desc") };
      case "network_delivery_opt":
        return { name: t("tweak_p2p_name"), description: t("tweak_p2p_desc") };
      case "power_ultimate":
        return { name: t("tweak_power_name"), description: t("tweak_power_desc") };
      case "power_core_parking":
        return { name: t("tweak_corepark_name"), description: t("tweak_corepark_desc") };
      case "cleanup_hibernate":
        return { name: t("tweak_hibernation_name"), description: t("tweak_hibernation_desc") };
      case "debloat_bg_apps":
        return { name: t("tweak_bgapps_name"), description: t("tweak_bgapps_desc") };
      case "telemetry_diagtrack":
        return { name: t("tweak_telemetry_name"), description: t("tweak_telemetry_desc") };
      case "telemetry_registry":
        return { name: t("tweak_diagkeys_name"), description: t("tweak_diagkeys_desc") };
      case "debloat_telemetry_tasks":
        return { name: t("tweak_teletasks_name"), description: t("tweak_teletasks_desc") };
      case "gaming_mode":
        return { name: t("tweak_gamemode_name"), description: t("tweak_gamemode_desc") };
      case "power_throttling":
        return { name: t("tweak_throttling_name"), description: t("tweak_throttling_desc") };
      case "debloat_bing_start":
        return { name: t("tweak_bing_name"), description: t("tweak_bing_desc") };
      case "debloat_widgets":
        return { name: t("tweak_widgets_name"), description: t("tweak_widgets_desc") };
      case "cleanup_temp_files":
        return { name: t("tweak_tempfiles_name"), description: t("tweak_tempfiles_desc") };
      case "cleanup_dns_flush":
        return { name: t("tweak_dnsflush_name"), description: t("tweak_dnsflush_desc") };
      case "telemetry_location":
        return { name: t("tweak_location_name"), description: t("tweak_location_desc") };
      case "telemetry_advertising_id":
        return { name: t("tweak_advertising_name"), description: t("tweak_advertising_desc") };
      case "telemetry_error_reporting":
        return { name: t("tweak_wer_name"), description: t("tweak_wer_desc") };
      case "debloat_cortana":
        return { name: t("tweak_cortana_name"), description: t("tweak_cortana_desc") };
      case "debloat_tips":
        return { name: t("tweak_tips_name"), description: t("tweak_tips_desc") };
      case "gaming_eee":
        return { name: t("tweak_eee_name"), description: t("tweak_eee_desc") };
      case "gaming_usb_selective_suspend":
        return { name: t("tweak_usb_name"), description: t("tweak_usb_desc") };
      case "power_large_system_cache":
        return { name: t("tweak_largecache_name"), description: t("tweak_largecache_desc") };
      case "security_wpbt":
        return { name: t("tweak_wpbt_name"), description: t("tweak_wpbt_desc") };
      case "privacy_device_metadata":
        return { name: t("tweak_devmeta_name"), description: t("tweak_devmeta_desc") };
      case "telemetry_activity_history":
        return { name: t("tweak_activity_name"), description: t("tweak_activity_desc") };
      case "telemetry_consumer_features":
        return { name: t("tweak_consumer_name"), description: t("tweak_consumer_desc") };
      case "debloat_end_task":
        return { name: t("tweak_endtask_name"), description: t("tweak_endtask_desc") };
      case "debloat_store_search":
        return { name: t("tweak_storesearch_name"), description: t("tweak_storesearch_desc") };
      case "debloat_notifications":
        return { name: t("tweak_notifications_name"), description: t("tweak_notifications_desc") };
      case "explorer_classic_context_menu":
        return { name: t("tweak_classicmenu_name"), description: t("tweak_classicmenu_desc") };
      case "explorer_home_gallery_remove":
        return { name: t("tweak_homegallery_name"), description: t("tweak_homegallery_desc") };
      case "debloat_edge_policies":
        return { name: t("tweak_edgedebloat_name"), description: t("tweak_edgedebloat_desc") };
      case "gaming_fso_disable":
        return { name: t("tweak_fso_name"), description: t("tweak_fso_desc") };
      case "network_ipv6_preferred":
        return { name: t("tweak_ipv4_name"), description: t("tweak_ipv4_desc") };
      case "network_teredo_off":
        return { name: t("tweak_teredo_name"), description: t("tweak_teredo_desc") };
      case "performance_services_manual":
        return { name: t("tweak_services_name"), description: t("tweak_services_desc") };
      case "performance_visual_effects":
        return { name: t("tweak_vfx_name"), description: t("tweak_vfx_desc") };
      case "performance_explorer_auto_discovery":
        return { name: t("tweak_folderdiscover_name"), description: t("tweak_folderdiscover_desc") };
      case "cleanup_storage_sense":
        return { name: t("tweak_storagesense_name"), description: t("tweak_storagesense_desc") };
      case "cleanup_component_store":
        return { name: t("tweak_dismclean_name"), description: t("tweak_dismclean_desc") };
      case "pref_dark_mode":
        return { name: t("tweak_darkmode_name"), description: t("tweak_darkmode_desc") };
      case "pref_show_extensions":
        return { name: t("tweak_extensions_name"), description: t("tweak_extensions_desc") };
      case "pref_hidden_files":
        return { name: t("tweak_hiddenfiles_name"), description: t("tweak_hiddenfiles_desc") };
      case "pref_battery_percent":
        return { name: t("tweak_battery_name"), description: t("tweak_battery_desc") };
      case "pref_verbose_logon":
        return { name: t("tweak_verboselogon_name"), description: t("tweak_verboselogon_desc") };
      case "pref_bsod_verbose":
        return { name: t("tweak_bsod_name"), description: t("tweak_bsod_desc") };
      case "debloat_onedrive":
        return { name: t("tweak_onedrive_name"), description: t("tweak_onedrive_desc") };
      default:
        return { name: tweak.name, description: tweak.description };
    }
  };

  // Fast client-side search across localized names, descriptions,
  // categories and ids. Memoized for instant filtering on every keystroke.
  const filteredTweaks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const base =
      selectedCategory === "ALL"
        ? tweaks
        : tweaks.filter((tweak) => tweak.category.toUpperCase() === selectedCategory);

    if (!query) return base;

    return base.filter((tweak) => {
      const localized = getLocalizedTweak(tweak);
      return (
        tweak.id.toLowerCase().includes(query) ||
        tweak.category.toLowerCase().includes(query) ||
        localized.name.toLowerCase().includes(query) ||
        localized.description.toLowerCase().includes(query)
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweaks, selectedCategory, searchQuery, language]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        padding: "0 24px 24px 24px",
      }}
    >
      {/* Category Pills Header & Cloud Save Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  height: "32px",
                  padding: "0 14px",
                  borderRadius: "16px",
                  border: `1px solid ${isActive ? "var(--accent-color)" : "var(--outline-border)"}`,
                  backgroundColor: isActive ? "var(--accent-glow)" : "var(--surface-2)",
                  color: isActive ? "var(--accent-color)" : "var(--text-secondary)",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.18s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                  {getCategoryIcon(cat.id)}
                </span>
                <span>{t(cat.labelKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Profile Export/Import & Revert All Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {appliedTweaks.size > 0 && (
            <Tooltip content={t("revert_all_tooltip")}>
              <button
                className="btn-secondary"
                style={{ height: "34px", fontSize: "12px", borderColor: "rgba(244, 67, 54, 0.4)", color: "#FF6B6B" }}
                onClick={handleRevertAll}
                disabled={undoBusy === "__all__"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
                  {undoBusy === "__all__" ? "sync" : "restart_alt"}
                </span>
                <span>{t("revert_all")}</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    backgroundColor: "var(--error-glow)",
                    color: "#FF6B6B",
                    borderRadius: "8px",
                    padding: "1px 6px",
                  }}
                >
                  {appliedTweaks.size}
                </span>
              </button>
            </Tooltip>
          )}

          {/* Export JSON Profile */}
          <button
            className="btn-secondary"
            onClick={handleExportProfile}
            style={{ height: "34px", fontSize: "12px" }}
            title={t("export_profile")}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
              file_download
            </span>
            <span>{t("export_profile")}</span>
          </button>

          {/* Import JSON Profile */}
          <label
            className="btn-secondary"
            style={{ height: "34px", fontSize: "12px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
            title={t("import_profile")}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleImportFileChange}
              style={{ display: "none" }}
            />
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
              file_upload
            </span>
            <span>{t("import_profile")}</span>
          </label>
        </div>
      </div>

      {/* Undo / revert status message */}
      {undoStatus && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            backgroundColor: undoStatus.toLowerCase().includes("reverted") || undoStatus.includes("tweak(s) reverted")
              ? "var(--success-glow)"
              : "var(--error-glow)",
            border: `1px solid ${undoStatus.toLowerCase().includes("reverted") || undoStatus.includes("tweak(s) reverted") ? "var(--success-color)" : "var(--error-color)"}`,
            color: undoStatus.toLowerCase().includes("reverted") || undoStatus.includes("tweak(s) reverted") ? "var(--success-color)" : "#FF6B6B",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
            {undoStatus.toLowerCase().includes("reverted") || undoStatus.includes("tweak(s) reverted") ? "check_circle" : "error"}
          </span>
          <span>{undoStatus}</span>
        </div>
      )}

      {/* Fast Tweak Search Bar */}
      <div style={{ position: "relative", marginBottom: "12px" }}>
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search_placeholder_tweaks")}
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
            transition: "border-color 0.18s ease",
          }}
        />
        {searchQuery && (
          <button
            className="icon-btn-containerless"
            style={{ position: "absolute", right: "2px", top: "1px", width: "34px", height: "34px" }}
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>
              close
            </span>
          </button>
        )}
      </div>

      {/* Tweaks Card Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "14px",
          alignContent: "start",
          paddingRight: "4px",
        }}
      >
        {filteredTweaks.map((tweak) => {
          const localized = getLocalizedTweak(tweak);

          return (
            <div
              key={tweak.id}
              onClick={() => handleToggle(tweak)}
              style={{
                backgroundColor: "var(--surface-1)",
                border: `1px solid ${tweak.enabled ? "var(--accent-color)" : "var(--outline-border)"}`,
                borderRadius: "10px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                cursor: isRunning ? "not-allowed" : "pointer",
                transition: "all 0.18s ease-in-out",
                opacity: isRunning ? 0.7 : 1,
                boxShadow: tweak.enabled ? "0 0 8px rgba(235, 93, 61, 0.08)" : "none",
              }}
            >
              {/* Card Header: Icon, Category Badge & MD3 Switch */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "20px",
                      color: tweak.enabled ? "var(--accent-color)" : "var(--text-muted)",
                    }}
                  >
                    {getCategoryIcon(tweak.category)}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "6px",
                      backgroundColor: "var(--surface-2)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--outline-border)",
                    }}
                  >
                    {tweak.category}
                  </span>

                  {/* Advanced risk tier badge */}
                  {tweak.risk === "advanced" && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "3px",
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: "0.4px",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        backgroundColor: "var(--warning-glow)",
                        color: "var(--warning-color)",
                        border: "1px solid rgba(255, 193, 7, 0.35)",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>
                        warning
                      </span>
                      {t("advanced_badge")}
                    </span>
                  )}

                  {/* Applied + Undo chip (reversible engine) */}
                  {appliedTweaks.has(tweak.id) && (
                    <Tooltip content={t("undo_tweak_tooltip")}>
                      <button
                        className="icon-btn-containerless"
                        style={{ width: "26px", height: "26px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUndoTweak(tweak.id);
                        }}
                        disabled={undoBusy === tweak.id}
                        aria-label={t("undo_tweak")}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{
                            fontSize: "15px",
                            color: undoBusy === tweak.id ? "var(--text-muted)" : "var(--success-color)",
                          }}
                        >
                          {undoBusy === tweak.id ? "sync" : "restart_alt"}
                        </span>
                      </button>
                    </Tooltip>
                  )}
                </div>

                {/* MD3 Switch Switcher */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                  <label
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "40px",
                      height: "22px",
                      cursor: isRunning ? "not-allowed" : "pointer",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={tweak.enabled}
                      onChange={() => handleToggle(tweak)}
                      disabled={isRunning}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: tweak.enabled ? "var(--accent-color)" : "var(--surface-2)",
                        borderRadius: "22px",
                        border: "1px solid var(--outline-border)",
                        transition: "0.2s ease",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          content: '""',
                          height: "16px",
                          width: "16px",
                          left: tweak.enabled ? "19px" : "2px",
                          bottom: "2px",
                          backgroundColor: "#FFFFFF",
                          borderRadius: "50%",
                          transition: "0.2s ease",
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: "4px",
                    lineHeight: "1.3",
                  }}
                >
                  {localized.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                  {localized.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* No results state for search / filters */}
        {filteredTweaks.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--outline-border)",
              borderRadius: "10px",
              padding: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "var(--text-muted)", marginBottom: "8px" }}>
              search_off
            </span>
            <p style={{ fontSize: "14px", fontWeight: 600 }}>
              {t("search_no_results").replace("{query}", searchQuery)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
