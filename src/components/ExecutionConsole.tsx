import React, { useMemo, useState } from "react";
import { TweakLogPayload } from "../types/tweak";
import { Tooltip } from "./GlobalTooltip";
import { useTranslation } from "../i18n/useTranslation";

interface ExecutionConsoleProps {
  logs: TweakLogPayload[];
  onClearLogs: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs, onClearLogs }) => {
  const [filterLevel, setFilterLevel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  // Fast combined filter: level + free-text search across log messages
  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const levelOk =
        filterLevel === "ALL" || log.level.toLowerCase() === filterLevel.toLowerCase();
      if (!levelOk) return false;
      if (!query) return true;
      return (
        log.message.toLowerCase().includes(query) ||
        log.step_id.toLowerCase().includes(query) ||
        log.timestamp.toLowerCase().includes(query)
      );
    });
  }, [logs, filterLevel, searchQuery]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "success":
        return "var(--success-color)";
      case "warning":
        return "var(--warning-color)";
      case "error":
        return "#FF6B6B";
      default:
        return "var(--text-secondary)";
    }
  };

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
      {/* Console Top Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="material-symbols-outlined" style={{ color: "var(--accent-color)" }}>
            terminal
          </span>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t("console_title")}
            </h2>
            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              {t("console_subtitle")}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Log Search Input */}
          <div style={{ position: "relative", width: "220px" }}>
            <span
              className="material-symbols-outlined"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
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
              placeholder={t("search_placeholder_console")}
              style={{
                width: "100%",
                height: "34px",
                backgroundColor: "var(--surface-2)",
                border: "1px solid var(--outline-border)",
                borderRadius: "8px",
                padding: "0 10px 0 34px",
                color: "var(--text-primary)",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>

          {/* Level Filter Buttons */}
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--surface-2)",
              borderRadius: "16px",
              padding: "2px",
              border: "1px solid var(--outline-border)",
            }}
          >
            {["ALL", "INFO", "SUCCESS", "ERROR"].map((lvl) => {
              const isActive = filterLevel === lvl;
              const labelMap: Record<string, string> = {
                ALL: t("filter_all"),
                INFO: t("filter_info"),
                SUCCESS: t("filter_success"),
                ERROR: t("filter_error"),
              };

              return (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  style={{
                    height: "28px",
                    padding: "0 10px",
                    borderRadius: "14px",
                    border: "none",
                    backgroundColor: isActive ? "var(--accent-glow)" : "transparent",
                    color: isActive ? "var(--accent-color)" : "var(--text-muted)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {labelMap[lvl]}
                </button>
              );
            })}
          </div>

          <Tooltip content={t("clear_logs")}>
            <button className="btn-secondary" onClick={onClearLogs} style={{ height: "32px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                delete_sweep
              </span>
              <span>{t("clear_logs")}</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Console Log Terminal Window */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#0D0D0D",
          border: "1px solid var(--outline-border)",
          borderRadius: "10px",
          padding: "16px",
          fontFamily: "'Consolas', 'Courier New', monospace",
          fontSize: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {filteredLogs.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic", padding: "12px" }}>
            {logs.length === 0
              ? t("console_empty_logs")
              : `[1boost Console] ${t("search_no_results").replace("{query}", searchQuery || filterLevel)}`}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                lineHeight: "1.4",
              }}
            >
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>[{log.timestamp}]</span>

              <span
                style={{
                  color: getLevelColor(log.level),
                  fontWeight: 700,
                  textTransform: "uppercase",
                  flexShrink: 0,
                  width: "70px",
                }}
              >
                [{log.level}]
              </span>

              <span style={{ color: "var(--text-primary)", wordBreak: "break-word" }}>
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
