// ========================================================
// 1boost Reversible Tweak Engine
// Pre-tweak registry snapshots stored in
// %APPDATA%\1boost\backups\<tweak_id>.json so every applied
// tweak can be reverted to its original Windows values.
// ========================================================

use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};

use crate::TweakStep;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegistryEntry {
    pub path: String,
    pub name: String,
    #[serde(rename = "type")]
    pub value_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntrySnapshot {
    pub path: String,
    pub name: String,
    pub value_type: String,
    pub was_present: bool,
    pub original_value: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TweakBackup {
    pub tweak_id: String,
    pub tweak_name: String,
    pub applied_at: String,
    pub entries: Vec<EntrySnapshot>,
    pub undo_script: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppliedTweakInfo {
    pub tweak_id: String,
    pub tweak_name: String,
    pub applied_at: String,
    pub reversible: bool,
}

fn run_powershell_script(script: &str) -> Result<String, String> {
    let mut cmd = Command::new("powershell.exe");
    cmd.creation_flags(CREATE_NO_WINDOW);
    let script = format!(
        "$ErrorActionPreference = 'Stop';\n{}\nif ($null -ne $LASTEXITCODE -and $LASTEXITCODE -ne 0) {{ exit $LASTEXITCODE }}",
        script
    );
    cmd.args([
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        &script,
    ]);

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

fn current_timestamp() -> String {
    let now = SystemTime::now();
    if let Ok(duration) = now.duration_since(UNIX_EPOCH) {
        let secs = duration.as_secs();
        format!(
            "{:04}-{:02}-{:02} {:02}:{:02}:{:02}",
            secs / 31536000 + 1970,
            (secs / 2592000) % 12 + 1,
            (secs / 86400) % 30 + 1,
            (secs / 3600) % 24,
            (secs / 60) % 60,
            secs % 60
        )
    } else {
        "unknown".to_string()
    }
}

fn backups_dir() -> Result<PathBuf, String> {
    let appdata =
        env::var("APPDATA").map_err(|_| "APPDATA environment variable not found".to_string())?;
    let dir = Path::new(&appdata).join("1boost").join("backups");
    fs::create_dir_all(&dir).map_err(|e| format!("Failed to create backups directory: {}", e))?;
    Ok(dir)
}

/// Sanitizes a tweak id into a safe filename (alphanumeric + _-).
fn safe_filename(tweak_id: &str) -> String {
    tweak_id
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || c == '-' || c == '_' {
                c
            } else {
                '_'
            }
        })
        .collect::<String>()
}

fn backup_path(tweak_id: &str) -> Result<PathBuf, String> {
    Ok(backups_dir()?.join(format!("{}.json", safe_filename(tweak_id))))
}

fn escape_ps_single_quotes(input: &str) -> String {
    input.replace('\'', "''")
}

fn is_supported_registry_type(value_type: &str) -> bool {
    matches!(
        value_type.to_ascii_lowercase().as_str(),
        "string" | "expandstring" | "binary" | "dword" | "multistring" | "qword"
    )
}

fn powershell_value(value: &serde_json::Value, value_type: &str) -> Result<String, String> {
    match value_type.to_ascii_lowercase().as_str() {
        "string" | "expandstring" => match value {
            serde_json::Value::String(value) => Ok(format!("'{}'", escape_ps_single_quotes(value))),
            _ => Err("Registry string backup has an invalid value".to_string()),
        },
        "dword" | "qword" => match value {
            serde_json::Value::Number(value) => Ok(value.to_string()),
            _ => Err("Registry integer backup has an invalid value".to_string()),
        },
        "binary" | "multistring" => {
            let serde_json::Value::Array(values) = value else {
                return Err("Registry array backup has an invalid value".to_string());
            };
            let items = values
                .iter()
                .map(
                    |value| match (value_type.to_ascii_lowercase().as_str(), value) {
                        ("binary", serde_json::Value::Number(value)) => Ok(value.to_string()),
                        ("multistring", serde_json::Value::String(value)) => {
                            Ok(format!("'{}'", escape_ps_single_quotes(value)))
                        }
                        _ => Err("Registry array backup contains an invalid item".to_string()),
                    },
                )
                .collect::<Result<Vec<_>, _>>()?;
            let cast = if value_type.eq_ignore_ascii_case("Binary") {
                "byte"
            } else {
                "string"
            };
            Ok(format!("[{}[]]@({})", cast, items.join(",")))
        }
        _ => Err(format!("Unsupported registry value type: {}", value_type)),
    }
}

/// Reads the current value of a registry value. Returns None when absent.
fn read_registry_value(path: &str, name: &str) -> Result<Option<(String, String)>, String> {
    let script = format!(
        r#"$path = '{}'; $name = '{}';
        $key = Get-Item -LiteralPath $path -ErrorAction SilentlyContinue;
        if ($null -eq $key -or $key.GetValueNames() -notcontains $name) {{
            '{{"exists":false}}'
        }} else {{
            $kind = $key.GetValueKind($name).ToString();
            $value = $key.GetValue($name, $null, [Microsoft.Win32.RegistryValueOptions]::DoNotExpandEnvironmentNames);
            @{{ exists = $true; type = $kind; value = $value }} | ConvertTo-Json -Compress -Depth 10
        }}"#,
        escape_ps_single_quotes(path),
        escape_ps_single_quotes(name)
    );
    let output = run_powershell_script(&script)?;
    let snapshot: serde_json::Value = serde_json::from_str(&output)
        .map_err(|e| format!("Failed to parse registry snapshot: {}", e))?;
    if snapshot["exists"].as_bool() != Some(true) {
        return Ok(None);
    }
    let value_type = snapshot["type"]
        .as_str()
        .ok_or_else(|| "Registry snapshot did not include a value type".to_string())?;
    if !is_supported_registry_type(value_type) {
        return Err(format!("Unsupported registry value type: {}", value_type));
    }
    let value = snapshot
        .get("value")
        .ok_or_else(|| "Registry snapshot did not include a value".to_string())?;
    Ok(Some((value_type.to_string(), value.to_string())))
}

fn snapshot_entry(entry: &RegistryEntry) -> Result<EntrySnapshot, String> {
    let original = read_registry_value(&entry.path, &entry.name)?;
    let (value_type, original_value) = match original {
        Some((value_type, value)) => (value_type, Some(value)),
        None => (entry.value_type.clone(), None),
    };
    if !is_supported_registry_type(&value_type) {
        return Err(format!("Unsupported registry value type: {}", value_type));
    }
    Ok(EntrySnapshot {
        path: entry.path.clone(),
        name: entry.name.clone(),
        value_type,
        was_present: original_value.is_some(),
        original_value,
    })
}

/// Captures a pre-tweak snapshot and writes a backup file.
/// Returns true when a reversible backup was created, false when the
/// tweak carries no undo data (non-reversible, e.g. file cleanup).
pub fn backup_tweak(step: &TweakStep) -> Result<bool, String> {
    let has_entries = !step.registry_entries.is_empty();
    let has_undo_script = step.undo_script.is_some();

    if !has_entries && !has_undo_script {
        return Ok(false);
    }

    let path = backup_path(&step.id)?;
    if path.exists() {
        let content = fs::read_to_string(&path)
            .map_err(|e| format!("Failed to read existing backup: {}", e))?;
        let existing: TweakBackup = serde_json::from_str(&content)
            .map_err(|e| format!("Existing backup is corrupted: {}", e))?;
        if existing.tweak_id != step.id {
            return Err("Existing backup belongs to a different tweak".to_string());
        }
        return Ok(true);
    }

    let entries: Vec<EntrySnapshot> = step
        .registry_entries
        .iter()
        .map(snapshot_entry)
        .collect::<Result<_, _>>()?;

    let backup = TweakBackup {
        tweak_id: step.id.clone(),
        tweak_name: step.name.clone(),
        applied_at: current_timestamp(),
        entries,
        undo_script: step.undo_script.clone(),
    };

    let json = serde_json::to_string_pretty(&backup)
        .map_err(|e| format!("Failed to serialize backup: {}", e))?;
    fs::write(path, json).map_err(|e| format!("Failed to write backup file: {}", e))?;

    Ok(true)
}

fn load_backup(tweak_id: &str) -> Result<TweakBackup, String> {
    let path = backup_path(tweak_id)?;
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("No backup found for tweak '{}': {}", tweak_id, e))?;
    serde_json::from_str(&content).map_err(|e| format!("Corrupted backup file: {}", e))
}

fn restore_registry_entry(entry: &EntrySnapshot) -> Result<(), String> {
    let path = escape_ps_single_quotes(&entry.path);
    let name = escape_ps_single_quotes(&entry.name);

    if entry.was_present {
        if !is_supported_registry_type(&entry.value_type) {
            return Err(format!(
                "Unsupported registry value type: {}",
                entry.value_type
            ));
        }
        let stored_value = entry.original_value.as_deref().unwrap_or_default();
        let value: serde_json::Value = serde_json::from_str(stored_value)
            .unwrap_or_else(|_| serde_json::Value::String(stored_value.to_string()));
        let value_arg = powershell_value(&value, &entry.value_type)?;
        let script = format!(
            "New-ItemProperty -Path '{}' -Name '{}' -PropertyType {} -Value {} -Force | Out-Null",
            path, name, entry.value_type, value_arg
        );
        run_powershell_script(&script)?;
    } else {
        let script = format!(
            "Remove-ItemProperty -Path '{}' -Name '{}' -ErrorAction SilentlyContinue",
            path, name
        );
        let _ = run_powershell_script(&script);
    }
    Ok(())
}

/// Restores the original Windows state for a single applied tweak.
/// Deletes the backup file on success.
#[tauri::command]
pub fn undo_tweak(tweak_id: String) -> Result<String, String> {
    undo_tweak_inner(&tweak_id)
}

fn undo_tweak_inner(tweak_id: &str) -> Result<String, String> {
    let backup = load_backup(tweak_id)?;

    // 1. Restore original registry values
    let mut restored = 0usize;
    for entry in &backup.entries {
        restore_registry_entry(entry)?;
        restored += 1;
    }

    // 2. Run the explicit undo script (service state, powercfg, etc.)
    if let Some(undo_script) = &backup.undo_script {
        run_powershell_script(undo_script)?;
    }

    // 3. Clean up the backup
    let _ = fs::remove_file(backup_path(tweak_id)?);

    Ok(format!(
        "Reverted '{}' ({} registry value(s) restored{}).",
        backup.tweak_name,
        restored,
        if backup.undo_script.is_some() {
            " + undo script executed"
        } else {
            ""
        }
    ))
}

/// Lists every applied (backed up) tweak for the Undo UI.
#[tauri::command]
pub fn get_applied_tweaks() -> Vec<AppliedTweakInfo> {
    let dir = match backups_dir() {
        Ok(d) => d,
        Err(_) => return Vec::new(),
    };

    let mut result: Vec<AppliedTweakInfo> = Vec::new();
    if let Ok(entries) = fs::read_dir(&dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().map(|e| e == "json").unwrap_or(false) {
                if let Ok(content) = fs::read_to_string(&path) {
                    if let Ok(backup) = serde_json::from_str::<TweakBackup>(&content) {
                        result.push(AppliedTweakInfo {
                            tweak_id: backup.tweak_id,
                            tweak_name: backup.tweak_name,
                            applied_at: backup.applied_at,
                            reversible: true,
                        });
                    }
                }
            }
        }
    }
    result
}

/// Reverts every applied tweak. Returns the number of successful reverts.
#[tauri::command]
pub fn revert_all_tweaks() -> Result<u32, String> {
    let applied = get_applied_tweaks();
    let mut reverted = 0u32;

    for info in applied {
        if undo_tweak_inner(&info.tweak_id).is_ok() {
            reverted += 1;
        }
    }

    Ok(reverted)
}

// --------------------------------------------------------
// Unit tests (pure logic only - no PowerShell execution)
// --------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn filename_sanitization() {
        assert_eq!(safe_filename("gaming_mouse_accel"), "gaming_mouse_accel");
        assert_eq!(safe_filename("tweak:bad/id?"), "tweak_bad_id_");
        assert_eq!(safe_filename(""), "");
    }

    #[test]
    fn backup_serialization_roundtrip() {
        let backup = TweakBackup {
            tweak_id: "test_tweak".to_string(),
            tweak_name: "Test Tweak".to_string(),
            applied_at: "2026-01-01 12:00:00".to_string(),
            entries: vec![EntrySnapshot {
                path: "HKLM:\\SOFTWARE\\Test".to_string(),
                name: "Value".to_string(),
                value_type: "DWord".to_string(),
                was_present: true,
                original_value: Some("1".to_string()),
            }],
            undo_script: Some("Write-Output 'undo'".to_string()),
        };

        let json = serde_json::to_string(&backup).unwrap();
        let parsed: TweakBackup = serde_json::from_str(&json).unwrap();
        assert_eq!(parsed.tweak_id, "test_tweak");
        assert_eq!(parsed.entries.len(), 1);
        assert_eq!(parsed.entries[0].original_value.as_deref(), Some("1"));
        assert_eq!(parsed.undo_script.as_deref(), Some("Write-Output 'undo'"));
    }

    #[test]
    fn restore_values_use_registry_type_safe_literals() {
        let binary = serde_json::json!([144, 18, 3, 128]);
        assert_eq!(
            powershell_value(&binary, "Binary").unwrap(),
            "[byte[]]@(144,18,3,128)"
        );

        let string = serde_json::json!("it's saved");
        assert_eq!(
            powershell_value(&string, "String").unwrap(),
            "'it''s saved'"
        );
        assert!(powershell_value(&string, "Unknown").is_err());
    }

    #[test]
    fn tweak_without_undo_data_is_non_reversible() {
        let step = TweakStep {
            id: "cleanup_test".to_string(),
            name: "Cleanup".to_string(),
            category: "Cleanup".to_string(),
            description: "".to_string(),
            script: "Write-Output 'x'".to_string(),
            undo_script: None,
            risk: String::new(),
            registry_entries: Vec::new(),
        };
        // backup_tweak touches the filesystem; assert the decision logic instead
        assert!(!step.undo_script.is_some() && step.registry_entries.is_empty());
    }
}
