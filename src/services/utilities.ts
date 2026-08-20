import { invoke } from "@tauri-apps/api/core";

// ========================================================
// System Utilities - frontend bindings to Rust
// ========================================================

export interface DnsPreset {
  key: string;
  label: string;
  ipv4_primary: string;
  ipv4_secondary: string;
  ipv6_primary: string;
  ipv6_secondary: string;
}

export async function getDnsPresets(): Promise<DnsPreset[]> {
  try {
    return await invoke<DnsPreset[]>("get_dns_presets");
  } catch {
    return [];
  }
}

export async function getCurrentDns(): Promise<string> {
  try {
    return await invoke<string>("get_current_dns");
  } catch {
    return "";
  }
}

export async function setDnsProvider(providerKey: string): Promise<string> {
  return await invoke<string>("set_dns_provider", { providerKey });
}

export type UpdateMode = "default" | "security" | "disable";

export async function setUpdateMode(mode: UpdateMode): Promise<string> {
  return await invoke<string>("set_update_mode", { mode });
}

export type SystemFixId = "network_reset" | "wu_reset" | "dism_scan" | "ntp_pool" | "explorer_restart" | "icon_cache";

export async function runSystemFix(fixId: SystemFixId): Promise<string> {
  return await invoke<string>("run_system_fix", { fixId });
}

export type FeatureId = "dotnet" | "wsl" | "hyperv" | "legacy_media" | "sandbox" | "nfs" | "regbackup";

export async function enableWindowsFeature(featureId: FeatureId, enable: boolean): Promise<string> {
  return await invoke<string>("enable_windows_feature", { featureId, enable });
}

export type WingetAction = "install" | "uninstall" | "upgrade_all" | "search" | "list";

export async function runWinget(action: WingetAction, target = ""): Promise<string> {
  return await invoke<string>("run_winget", { action, target });
}
