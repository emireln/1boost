export interface RegistryEntry {
  path: string;
  name: string;
  type: "DWord" | "String" | "QWord" | "Binary" | "MultiString" | "ExpandString";
}

export interface TweakStep {
  id: string;
  name: string;
  category: "Safety" | "Telemetry" | "Gaming" | "Power" | "Debloat" | "Cleanup" | "Preferences";
  description: string;
  script: string;
  enabled: boolean;
  /** PowerShell script that restores the original Windows state. */
  undo_script?: string;
  /** "safe" = included in one-click boost, "advanced" = manual opt-in only. */
  risk?: "safe" | "advanced";
  /** Registry values snapshotted before applying, so undo can restore them. */
  registry_entries?: RegistryEntry[];
}

export interface AppliedTweakInfo {
  tweak_id: string;
  tweak_name: string;
  applied_at: string;
  reversible: boolean;
}

export interface TweakProgressPayload {
  current: number;
  total: number;
  percentage: number;
  step_id: string;
  step_name: string;
}

export interface TweakLogPayload {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
  step_id: string;
}

export interface TweakCompletePayload {
  success: boolean;
  total_time_ms: number;
  completed_steps: number;
  failed_steps: number;
  restore_point_created: boolean;
}

export interface AdminStatus {
  is_admin: boolean;
  os_info: string;
}
