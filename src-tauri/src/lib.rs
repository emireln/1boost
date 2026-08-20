use serde::{Deserialize, Serialize};
use tauri::AppHandle;

pub mod script_safety;
pub mod tweak_engine;
pub mod utilities;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TweakStep {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub script: String,
    #[serde(default)]
    pub undo_script: Option<String>,
    #[serde(default)]
    pub risk: String,
    #[serde(default)]
    pub registry_entries: Vec<tweak_engine::RegistryEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TweakProgressPayload {
    pub current: usize,
    pub total: usize,
    pub percentage: u32,
    pub step_id: String,
    pub step_name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TweakLogPayload {
    pub timestamp: String,
    pub level: String, // "info", "success", "warning", "error"
    pub message: String,
    pub step_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TweakCompletePayload {
    pub success: bool,
    pub total_time_ms: u64,
    pub completed_steps: usize,
    pub failed_steps: usize,
    pub restore_point_created: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdminStatus {
    pub is_admin: bool,
    pub os_info: String,
}

mod commands {
    use super::*;
    use std::os::windows::process::CommandExt;
    use std::process::Command;
    use std::time::Instant;
    use tauri::Emitter;

    const CREATE_NO_WINDOW: u32 = 0x08000000;

    fn current_timestamp() -> String {
        use std::time::SystemTime;
        let now = SystemTime::now();
        if let Ok(duration) = now.duration_since(SystemTime::UNIX_EPOCH) {
            let secs = duration.as_secs();
            let hours = (secs / 3600) % 24;
            let mins = (secs / 60) % 60;
            let s = secs % 60;
            format!("{:02}:{:02}:{:02}", hours, mins, s)
        } else {
            "00:00:00".to_string()
        }
    }

    fn run_powershell_script(script: &str) -> Result<String, String> {
        let mut cmd = Command::new("powershell.exe");
        cmd.creation_flags(CREATE_NO_WINDOW);
        cmd.args(["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script]);

        match cmd.output() {
            Ok(output) => {
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();
                if output.status.success() {
                    Ok(stdout.trim().to_string())
                } else {
                    Err(if !stderr.trim().is_empty() {
                        stderr.trim().to_string()
                    } else {
                        format!("Command exited with code {}", output.status)
                    })
                }
            }
            Err(e) => Err(format!("Failed to execute PowerShell: {}", e)),
        }
    }

    #[tauri::command]
    pub fn minimize_window(window: tauri::Window) {
        let _ = window.minimize();
    }

    #[tauri::command]
    pub fn hide_window(window: tauri::Window) {
        let _ = window.hide();
    }

    #[tauri::command]
    pub fn toggle_maximize_window(window: tauri::Window) {
        if let Ok(is_maximized) = window.is_maximized() {
            if is_maximized {
                let _ = window.unmaximize();
            } else {
                let _ = window.maximize();
            }
        }
    }

    #[tauri::command]
    pub fn close_window(window: tauri::Window) {
        let _ = window.close();
    }

    #[tauri::command]
    pub fn check_admin() -> AdminStatus {
        let script = "[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent().IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)";
        let is_admin = match run_powershell_script(script) {
            Ok(res) => res.trim().eq_ignore_ascii_case("True"),
            Err(_) => false,
        };

        let os_script = "(Get-CimInstance Win32_OperatingSystem).Caption + ' (' + (Get-CimInstance Win32_OperatingSystem).OSArchitecture + ')'";
        let os_info = run_powershell_script(os_script).unwrap_or_else(|_| "Windows PC".to_string());

        AdminStatus { is_admin, os_info }
    }

    #[tauri::command]
    pub async fn create_system_restore_point(app: AppHandle) -> Result<bool, String> {
        let _ = app.emit(
            "tweak-log",
            TweakLogPayload {
                timestamp: current_timestamp(),
                level: "info".to_string(),
                message: "Creating Windows System Restore Point...".to_string(),
                step_id: "restore_point".to_string(),
            },
        );

        let script = r#"
            try {
                Enable-ComputerRestore -Drive "C:\" -ErrorAction SilentlyContinue
                Checkpoint-Computer -Description "1boost Pre-Optimization Restore Point" -RestorePointType "MODIFY_SETTINGS" -ErrorAction Stop
                Write-Output "RESTORE_POINT_SUCCESS"
            } catch {
                Write-Output ("RESTORE_POINT_NOTICE: " + $_.Exception.Message)
            }
        "#;

        match run_powershell_script(script) {
            Ok(out) if out.contains("RESTORE_POINT_SUCCESS") => {
                let _ = app.emit(
                    "tweak-log",
                    TweakLogPayload {
                        timestamp: current_timestamp(),
                        level: "success".to_string(),
                        message: "System Restore Point '1boost Pre-Optimization Restore Point' created successfully.".to_string(),
                        step_id: "restore_point".to_string(),
                    },
                );
                Ok(true)
            }
            Ok(out) => {
                let _ = app.emit(
                    "tweak-log",
                    TweakLogPayload {
                        timestamp: current_timestamp(),
                        level: "warning".to_string(),
                        message: format!("Restore point notice: {}", out),
                        step_id: "restore_point".to_string(),
                    },
                );
                Ok(true)
            }
            Err(err) => {
                let _ = app.emit(
                    "tweak-log",
                    TweakLogPayload {
                        timestamp: current_timestamp(),
                        level: "warning".to_string(),
                        message: format!("Restore point creation notice: {}", err),
                        step_id: "restore_point".to_string(),
                    },
                );
                Err(err)
            }
        }
    }

    #[tauri::command]
    pub async fn execute_optimizations(
        app: AppHandle,
        steps: Vec<TweakStep>,
        create_restore: bool,
    ) -> Result<TweakCompletePayload, String> {
        let start_time = Instant::now();
        let total = steps.len() + if create_restore { 1 } else { 0 };
        let mut completed_steps = 0;
        let mut failed_steps = 0;
        let mut restore_point_created = false;
        let mut current_index = 0;

        if create_restore {
            current_index += 1;
            let percentage = ((current_index as f32 / total as f32) * 100.0) as u32;
            let _ = app.emit(
                "tweak-progress",
                TweakProgressPayload {
                    current: current_index,
                    total,
                    percentage,
                    step_id: "restore_point".to_string(),
                    step_name: "Create System Restore Point".to_string(),
                },
            );

            match create_system_restore_point(app.clone()).await {
                Ok(_) => {
                    restore_point_created = true;
                    completed_steps += 1;
                }
                Err(_) => {
                    failed_steps += 1;
                }
            }
        }

        for step in steps {
            current_index += 1;
            let percentage = ((current_index as f32 / total as f32) * 100.0) as u32;

            let _ = app.emit(
                "tweak-progress",
                TweakProgressPayload {
                    current: current_index,
                    total,
                    percentage,
                    step_id: step.id.clone(),
                    step_name: step.name.clone(),
                },
            );

            let _ = app.emit(
                "tweak-log",
                TweakLogPayload {
                    timestamp: current_timestamp(),
                    level: "info".to_string(),
                    message: format!("Applying [{}] {}", step.category, step.name),
                    step_id: step.id.clone(),
                },
            );

            // Pre-tweak snapshot for reversible undo support
            match tweak_engine::backup_tweak(&step) {
                Ok(true) => {
                    let _ = app.emit(
                        "tweak-log",
                        TweakLogPayload {
                            timestamp: current_timestamp(),
                            level: "info".to_string(),
                            message: format!("Snapshot saved - '{}' can be reverted later.", step.name),
                            step_id: step.id.clone(),
                        },
                    );
                }
                Ok(false) => {
                    let _ = app.emit(
                        "tweak-log",
                        TweakLogPayload {
                            timestamp: current_timestamp(),
                            level: "warning".to_string(),
                            message: format!("'{}' is non-reversible (no undo data available).", step.name),
                            step_id: step.id.clone(),
                        },
                    );
                }
                Err(err) => {
                    let _ = app.emit(
                        "tweak-log",
                        TweakLogPayload {
                            timestamp: current_timestamp(),
                            level: "warning".to_string(),
                            message: format!("Backup warning for '{}': {}", step.name, err),
                            step_id: step.id.clone(),
                        },
                    );
                }
            }

            match run_powershell_script(&step.script) {
                Ok(output) => {
                    completed_steps += 1;
                    let log_msg = if output.is_empty() {
                        format!("Successfully applied: {}", step.name)
                    } else {
                        format!("Applied: {} ({})", step.name, output)
                    };
                    let _ = app.emit(
                        "tweak-log",
                        TweakLogPayload {
                            timestamp: current_timestamp(),
                            level: "success".to_string(),
                            message: log_msg,
                            step_id: step.id.clone(),
                        },
                    );
                }
                Err(err) => {
                    failed_steps += 1;
                    let _ = app.emit(
                        "tweak-log",
                        TweakLogPayload {
                            timestamp: current_timestamp(),
                            level: "error".to_string(),
                            message: format!("Failed to apply {}: {}", step.name, err),
                            step_id: step.id.clone(),
                        },
                    );
                }
            }

            std::thread::sleep(std::time::Duration::from_millis(200));
        }

        let elapsed = start_time.elapsed().as_millis() as u64;

        let summary = TweakCompletePayload {
            success: failed_steps == 0,
            total_time_ms: elapsed,
            completed_steps,
            failed_steps,
            restore_point_created,
        };

        let _ = app.emit(
            "tweak-log",
            TweakLogPayload {
                timestamp: current_timestamp(),
                level: if failed_steps == 0 { "success".to_string() } else { "warning".to_string() },
                message: format!(
                    "Optimization sequence finished: {} completed, {} failed in {:.2}s.",
                    completed_steps,
                    failed_steps,
                    elapsed as f64 / 1000.0
                ),
                step_id: "complete".to_string(),
            },
        );

        let _ = app.emit("tweak-complete", summary.clone());

        Ok(summary)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            commands::minimize_window,
            commands::hide_window,
            commands::toggle_maximize_window,
            commands::close_window,
            commands::check_admin,
            commands::create_system_restore_point,
            commands::execute_optimizations,
            script_safety::analyze_script_safety,
            script_safety::execute_custom_script,
            script_safety::get_hardware_info,
            tweak_engine::undo_tweak,
            tweak_engine::get_applied_tweaks,
            tweak_engine::revert_all_tweaks,
            utilities::get_dns_presets,
            utilities::get_current_dns,
            utilities::set_dns_provider,
            utilities::set_update_mode,
            utilities::run_system_fix,
            utilities::enable_windows_feature,
            utilities::run_winget
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
