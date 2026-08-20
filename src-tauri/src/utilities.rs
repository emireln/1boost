// ========================================================
// 1boost System Utilities
// DNS switcher, Windows Update modes, system fixes,
// optional Windows features and the WinGet app manager.
// ========================================================

use serde::{Deserialize, Serialize};
use std::os::windows::process::CommandExt;
use std::process::Command;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Emitter};

use crate::TweakLogPayload;

const CREATE_NO_WINDOW: u32 = 0x08000000;

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

fn emit_log(app: &AppHandle, level: &str, message: String) {
    let _ = app.emit(
        "tweak-log",
        TweakLogPayload {
            timestamp: current_timestamp(),
            level: level.to_string(),
            message,
            step_id: "utilities".to_string(),
        },
    );
}

// --------------------------------------------------------
// DNS SWITCHER
// --------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DnsPreset {
    pub key: String,
    pub label: String,
    pub ipv4_primary: String,
    pub ipv4_secondary: String,
    pub ipv6_primary: String,
    pub ipv6_secondary: String,
}

fn dns_presets() -> Vec<DnsPreset> {
    vec![
        DnsPreset { key: "default".into(), label: "Default / DHCP".into(), ipv4_primary: "".into(), ipv4_secondary: "".into(), ipv6_primary: "".into(), ipv6_secondary: "".into() },
        DnsPreset { key: "google".into(), label: "Google".into(), ipv4_primary: "8.8.8.8".into(), ipv4_secondary: "8.8.4.4".into(), ipv6_primary: "2001:4860:4860::8888".into(), ipv6_secondary: "2001:4860:4860::8844".into() },
        DnsPreset { key: "cloudflare".into(), label: "Cloudflare".into(), ipv4_primary: "1.1.1.1".into(), ipv4_secondary: "1.0.0.1".into(), ipv6_primary: "2606:4700:4700::1111".into(), ipv6_secondary: "2606:4700:4700::1001".into() },
        DnsPreset { key: "cloudflare_malware".into(), label: "Cloudflare (Malware Blocking)".into(), ipv4_primary: "1.1.1.2".into(), ipv4_secondary: "1.0.0.2".into(), ipv6_primary: "2606:4700:4700::1112".into(), ipv6_secondary: "2606:4700:4700::1002".into() },
        DnsPreset { key: "cloudflare_family".into(), label: "Cloudflare (Malware + Adult)".into(), ipv4_primary: "1.1.1.3".into(), ipv4_secondary: "1.0.0.3".into(), ipv6_primary: "2606:4700:4700::1113".into(), ipv6_secondary: "2606:4700:4700::1003".into() },
        DnsPreset { key: "opendns".into(), label: "OpenDNS".into(), ipv4_primary: "208.67.222.222".into(), ipv4_secondary: "208.67.220.220".into(), ipv6_primary: "2620:119:35::35".into(), ipv6_secondary: "2620:119:53::53".into() },
        DnsPreset { key: "quad9".into(), label: "Quad9".into(), ipv4_primary: "9.9.9.9".into(), ipv4_secondary: "149.112.112.112".into(), ipv6_primary: "2620:fe::fe".into(), ipv6_secondary: "2620:fe::9".into() },
        DnsPreset { key: "adguard".into(), label: "AdGuard (Ads + Trackers)".into(), ipv4_primary: "94.140.14.14".into(), ipv4_secondary: "94.140.15.15".into(), ipv6_primary: "2a10:50c0::ad1:ff".into(), ipv6_secondary: "2a10:50c0::ad2:ff".into() },
        DnsPreset { key: "adguard_family".into(), label: "AdGuard (Ads + Malware + Adult)".into(), ipv4_primary: "94.140.14.15".into(), ipv4_secondary: "94.140.15.16".into(), ipv6_primary: "2a10:50c0::bad1:ff".into(), ipv6_secondary: "2a10:50c0::bad2:ff".into() },
    ]
}

#[tauri::command]
pub fn get_dns_presets() -> Vec<DnsPreset> {
    dns_presets()
}

/// First IPv4 DNS server currently in use (for active-preset detection).
#[tauri::command]
pub fn get_current_dns() -> String {
    run_powershell_script(
        "(Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.ServerAddresses -and $_.ServerAddresses[0] -ne '0.0.0.0' } | Select-Object -First 1).ServerAddresses -join ','",
    )
    .unwrap_or_default()
}

#[tauri::command]
pub fn set_dns_provider(provider_key: String) -> Result<String, String> {
    let preset = dns_presets()
        .iter()
        .find(|p| p.key == provider_key)
        .cloned()
        .ok_or_else(|| format!("Unknown DNS provider: {}", provider_key))?;

    if preset.key == "default" {
        let script = r#"
            Get-NetAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'Up' } | ForEach-Object {
                Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv4 -ResetServerAddresses -ErrorAction SilentlyContinue;
                Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv6 -ResetServerAddresses -ErrorAction SilentlyContinue;
            }
            Write-Output "DNS reset to DHCP defaults"
        "#;
        run_powershell_script(script)?;
        Ok("DNS reset to DHCP defaults (IPv4 + IPv6)".to_string())
    } else {
        let script = format!(
            r#"
                $primary = '{0}'; $secondary = '{1}'; $primary6 = '{2}'; $secondary6 = '{3}';
                Get-NetAdapter -ErrorAction SilentlyContinue | Where-Object {{ $_.Status -eq 'Up' }} | ForEach-Object {{
                    Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv4 -ServerAddresses ($primary,$secondary) -ErrorAction SilentlyContinue;
                    Set-DnsClientServerAddress -InterfaceIndex $_.ifIndex -AddressFamily IPv6 -ServerAddresses ($primary6,$secondary6) -ErrorAction SilentlyContinue;
                }}
                Write-Output "DNS set to {4}"
            "#,
            preset.ipv4_primary,
            preset.ipv4_secondary,
            preset.ipv6_primary,
            preset.ipv6_secondary,
            preset.label
        );
        run_powershell_script(&script)?;
        Ok(format!(
            "DNS switched to {} (IPv4 {} / {}, IPv6 {} / {})",
            preset.label, preset.ipv4_primary, preset.ipv4_secondary, preset.ipv6_primary, preset.ipv6_secondary
        ))
    }
}

// --------------------------------------------------------
// WINDOWS UPDATE MODES
// --------------------------------------------------------

#[tauri::command]
pub fn set_update_mode(mode: String) -> Result<String, String> {
    let script = match mode.as_str() {
        "default" => r#"
            Remove-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate" -Recurse -Force -ErrorAction SilentlyContinue;
            Set-Service -Name wuauserv -StartupType Automatic -ErrorAction SilentlyContinue;
            Start-Service -Name wuauserv -ErrorAction SilentlyContinue;
            Write-Output "Windows Update restored to default behavior"
        "#,
        "security" => r#"
            $path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate";
            if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
            Set-ItemProperty -Path $path -Name "DeferFeatureUpdates" -Value 1 -Type DWord -Force;
            Set-ItemProperty -Path $path -Name "DeferFeatureUpdatesPeriodInDays" -Value 365 -Type DWord -Force;
            Set-ItemProperty -Path $path -Name "DeferQualityUpdates" -Value 1 -Type DWord -Force;
            Set-ItemProperty -Path $path -Name "DeferQualityUpdatesPeriodInDays" -Value 4 -Type DWord -Force;
            $au = "$path\AU";
            if (-not (Test-Path $au)) { New-Item -Path $au -Force | Out-Null };
            Set-ItemProperty -Path $au -Name "NoAutoUpdate" -Value 0 -Type DWord -Force;
            Set-Service -Name wuauserv -StartupType Automatic -ErrorAction SilentlyContinue;
            Start-Service -Name wuauserv -ErrorAction SilentlyContinue;
            Write-Output "Windows Update set to Security mode (365d feature / 4d security delays)"
        "#,
        "disable" => r#"
            $path = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate";
            if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
            $au = "$path\AU";
            if (-not (Test-Path $au)) { New-Item -Path $au -Force | Out-Null };
            Set-ItemProperty -Path $au -Name "NoAutoUpdate" -Value 1 -Type DWord -Force;
            Set-ItemProperty -Path $path -Name "DisableWUfMServicing" -Value 1 -Type DWord -Force;
            Stop-Service -Name wuauserv -ErrorAction SilentlyContinue;
            Set-Service -Name wuauserv -StartupType Disabled -ErrorAction SilentlyContinue;
            Write-Output "Windows Update disabled (all updates)"
        "#,
        _ => return Err("Unknown update mode".to_string()),
    };

    run_powershell_script(script)?;
    Ok("Windows Update mode applied successfully".to_string())
}

// --------------------------------------------------------
// SYSTEM FIXES
// --------------------------------------------------------

#[tauri::command]
pub async fn run_system_fix(app: AppHandle, fix_id: String) -> Result<String, String> {
    let (label, script) = match fix_id.as_str() {
        "network_reset" => (
            "Network Reset",
            r#"
                netsh int ip reset;
                netsh winsock reset;
                ipconfig /flushdns;
                Write-Output "Network stack reset (reboot required to finalize)"
            "#,
        ),
        "wu_reset" => (
            "Windows Update Reset",
            r#"
                Stop-Service -Name wuauserv,bits,cryptsvc -Force -ErrorAction SilentlyContinue;
                regsvr32 /s atl.dll; regsvr32 /s urlmon.dll; regsvr32 /s mshtml.dll;
                regsvr32 /s shdocvw.dll; regsvr32 /s browseui.dll; regsvr32 /s jscript.dll;
                regsvr32 /s vbscript.dll; regsvr32 /s scrrun.dll; regsvr32 /s msxml.dll;
                regsvr32 /s msxml3.dll; regsvr32 /s msxml6.dll; regsvr32 /s actxprxy.dll;
                regsvr32 /s softpub.dll; regsvr32 /s wintrust.dll; regsvr32 /s dssenh.dll;
                regsvr32 /s rsaenh.dll; regsvr32 /s gpkcsp.dll; regsvr32 /s sccbase.dll;
                regsvr32 /s slbcsp.dll; regsvr32 /s cryptdlg.dll; regsvr32 /s oleaut32.dll;
                regsvr32 /s ole32.dll; regsvr32 /s shell32.dll; regsvr32 /s initpki.dll;
                regsvr32 /s wuapi.dll; regsvr32 /s wuaueng.dll; regsvr32 /s wuaueng1.dll;
                regsvr32 /s wucltui.dll; regsvr32 /s wups.dll; regsvr32 /s wups2.dll;
                regsvr32 /s wuweb.dll; regsvr32 /s qmgr.dll; regsvr32 /s qmgrprxy.dll;
                regsvr32 /s wucltux.dll; regsvr32 /s muweb.dll; regsvr32 /s wuwebv.dll;
                Start-Service -Name wuauserv,bits,cryptsvc -ErrorAction SilentlyContinue;
                Write-Output "Windows Update components re-registered and services restarted"
            "#,
        ),
        "dism_scan" => (
            "System Corruption Scan",
            r#"
                sfc /scannow;
                Dism.exe /Online /Cleanup-Image /RestoreHealth;
                Write-Output "System File Checker and DISM restore completed"
            "#,
        ),
        "ntp_pool" => (
            "NTP Pool",
            r#"
                w32tm /config /manualpeerlist:"0.pool.ntp.org 1.pool.ntp.org 2.pool.ntp.org" /syncfromflags:manual /reliable:yes /update;
                Restart-Service -Name w32time -ErrorAction SilentlyContinue;
                Write-Output "Time sync switched to pool.ntp.org"
            "#,
        ),
        "explorer_restart" => (
            "Restart Explorer",
            r#"
                Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
                Write-Output "Explorer restarted"
            "#,
        ),
        "icon_cache" => (
            "Clear Icon & Thumbnail Cache",
            r#"
                Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
                Remove-Item -Path "$env:LOCALAPPDATA\IconCache.db" -Force -ErrorAction SilentlyContinue;
                Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\thumbcache_*.db" -Force -ErrorAction SilentlyContinue;
                Remove-Item -Path "$env:LOCALAPPDATA\Microsoft\Windows\Explorer\iconcache_*.db" -Force -ErrorAction SilentlyContinue;
                Start-Process explorer;
                Write-Output "Icon and thumbnail cache rebuilt successfully"
            "#,
        ),
        _ => return Err("Unknown system fix".to_string()),
    };

    emit_log(&app, "info", format!("Running fix: {} ...", label));
    match run_powershell_script(script) {
        Ok(output) => {
            emit_log(&app, "success", format!("{} - {}", label, output));
            Ok(format!("{} - completed", label))
        }
        Err(err) => {
            emit_log(&app, "error", format!("{} failed: {}", label, err));
            Err(err)
        }
    }
}

// --------------------------------------------------------
// WINDOWS OPTIONAL FEATURES
// --------------------------------------------------------

#[tauri::command]
pub async fn enable_windows_feature(app: AppHandle, feature_id: String, enable: bool) -> Result<String, String> {
    let (label, feature_names) = match feature_id.as_str() {
        "dotnet" => (".NET Framework (2, 3, 4)", "NetFx3,NetFx4-AdvSrvs"),
        "wsl" => ("Windows Subsystem for Linux", "VirtualMachinePlatform,Microsoft-Windows-Subsystem-Linux"),
        "hyperv" => ("Hyper-V", "Microsoft-Hyper-V-All"),
        "legacy_media" => ("Legacy Media Components", "WindowsMediaPlayer,MediaPlayback,DirectPlay,LegacyComponents"),
        "sandbox" => ("Windows Sandbox", "Containers-DisposableClientVM"),
        "nfs" => ("Network File System (NFS)", "ServicesForNFS-ClientOnly,ClientForNFS-Infrastructure,NFS-Administration"),
        "regbackup" => ("Daily Registry Backup Task", ""),
        _ => return Err("Unknown Windows feature".to_string()),
    };

    if feature_id == "dotnet" && !enable {
        return Err("Disabling .NET Framework is not supported (many apps depend on it)".to_string());
    }

    emit_log(&app, "info", format!("{} {}...", if enable { "Enabling" } else { "Disabling" }, label));

    let script = if feature_id == "regbackup" {
        if enable {
            r#"
                New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Configuration Manager' -Name 'EnablePeriodicBackup' -Type DWord -Value 1 -Force;
                New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Configuration Manager' -Name 'BackupCount' -Type DWord -Value 2 -Force;
                $action = New-ScheduledTaskAction -Execute 'schtasks' -Argument '/run /i /tn "\Microsoft\Windows\Registry\RegIdleBackup"';
                $trigger = New-ScheduledTaskTrigger -Daily -At 00:30;
                Register-ScheduledTask -Action $action -Trigger $trigger -TaskName 'AutoRegBackup' -Description 'Create System Registry Backups' -User 'System' -Force;
                Write-Output "Daily registry backup task registered"
            "#
            .to_string()
        } else {
            r#"
                Unregister-ScheduledTask -TaskName 'AutoRegBackup' -Confirm:$false -ErrorAction SilentlyContinue;
                Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Configuration Manager' -Name 'EnablePeriodicBackup' -ErrorAction SilentlyContinue;
                Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Configuration Manager' -Name 'BackupCount' -ErrorAction SilentlyContinue;
                Write-Output "Daily registry backup task removed"
            "#
            .to_string()
        }
    } else if enable {
        format!(
            "Enable-WindowsOptionalFeature -Online -FeatureName {} -All -NoRestart | Out-Null; Write-Output \"{} enabled (a restart may be required)\"",
            feature_names, label
        )
    } else {
        format!(
            "Disable-WindowsOptionalFeature -Online -FeatureName {} -NoRestart | Out-Null; Write-Output \"{} disabled (a restart may be required)\"",
            feature_names, label
        )
    };

    match run_powershell_script(&script) {
        Ok(output) => {
            emit_log(&app, "success", format!("{}: {}", label, output));
            Ok(format!("{} - completed", label))
        }
        Err(err) => {
            emit_log(&app, "error", format!("{} failed: {}", label, err));
            Err(err)
        }
    }
}

// --------------------------------------------------------
// WINGET APP MANAGER
// --------------------------------------------------------

#[tauri::command]
pub async fn run_winget(app: AppHandle, action: String, target: String) -> Result<String, String> {
    emit_log(&app, "info", format!("winget {} '{}' ...", action, target));

    let mut cmd = Command::new("winget.exe");
    cmd.creation_flags(CREATE_NO_WINDOW);

    match action.as_str() {
        "install" => {
            cmd.args(["--id", &target, "-e", "--source", "winget", "--accept-package-agreements", "--accept-source-agreements", "--silent", "--disable-interactivity"]);
        }
        "uninstall" => {
            cmd.args(["--id", &target, "-e", "--accept-package-agreements", "--accept-source-agreements", "--silent", "--disable-interactivity"]);
        }
        "upgrade_all" => {
            cmd.args(["--upgrade", "--all", "--accept-package-agreements", "--accept-source-agreements", "--silent", "--disable-interactivity"]);
        }
        "search" => {
            cmd.args(["--search", &target, "--accept-source-agreements", "--disable-interactivity"]);
        }
        "list" => {
            cmd.args(["--list", "--accept-source-agreements"]);
        }
        _ => return Err("Unknown winget action".to_string()),
    }

    let output = cmd.output().map_err(|e| format!("winget is not installed or failed to launch: {}", e))?;
    let stdout = String::from_utf8_lossy(&output.stdout).to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).to_string();
    let combined = if stdout.trim().is_empty() { stderr.trim().to_string() } else { stdout.trim().to_string() };

    emit_log(
        &app,
        if output.status.success() { "success" } else { "warning" },
        format!("winget {} -> {}", action, combined.lines().last().unwrap_or("done")),
    );

    if !output.status.success() && combined.is_empty() {
        return Err(format!("winget exited with code {}", output.status));
    }

    Ok(combined)
}
