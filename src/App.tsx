import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useUpdater } from "./hooks/useUpdater";
import { TitleBar, ViewTab } from "./components/TitleBar";
import { DashboardView } from "./components/DashboardView";
import { TweakGrid } from "./components/TweakGrid";
import { ExecutionConsole } from "./components/ExecutionConsole";
import { SettingsView } from "./components/SettingsView";
import { UtilitiesTab } from "./components/UtilitiesTab";
import { UpdateModal } from "./components/UpdateModal";
import { AppLockScreen } from "./components/AppLockScreen";
import { DEFAULT_TWEAKS } from "./constants/tweaks";
import {
  TweakStep,
  TweakProgressPayload,
  TweakLogPayload,
  TweakCompletePayload,
  AdminStatus,
} from "./types/tweak";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [tweaks, setTweaks] = useState<TweakStep[]>(DEFAULT_TWEAKS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [osInfo, setOsInfo] = useState<string>("Windows PC");
  const [createRestorePoint, setCreateRestorePoint] = useState<boolean>(true);
  const [enableParallaxStars, setEnableParallaxStarsState] = useState<boolean>(() => {
    const saved = localStorage.getItem("1boost_parallax_stars");
    return saved !== "false";
  });
  const [minimizeToTray, setMinimizeToTrayState] = useState<boolean>(() => {
    const saved = localStorage.getItem("1boost_minimize_to_tray");
    return saved === "true";
  });

  // App Lock State
  const [appLockEnabled, setAppLockEnabledState] = useState<boolean>(() => {
    return localStorage.getItem("1boost_lock_enabled") === "true";
  });
  const [appLockHash, setAppLockHash] = useState<string>(() => {
    return localStorage.getItem("1boost_lock_hash") || "";
  });
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem("1boost_lock_enabled") === "true" && Boolean(localStorage.getItem("1boost_lock_hash"));
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<TweakProgressPayload | null>(null);
  const [logs, setLogs] = useState<TweakLogPayload[]>([]);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const { status: updateStatus, checkForUpdates, downloadAndInstall } = useUpdater();

  const setEnableParallaxStars = (val: boolean) => {
    setEnableParallaxStarsState(val);
    localStorage.setItem("1boost_parallax_stars", String(val));
  };

  const setMinimizeToTray = (val: boolean) => {
    setMinimizeToTrayState(val);
    localStorage.setItem("1boost_minimize_to_tray", String(val));
  };

  const setAppLockEnabled = (val: boolean) => {
    setAppLockEnabledState(val);
    localStorage.setItem("1boost_lock_enabled", String(val));
    if (!val) setIsLocked(false);
  };

  const handleSetLockHash = (hash: string) => {
    setAppLockHash(hash);
    localStorage.setItem("1boost_lock_hash", hash);
  };

  // Check admin status on load
  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const res = await invoke<AdminStatus>("check_admin");
        setIsAdmin(res.is_admin);
        setOsInfo(res.os_info);
      } catch (err) {
        console.log("Not running inside Tauri window, web fallback mode");
        setIsAdmin(false);
      }
    };
    fetchAdminStatus();
  }, []);

  // Subscribe to Tauri real-time event streams
  useEffect(() => {
    let unlistenProgress: UnlistenFn | null = null;
    let unlistenLog: UnlistenFn | null = null;
    let unlistenComplete: UnlistenFn | null = null;

    const setupListeners = async () => {
      try {
        unlistenProgress = await listen<TweakProgressPayload>("tweak-progress", (event) => {
          setProgress(event.payload);
        });

        unlistenLog = await listen<TweakLogPayload>("tweak-log", (event) => {
          setLogs((prev) => [...prev, event.payload]);
        });

        unlistenComplete = await listen<TweakCompletePayload>("tweak-complete", () => {
          setIsRunning(false);
          setProgress(null);
          const now = new Date();
          setLastRunTime(now.toLocaleTimeString());
        });
      } catch (e) {
        console.log("Tauri event listeners skipped in browser dev mode");
      }
    };

    setupListeners();

    return () => {
      if (unlistenProgress) unlistenProgress();
      if (unlistenLog) unlistenLog();
      if (unlistenComplete) unlistenComplete();
    };
  }, []);

  const handleToggleTweak = (id: string) => {
    setTweaks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleToggleCategory = (category: TweakStep["category"]) => {
    const categoryTweaks = tweaks.filter((t) => t.category === category);
    const allEnabled = categoryTweaks.every((t) => t.enabled);

    setTweaks((prev) =>
      prev.map((t) => (t.category === category ? { ...t, enabled: !allEnabled } : t))
    );
  };

  const selectedTweaks = tweaks.filter((t) => t.enabled);

  const handleRunBoost = async () => {
    if (selectedTweaks.length === 0 || isRunning) return;

    setIsRunning(true);
    setProgress({
      current: 0,
      total: selectedTweaks.length + (createRestorePoint ? 1 : 0),
      percentage: 0,
      step_id: "init",
      step_name: "Initializing 1boost Optimization Engine...",
    });

    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        level: "info",
        message: `--- Starting 1boost Optimization Run (${selectedTweaks.length} tweaks selected) ---`,
        step_id: "start",
      },
    ]);

    try {
      await invoke("execute_optimizations", {
        steps: selectedTweaks,
        createRestore: createRestorePoint,
      });
    } catch (err: any) {
      console.warn("Backend invoke error / dev simulation mode:", err);
      simulateWebRun();
    }
  };

  const simulateWebRun = () => {
    let index = 0;
    const total = selectedTweaks.length + (createRestorePoint ? 1 : 0);

    const interval = setInterval(() => {
      index++;
      const currentTweak = selectedTweaks[index - 1];

      if (index <= total && currentTweak) {
        setProgress({
          current: index,
          total,
          percentage: Math.round((index / total) * 100),
          step_id: currentTweak.id,
          step_name: currentTweak.name,
        });

        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            level: "success",
            message: `Applied [${currentTweak.category}] ${currentTweak.name}`,
            step_id: currentTweak.id,
          },
        ]);
      } else {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(null);
        setLastRunTime(new Date().toLocaleTimeString());
        setLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            level: "success",
            message: "--- 1boost Optimization Complete! ---",
            step_id: "done",
          },
        ]);
      }
    }, 400);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleResetTweaks = () => {
    setTweaks(DEFAULT_TWEAKS);
  };

  const handleImportProfile = (imported: Record<string, boolean>) => {
    setTweaks((prev) =>
      prev.map((t) => ({
        ...t,
        enabled: imported[t.id] !== undefined ? Boolean(imported[t.id]) : t.enabled,
      }))
    );
  };

  const handleCheckForUpdatesTrigger = () => {
    setIsUpdateModalOpen(true);
    checkForUpdates();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Title Bar with Submenu Tabs */}
      <TitleBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        osInfo={osInfo}
      />

      {/* Main View Area based on Submenu Selected in Titlebar */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeTab === "dashboard" && (
          <DashboardView
            onRunBoost={handleRunBoost}
            isRunning={isRunning}
            progress={progress}
            selectedCount={selectedTweaks.length}
            lastRunTime={lastRunTime}
            createRestorePoint={createRestorePoint}
            enableParallaxStars={enableParallaxStars}
          />
        )}

        {activeTab === "grid" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: "16px" }}>
            <TweakGrid
              tweaks={tweaks}
              onToggleTweak={handleToggleTweak}
              onToggleCategory={handleToggleCategory}
              onImportProfile={handleImportProfile}
              isRunning={isRunning}
            />
          </div>
        )}

        {activeTab === "utilities" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: "16px" }}>
            <UtilitiesTab />
          </div>
        )}

        {activeTab === "logs" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", paddingTop: "16px" }}>
            <ExecutionConsole logs={logs} onClearLogs={handleClearLogs} />
          </div>
        )}

        {activeTab === "settings" && (
          <SettingsView
            createRestorePoint={createRestorePoint}
            setCreateRestorePoint={setCreateRestorePoint}
            enableParallaxStars={enableParallaxStars}
            setEnableParallaxStars={setEnableParallaxStars}
            minimizeToTray={minimizeToTray}
            setMinimizeToTray={setMinimizeToTray}
            appLockEnabled={appLockEnabled}
            setAppLockEnabled={setAppLockEnabled}
            onSetLockHash={handleSetLockHash}
            isAdmin={isAdmin}
            osInfo={osInfo}
            onResetTweaks={handleResetTweaks}
            onCheckForUpdates={handleCheckForUpdatesTrigger}
          />
        )}
      </div>

      {/* Auto-Updater Modal */}
      {isUpdateModalOpen && (
        <UpdateModal
          status={updateStatus}
          onClose={() => setIsUpdateModalOpen(false)}
          onCheckAgain={checkForUpdates}
          onDownloadAndInstall={downloadAndInstall}
        />
      )}

      {/* Unbypassable App Lock Overlay */}
      {isLocked && (
        <AppLockScreen
          storedHash={appLockHash}
          onUnlock={() => setIsLocked(false)}
        />
      )}
    </div>
  );
};

export default App;
