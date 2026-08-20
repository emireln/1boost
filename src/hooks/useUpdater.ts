import { useState } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

export interface UpdateStatus {
  checking: boolean;
  available: boolean;
  downloading: boolean;
  downloadedBytes: number;
  totalBytes: number;
  version: string | null;
  body: string | null;
  error: string | null;
}

export const useUpdater = () => {
  const [updateObj, setUpdateObj] = useState<Update | null>(null);
  const [status, setStatus] = useState<UpdateStatus>({
    checking: false,
    available: false,
    downloading: false,
    downloadedBytes: 0,
    totalBytes: 0,
    version: null,
    body: null,
    error: null,
  });

  const checkForUpdates = async () => {
    setStatus((prev) => ({ ...prev, checking: true, error: null }));
    try {
      const update = await check();
      if (update) {
        setUpdateObj(update);
        setStatus({
          checking: false,
          available: true,
          downloading: false,
          downloadedBytes: 0,
          totalBytes: 0,
          version: update.version,
          body: update.body || "Performance improvements, bug fixes, and optimization updates.",
          error: null,
        });
      } else {
        setStatus({
          checking: false,
          available: false,
          downloading: false,
          downloadedBytes: 0,
          totalBytes: 0,
          version: null,
          body: null,
          error: null,
        });
      }
    } catch (err: any) {
      console.warn("Auto-updater check fallback (dev simulation mode):", err);
      setStatus({
        checking: false,
        available: false,
        downloading: false,
        downloadedBytes: 0,
        totalBytes: 0,
        version: null,
        body: null,
        error: typeof err === "string" ? err : err.message || "Failed to check for updates",
      });
    }
  };

  const downloadAndInstall = async () => {
    if (!updateObj) return;

    setStatus((prev) => ({ ...prev, downloading: true }));
    let downloaded = 0;

    try {
      await updateObj.downloadAndInstall((event: any) => {
        switch (event.event) {
          case "Started":
            if (event.data?.contentLength) {
              setStatus((prev) => ({ ...prev, totalBytes: event.data.contentLength }));
            }
            break;
          case "Progress":
            if (event.data?.chunkLength) {
              downloaded += event.data.chunkLength;
              setStatus((prev) => ({ ...prev, downloadedBytes: downloaded }));
            }
            break;
          case "Finished":
            setStatus((prev) => ({ ...prev, downloading: false }));
            break;
        }
      });

      await relaunch();
    } catch (err: any) {
      setStatus((prev) => ({
        ...prev,
        downloading: false,
        error: err.message || "Failed to download update",
      }));
    }
  };

  return {
    status,
    checkForUpdates,
    downloadAndInstall,
  };
};
