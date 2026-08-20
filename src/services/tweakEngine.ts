import { invoke } from "@tauri-apps/api/core";
import { AppliedTweakInfo, TweakStep } from "../types/tweak";

// ========================================================
// Reversible Tweak Engine - frontend bindings to Rust
// ========================================================

/** Lists tweaks currently applied on this PC (backups exist on disk). */
export async function getAppliedTweaks(): Promise<AppliedTweakInfo[]> {
  try {
    return await invoke<AppliedTweakInfo[]>("get_applied_tweaks");
  } catch {
    return [];
  }
}

/** Restores the original Windows state of a single applied tweak. */
export async function undoTweak(tweakId: string): Promise<string> {
  return await invoke<string>("undo_tweak", { tweakId });
}

/** Reverts every applied tweak. Returns the number of successful reverts. */
export async function revertAllTweaks(): Promise<number> {
  return await invoke<number>("revert_all_tweaks");
}

/** Snapshot test helper (browser fallback always reports non-reversible). */
export function hasUndoData(tweak: TweakStep): boolean {
  return Boolean(tweak.undo_script || (tweak.registry_entries && tweak.registry_entries.length > 0));
}
