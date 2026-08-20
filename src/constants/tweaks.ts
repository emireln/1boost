import { TweakStep } from "../types/tweak";

export const DEFAULT_TWEAKS: TweakStep[] = [
  // --- TELEMETRY & PRIVACY DEBLOAT ---
  {
    id: "telemetry_diagtrack",
    name: "Disable Windows Telemetry Services",
    category: "Telemetry",
    description: "Stops and disables DiagTrack (Connected User Experiences) and dmwappushservice background tasks.",
    script: `
      Stop-Service -Name "DiagTrack" -ErrorAction SilentlyContinue;
      Set-Service -Name "DiagTrack" -StartupType Disabled -ErrorAction SilentlyContinue;
      Stop-Service -Name "dmwappushservice" -ErrorAction SilentlyContinue;
      Set-Service -Name "dmwappushservice" -StartupType Disabled -ErrorAction SilentlyContinue;
      Write-Output "Telemetry services stopped & disabled";
    `,
    undo_script: `
      Set-Service -Name "DiagTrack" -StartupType Automatic -ErrorAction SilentlyContinue;
      Start-Service -Name "DiagTrack" -ErrorAction SilentlyContinue;
      Set-Service -Name "dmwappushservice" -StartupType Automatic -ErrorAction SilentlyContinue;
      Start-Service -Name "dmwappushservice" -ErrorAction SilentlyContinue;
      Write-Output "Telemetry services restored";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "telemetry_registry",
    name: "Strip Diagnostic & Data Collection Keys",
    category: "Telemetry",
    description: "Sets AllowTelemetry registry key to 0 (Security mode) and disables feedback frequency prompts.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "AllowTelemetry" -Value 0 -Type DWord -Force;
      $fbPath = "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules";
      if (-not (Test-Path $fbPath)) { New-Item -Path $fbPath -Force | Out-Null };
      Set-ItemProperty -Path $fbPath -Name "NumberOfSIUFInPeriod" -Value 0 -Type DWord -Force;
      Write-Output "Telemetry registry policies set to 0";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection", name: "AllowTelemetry", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Siuf\\Rules", name: "NumberOfSIUFInPeriod", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "telemetry_location",
    name: "Disable Location Tracking & Sensors",
    category: "Telemetry",
    description: "Blocks app access to your device location and disables the Location Service (lfsvc) background process.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableLocation" -Value 1 -Type DWord -Force;
      $consentPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location";
      if (-not (Test-Path $consentPath)) { New-Item -Path $consentPath -Force | Out-Null };
      Set-ItemProperty -Path $consentPath -Name "Value" -Value "Deny" -Force;
      Stop-Service -Name "lfsvc" -ErrorAction SilentlyContinue;
      Set-Service -Name "lfsvc" -StartupType Disabled -ErrorAction SilentlyContinue;
      Write-Output "Location tracking and sensor services disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors", name: "DisableLocation", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location", name: "Value", type: "String" },
    ],
    undo_script: `
      Set-Service -Name "lfsvc" -StartupType Manual -ErrorAction SilentlyContinue;
      Start-Service -Name "lfsvc" -ErrorAction SilentlyContinue;
      Write-Output "Location service restored";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "telemetry_advertising_id",
    name: "Disable Advertising ID Tracking",
    category: "Telemetry",
    description: "Turns off the unique Advertising ID Windows uses to serve targeted app ads and track activity.",
    script: `
      $path = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "Enabled" -Value 0 -Type DWord -Force;
      Write-Output "Advertising ID disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo", name: "Enabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "telemetry_error_reporting",
    name: "Disable Windows Error Reporting (WER)",
    category: "Telemetry",
    description: "Stops error dialogs and telemetry uploads to the Microsoft Watson crash reporting service.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "Disabled" -Value 1 -Type DWord -Force;
      $consentPath = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting";
      if (-not (Test-Path $consentPath)) { New-Item -Path $consentPath -Force | Out-Null };
      Set-ItemProperty -Path $consentPath -Name "DontShowUI" -Value 1 -Type DWord -Force;
      Write-Output "Windows Error Reporting disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting", name: "Disabled", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\Windows Error Reporting", name: "DontShowUI", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_telemetry_tasks",
    name: "Disable Telemetry Scheduled Tasks",
    category: "Telemetry",
    description: "Disables Application Experience, ProgramDataUpdater, and Customer Experience Improvement scheduled tasks.",
    script: `
      Disable-ScheduledTask -TaskName "Microsoft-Windows-Application-Experience-Program-Data-Updater" -ErrorAction SilentlyContinue;
      Disable-ScheduledTask -TaskName "PcaPatchDbTask" -ErrorAction SilentlyContinue;
      Disable-ScheduledTask -TaskName "Proxy" -ErrorAction SilentlyContinue;
      Write-Output "Telemetry scheduled tasks disabled";
    `,
    undo_script: `
      Enable-ScheduledTask -TaskName "Microsoft-Windows-Application-Experience-Program-Data-Updater" -ErrorAction SilentlyContinue;
      Enable-ScheduledTask -TaskName "PcaPatchDbTask" -ErrorAction SilentlyContinue;
      Enable-ScheduledTask -TaskName "Proxy" -ErrorAction SilentlyContinue;
      Write-Output "Telemetry scheduled tasks restored";
    `,
    risk: "safe",
    enabled: true,
  },

  // --- GAMING & MOUSE RESPONSIVENESS ---
  {
    id: "gaming_mouse_accel",
    name: "Disable Mouse Acceleration (Raw 1:1 Input)",
    category: "Gaming",
    description: "Disables Enhanced Pointer Precision (MouseSpeed, MouseThreshold) for true 1:1 mouse tracking in competitive games.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseSpeed" -Value "0" -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold1" -Value "0" -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseThreshold2" -Value "0" -Force;
      Write-Output "Mouse Acceleration disabled for 1:1 raw tracking";
    `,
    registry_entries: [
      { path: "HKCU:\\Control Panel\\Mouse", name: "MouseSpeed", type: "String" },
      { path: "HKCU:\\Control Panel\\Mouse", name: "MouseThreshold1", type: "String" },
      { path: "HKCU:\\Control Panel\\Mouse", name: "MouseThreshold2", type: "String" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_mouse_hover_time",
    name: "Reduce Mouse & Input Hover Lag",
    category: "Gaming",
    description: "Reduces MouseHoverTime to 8ms for instant cursor menu response and zero input delay.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Mouse" -Name "MouseHoverTime" -Value "8" -Force;
      Write-Output "Mouse hover time reduced to 8ms";
    `,
    registry_entries: [
      { path: "HKCU:\\Control Panel\\Mouse", name: "MouseHoverTime", type: "String" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_hags",
    name: "Enable Hardware-Accelerated GPU Scheduling (HAGS)",
    category: "Gaming",
    description: "Offloads VRAM management directly to the GPU scheduler to reduce micro-stutters and increase average FPS.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "HwSchMode" -Value 2 -Type DWord -Force;
      Write-Output "Hardware-Accelerated GPU Scheduling set to 2 (Active)";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", name: "HwSchMode", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_mmcss_priority",
    name: "Optimize MMCSS Game CPU & GPU Priority Index",
    category: "Gaming",
    description: "Configures Multimedia Class Scheduler Service (MMCSS) to allocate 100% CPU priority and High GPU Priority to active games.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile";
      Set-ItemProperty -Path $path -Name "SystemResponsiveness" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "NetworkThrottlingIndex" -Value 4294967295 -Type DWord -Force;
      $gamePath = "$path\\Tasks\\Games";
      if (-not (Test-Path $gamePath)) { New-Item -Path $gamePath -Force | Out-Null };
      Set-ItemProperty -Path $gamePath -Name "GPU Priority" -Value 8 -Type DWord -Force;
      Set-ItemProperty -Path $gamePath -Name "Priority" -Value 6 -Type DWord -Force;
      Set-ItemProperty -Path $gamePath -Name "Scheduling Category" -Value "High" -Type String -Force;
      Write-Output "MMCSS game scheduler set to High GPU/CPU priority";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile", name: "SystemResponsiveness", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile", name: "NetworkThrottlingIndex", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", name: "GPU Priority", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", name: "Priority", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\Games", name: "Scheduling Category", type: "String" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_mode",
    name: "Enable Windows Game Mode",
    category: "Gaming",
    description: "Allocates maximum CPU and GPU resources to running games while preventing background Windows Update installs.",
    script: `
      $path = "HKCU:\\Software\\Microsoft\\GameBar";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "AllowAutoGameMode" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "AutoGameModeEnabled" -Value 1 -Type DWord -Force;
      Write-Output "Windows Game Mode enabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\GameBar", name: "AllowAutoGameMode", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\GameBar", name: "AutoGameModeEnabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_gamedvr",
    name: "Disable Game DVR Background Recording Overhead",
    category: "Gaming",
    description: "Stops Xbox GameDVR background video encoding to eliminate frame drops and stuttering.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" -Name "AppCaptureEnabled" -Value 0 -Type DWord -Force;
      $dvrPath = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR";
      if (-not (Test-Path $dvrPath)) { New-Item -Path $dvrPath -Force | Out-Null };
      Set-ItemProperty -Path $dvrPath -Name "AllowGameDVR" -Value 0 -Type DWord -Force;
      Write-Output "Game DVR background recording disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR", name: "AppCaptureEnabled", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR", name: "AllowGameDVR", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- NETWORK & LATENCY IMPROVEMENTS ---
  {
    id: "gaming_nagle",
    name: "Disable Nagle's Algorithm (Zero TCP Ping Latency)",
    category: "Gaming",
    description: "Disables TCP packet queuing delay (TcpAckFrequency = 1, TCPNoDelay = 1) for minimal network ping in online multiplayer games.",
    script: `
      $adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces";
      foreach ($adapter in $adapters) {
        Set-ItemProperty -Path $adapter.PSPath -Name "TcpAckFrequency" -Value 1 -Type DWord -ErrorAction SilentlyContinue;
        Set-ItemProperty -Path $adapter.PSPath -Name "TCPNoDelay" -Value 1 -Type DWord -ErrorAction SilentlyContinue;
      };
      Write-Output "Nagle's Algorithm disabled across all network adapters";
    `,
    undo_script: `
      $adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces";
      foreach ($adapter in $adapters) {
        Remove-ItemProperty -Path $adapter.PSPath -Name "TcpAckFrequency" -ErrorAction SilentlyContinue;
        Remove-ItemProperty -Path $adapter.PSPath -Name "TCPNoDelay" -ErrorAction SilentlyContinue;
      };
      Write-Output "Nagle's Algorithm settings restored";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "network_delivery_opt",
    name: "Disable Delivery Optimization P2P Bandwidth Hogging",
    category: "Gaming",
    description: "Stops Windows Update from using your internet upload bandwidth for peer-to-peer patch sharing.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DODownloadMode" -Value 0 -Type DWord -Force;
      Write-Output "Delivery Optimization set to HTTP only (P2P disabled)";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DeliveryOptimization", name: "DODownloadMode", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_eee",
    name: "Disable Energy-Efficient Ethernet (EEE)",
    category: "Gaming",
    description: "Disables Green Ethernet power-saving on all network adapters to reduce ping spikes during gameplay.",
    script: `
      $adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e972-e325-11ce-bfc1-08002be10318}" -ErrorAction SilentlyContinue;
      foreach ($adapter in $adapters) {
        Set-ItemProperty -Path $adapter.PSPath -Name "*EEE" -Value 0 -Type String -ErrorAction SilentlyContinue;
        Set-ItemProperty -Path $adapter.PSPath -Name "EnableGreenEthernet" -Value 0 -Type String -ErrorAction SilentlyContinue;
      };
      Write-Output "Energy-Efficient Ethernet disabled on all adapters";
    `,
    undo_script: `
      $adapters = Get-ChildItem "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Class\\{4d36e972-e325-11ce-bfc1-08002be10318}" -ErrorAction SilentlyContinue;
      foreach ($adapter in $adapters) {
        Remove-ItemProperty -Path $adapter.PSPath -Name "*EEE" -ErrorAction SilentlyContinue;
        Remove-ItemProperty -Path $adapter.PSPath -Name "EnableGreenEthernet" -ErrorAction SilentlyContinue;
      };
      Write-Output "Energy-Efficient Ethernet settings restored";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "gaming_usb_selective_suspend",
    name: "Disable USB Selective Suspend",
    category: "Gaming",
    description: "Prevents Windows from suspending USB ports, avoiding mouse/keyboard input lag spikes and disconnects.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\USB";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableSelectiveSuspend" -Value 1 -Type DWord -Force;
      Write-Output "USB Selective Suspend disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\USB", name: "DisableSelectiveSuspend", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- POWER, CPU & SYSTEM SMOOTHNESS ---
  {
    id: "power_ultimate",
    name: "Unlock Ultimate Performance Power Plan",
    category: "Power",
    description: "Activates the hidden high-performance Windows power scheme to prevent CPU core parking.",
    script: `
      powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 | Out-Null;
      $scheme = (powercfg -list | Select-String "Ultimate Performance") -replace '.*GUID: ([-a-f0-9]+).*', '$1';
      if ($scheme) { powercfg -setactive $scheme.Trim() };
      Write-Output "Ultimate Performance power scheme activated";
    `,
    undo_script: `
      powercfg -setactive 381b4222-f694-41f0-9685-ff5bb260df2e;
      Write-Output "Balanced power plan restored";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "power_throttling",
    name: "Disable Power Throttling",
    category: "Power",
    description: "Ensures background tasks and full-screen games receive full CPU instruction throughput.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "PowerThrottlingOff" -Value 1 -Type DWord -Force;
      Write-Output "Power Throttling disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerThrottling", name: "PowerThrottlingOff", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "power_core_parking",
    name: "Disable CPU Core Parking (100% Core Frequency)",
    category: "Power",
    description: "Forces all physical CPU cores active at 100% frequency without entering sleep states during intense workloads.",
    script: `
      Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533751-8757-4890-8e3e-4d5a7454f7a7\\0cc5b647-c1df-4596-858a-6765809618a8" -Name "Attributes" -Value 0 -Type DWord -ErrorAction SilentlyContinue;
      Write-Output "CPU Core Parking disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Power\\PowerSettings\\54533751-8757-4890-8e3e-4d5a7454f7a7\\0cc5b647-c1df-4596-858a-6765809618a8", name: "Attributes", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "power_large_system_cache",
    name: "Enable Large System Cache",
    category: "Power",
    description: "Gives the kernel file cache more RAM to work with, speeding up frequent disk reads in games and apps.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "LargeSystemCache" -Value 1 -Type DWord -Force;
      Write-Output "Large System Cache enabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management", name: "LargeSystemCache", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- DEBLOAT & BACKGROUND APPS ---
  {
    id: "debloat_bg_apps",
    name: "Disable Background Apps Execution",
    category: "Debloat",
    description: "Prevents UWP & Store apps from running unrequested background processes, freeing system RAM.",
    script: `
      $path = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "GlobalUserDisabled" -Value 1 -Type DWord -Force;
      Write-Output "Background apps global execution disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\BackgroundAccessApplications", name: "GlobalUserDisabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_bing_start",
    name: "Disable Bing Search in Start Menu",
    category: "Debloat",
    description: "Stops Start Menu web search queries and Cortana background telemetry overhead.",
    script: `
      $path = "HKCU:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableSearchBoxSuggestions" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search" -Name "BingSearchEnabled" -Value 0 -Type DWord -Force;
      Write-Output "Bing Start Menu search disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Explorer", name: "DisableSearchBoxSuggestions", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search", name: "BingSearchEnabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_widgets",
    name: "Disable Windows Widgets Feed",
    category: "Debloat",
    description: "Disables taskbar Widgets background news feed processes and memory consumption.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Dsh";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "AllowNewsAndInterests" -Value 0 -Type DWord -Force;
      Write-Output "Widgets news feed disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Dsh", name: "AllowNewsAndInterests", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_cortana",
    name: "Disable Cortana & Voice Activation",
    category: "Debloat",
    description: "Disables Cortana search integration, voice activation and background speech processing overhead.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "AllowCortana" -Value 0 -Type DWord -Force;
      $voices = "HKCU:\\SOFTWARE\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation";
      if (-not (Test-Path $voices)) { New-Item -Path $voices -Force | Out-Null };
      Set-ItemProperty -Path $voices -Name "AllowVoiceActivation" -Value 0 -Type DWord -Force;
      Write-Output "Cortana and voice activation disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search", name: "AllowCortana", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Speech_OneCore\\Settings\\VoiceActivation", name: "AllowVoiceActivation", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_tips",
    name: "Disable Windows Tips & Suggestions",
    category: "Debloat",
    description: "Suppresses lock screen tips, app suggestions and onboarding prompts from Microsoft.",
    script: `
      $path = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "SoftLandingEnabled" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "SystemPaneSuggestionsEnabled" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "SubscribedContent-338389Enabled" -Value 0 -Type DWord -Force;
      Write-Output "Windows tips and suggestions disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager", name: "SoftLandingEnabled", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager", name: "SystemPaneSuggestionsEnabled", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager", name: "SubscribedContent-338389Enabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- CLEANUP & MEMORY OPTIMIZATIONS ---
  {
    id: "cleanup_temp_files",
    name: "Clean Temporary & Cache Files",
    category: "Cleanup",
    description: "Clears temporary user files (%TEMP%), Windows system temp, and prefetch storage.",
    script: `
      $temp = [System.IO.Path]::GetTempPath();
      Remove-Item -Path "$temp\\*" -Recurse -Force -ErrorAction SilentlyContinue;
      Remove-Item -Path "C:\\Windows\\Temp\\*" -Recurse -Force -ErrorAction SilentlyContinue;
      Write-Output "Temp files & caches cleared";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "cleanup_dns_flush",
    name: "Flush DNS Resolver Cache",
    category: "Cleanup",
    description: "Clears cached network domain lookup tables to refresh network routing and resolve stale IP addresses.",
    script: `
      Clear-DnsClientCache;
      Write-Output "DNS Resolver Cache flushed successfully";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "cleanup_hibernate",
    name: "Disable Hibernation File (Reclaims GBs Drive Space)",
    category: "Cleanup",
    description: "Disables Windows Hibernation (powercfg /h off) to free up hiberfil.sys storage matching your system RAM capacity.",
    script: `
      powercfg /hibernate off;
      Write-Output "Windows Hibernation disabled (hiberfil.sys removed)";
    `,
    undo_script: `
      powercfg /hibernate on;
      Write-Output "Windows Hibernation re-enabled";
    `,
    risk: "safe",
    enabled: true,
  },

  // --- SAFETY & SECURITY HARDENING ---
  {
    id: "security_wpbt",
    name: "Disable Windows Platform Binary Table (WPBT)",
    category: "Safety",
    description: "Blocks OEM boot-time execution of vendor software (anti-theft/drivers) that can run without your consent.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableWpbtExecution" -Value 1 -Type DWord -Force;
      Write-Output "WPBT execution disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\Session Manager", name: "DisableWpbtExecution", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "privacy_device_metadata",
    name: "Prevent Device Companion App Installs",
    category: "Safety",
    description: "Blocks automatic driver/companion software downloads when plugging in new devices (monitors, phones, etc).",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Device Metadata";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "PreventDeviceMetadataFromNetwork" -Value 1 -Type DWord -Force;
      Write-Output "Device companion app installs blocked";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Device Metadata", name: "PreventDeviceMetadataFromNetwork", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- EXTENDED TELEMETRY & PRIVACY ---
  {
    id: "telemetry_activity_history",
    name: "Disable Activity History Tracking",
    category: "Telemetry",
    description: "Erases recent docs, clipboard and run history, and stops Windows from publishing/uploading user activities.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "EnableActivityFeed" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "PublishUserActivities" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "UploadUserActivities" -Value 0 -Type DWord -Force;
      Write-Output "Activity history tracking disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System", name: "EnableActivityFeed", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System", name: "PublishUserActivities", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System", name: "UploadUserActivities", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "telemetry_consumer_features",
    name: "Disable Consumer Features & App Suggestions",
    category: "Telemetry",
    description: "Stops promoted app installs, Store recommendations and onboarding suggestions pushed by Microsoft.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableWindowsConsumerFeatures" -Value 1 -Type DWord -Force;
      Write-Output "Consumer features disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent", name: "DisableWindowsConsumerFeatures", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },

  // --- EXTENDED DEBLOAT ---
  {
    id: "debloat_end_task",
    name: "Enable 'End Task' on Taskbar Right-Click",
    category: "Debloat",
    description: "Adds a one-click 'End task' option to the taskbar right-click menu for instant app termination.",
    script: `
      $path = "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\TaskbarDeveloperSettings";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "TaskbarEndTask" -Value 1 -Type DWord -Force;
      Write-Output "Taskbar End Task enabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\TaskbarDeveloperSettings", name: "TaskbarEndTask", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_store_search",
    name: "Disable Store Recommendations in Search",
    category: "Debloat",
    description: "Hides recommended Microsoft Store apps from Start Menu search results by locking the Store database.",
    script: `
      $db = "$Env:LocalAppData\\Packages\\Microsoft.WindowsStore_8wekyb3d8bbwe\\LocalState\\store.db";
      if (Test-Path $db) { icacls $db /deny Everyone:F | Out-Null; Write-Output "Store search recommendations disabled"; } else { Write-Output "Store database not found - nothing to lock"; }
    `,
    undo_script: `
      $db = "$Env:LocalAppData\\Packages\\Microsoft.WindowsStore_8wekyb3d8bbwe\\LocalState\\store.db";
      if (Test-Path $db) { icacls $db /grant Everyone:F | Out-Null; Write-Output "Store database permissions restored"; }
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "debloat_notifications",
    name: "Disable System Tray Notifications & Calendar",
    category: "Debloat",
    description: "Turns off all toast notifications including the calendar flyout. Advanced: hides the notification center entirely.",
    script: `
      $path = "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableNotificationCenter" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications" -Name "ToastEnabled" -Value 0 -Type DWord -Force;
      Write-Output "Notifications & calendar disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Policies\\Microsoft\\Windows\\Explorer", name: "DisableNotificationCenter", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\PushNotifications", name: "ToastEnabled", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },
  {
    id: "explorer_classic_context_menu",
    name: "Restore Classic Right-Click Context Menu",
    category: "Debloat",
    description: "Brings back the full classic context menu in Windows 11 instead of the simplified one (restarts Explorer).",
    script: `
      New-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" -Name InprocServer32 -Value "" -Force | Out-Null;
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
      Write-Output "Classic context menu restored";
    `,
    undo_script: `
      Remove-Item -Path "HKCU:\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}" -Recurse -Force -ErrorAction SilentlyContinue;
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
      Write-Output "Default context menu restored";
    `,
    risk: "advanced",
    enabled: false,
  },
  {
    id: "explorer_home_gallery_remove",
    name: "Remove Home & Gallery from File Explorer",
    category: "Debloat",
    description: "Removes the Home and Gallery entries from the Explorer sidebar and opens This PC by default.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Software\\Classes\\CLSID\\{f874310e-b6b7-47dc-bc84-b9e6b38f5903}" -Name "System.IsPinnedToNameSpaceTree" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Classes\\CLSID\\{e88865ea-0e1c-4e20-9aa6-edcd0212c87c}" -Name "System.IsPinnedToNameSpaceTree" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "LaunchTo" -Value 1 -Type DWord -Force;
      Write-Output "Home & Gallery removed from Explorer";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Classes\\CLSID\\{f874310e-b6b7-47dc-bc84-b9e6b38f5903}", name: "System.IsPinnedToNameSpaceTree", type: "DWord" },
      { path: "HKCU:\\Software\\Classes\\CLSID\\{e88865ea-0e1c-4e20-9aa6-edcd0212c87c}", name: "System.IsPinnedToNameSpaceTree", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "LaunchTo", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },
  {
    id: "debloat_edge_policies",
    name: "Microsoft Edge - Debloat (Policies Only)",
    category: "Debloat",
    description: "Disables Edge telemetry, recommendations, rewards, shopping assistant and first-run popups via Group Policies.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "PersonalizationReportingEnabled" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "ShowRecommendationsEnabled" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "HideFirstRunExperience" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "UserFeedbackAllowed" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "ConfigureDoNotTrack" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "DiagnosticData" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "WebWidgetAllowed" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "ShowMicrosoftRewards" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "EdgeShoppingAssistantEnabled" -Value 0 -Type DWord -Force;
      Write-Output "Edge debloat policies applied";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "PersonalizationReportingEnabled", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "ShowRecommendationsEnabled", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "HideFirstRunExperience", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "UserFeedbackAllowed", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "ConfigureDoNotTrack", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "DiagnosticData", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "WebWidgetAllowed", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "ShowMicrosoftRewards", type: "DWord" },
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Edge", name: "EdgeShoppingAssistantEnabled", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },

  // --- EXTENDED GAMING & NETWORK ---
  {
    id: "gaming_fso_disable",
    name: "Disable Fullscreen Optimizations (FSO)",
    category: "Gaming",
    description: "Disables Windows Fullscreen Optimizations globally. NOTE: disables color management in exclusive fullscreen.",
    script: `
      $path = "HKCU:\\System\\GameConfigStore";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "GameDVR_DXGIHonorFSEWindowsCompatible" -Value 1 -Type DWord -Force;
      Write-Output "Fullscreen Optimizations disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\System\\GameConfigStore", name: "GameDVR_DXGIHonorFSEWindowsCompatible", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },
  {
    id: "network_ipv6_preferred",
    name: "Prefer IPv4 Over IPv6",
    category: "Gaming",
    description: "Makes Windows prefer IPv4 connections, reducing latency on private networks where IPv6 is not configured.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisabledComponents" -Value 32 -Type DWord -Force;
      Write-Output "IPv4 preferred over IPv6";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters", name: "DisabledComponents", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },
  {
    id: "network_teredo_off",
    name: "Disable Teredo Tunneling",
    category: "Gaming",
    description: "Disables the Teredo IPv6 tunnel that can add latency, while keeping IPv6 itself fully functional.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisabledComponents" -Value 1 -Type DWord -Force;
      netsh interface teredo set state disabled;
      Write-Output "Teredo tunneling disabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Services\\Tcpip6\\Parameters", name: "DisabledComponents", type: "DWord" },
    ],
    undo_script: `
      netsh interface teredo set state default;
      Write-Output "Teredo set back to default";
    `,
    risk: "advanced",
    enabled: false,
  },

  // --- EXTENDED POWER & PERFORMANCE ---
  {
    id: "performance_services_manual",
    name: "Trim Services & SvcHost Memory Split",
    category: "Power",
    description: "Sets redundant services to manual and matches SvcHostSplitThresholdInKB to your RAM, cutting svchost.exe process count.",
    script: `
      $Memory = (Get-CimInstance Win32_PhysicalMemory | Measure-Object Capacity -Sum).Sum / 1KB;
      Set-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control" -Name "SvcHostSplitThresholdInKB" -Value $Memory -Type DWord -Force;
      Set-Service -Name "CscService" -StartupType Disabled -ErrorAction SilentlyContinue;
      Set-Service -Name "MapsBroker" -StartupType Manual -ErrorAction SilentlyContinue;
      Set-Service -Name "StorSvc" -StartupType Manual -ErrorAction SilentlyContinue;
      Set-Service -Name "SharedAccess" -StartupType Disabled -ErrorAction SilentlyContinue;
      Write-Output "Services trimmed & SvcHost split tuned to system memory";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control", name: "SvcHostSplitThresholdInKB", type: "DWord" },
    ],
    undo_script: `
      Remove-ItemProperty -Path "HKLM:\\SYSTEM\\CurrentControlSet\\Control" -Name "SvcHostSplitThresholdInKB" -ErrorAction SilentlyContinue;
      Set-Service -Name "CscService" -StartupType Manual -ErrorAction SilentlyContinue;
      Set-Service -Name "MapsBroker" -StartupType Automatic -ErrorAction SilentlyContinue;
      Set-Service -Name "StorSvc" -StartupType Automatic -ErrorAction SilentlyContinue;
      Set-Service -Name "SharedAccess" -StartupType Automatic -ErrorAction SilentlyContinue;
      Write-Output "Services restored to defaults";
    `,
    risk: "safe",
    enabled: true,
  },
  {
    id: "performance_visual_effects",
    name: "Set Visual Effects to Best Performance",
    category: "Power",
    description: "Disables animations, shadows and transparency effects for snappier UI response on low-end hardware.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "DragFullWindows" -Value "0" -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "MenuShowDelay" -Value "200" -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop\\WindowMetrics" -Name "MinAnimate" -Value "0" -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Keyboard" -Name "KeyboardDelay" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "ListviewAlphaSelect" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "ListviewShadow" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarAnimations" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" -Name "VisualFXSetting" -Value 3 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\DWM" -Name "EnableAeroPeek" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "TaskbarMn" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "ShowTaskViewButton" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Search" -Name "SearchboxTaskbarMode" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "UserPreferencesMask" -Type Binary -Value ([byte[]](144,18,3,128,16,0,0,0)) -Force;
      Write-Output "Visual effects set to best performance";
    `,
    registry_entries: [
      { path: "HKCU:\\Control Panel\\Desktop", name: "DragFullWindows", type: "String" },
      { path: "HKCU:\\Control Panel\\Desktop", name: "MenuShowDelay", type: "String" },
      { path: "HKCU:\\Control Panel\\Desktop\\WindowMetrics", name: "MinAnimate", type: "String" },
      { path: "HKCU:\\Control Panel\\Keyboard", name: "KeyboardDelay", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "ListviewAlphaSelect", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "ListviewShadow", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "TaskbarAnimations", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects", name: "VisualFXSetting", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\DWM", name: "EnableAeroPeek", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "TaskbarMn", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "ShowTaskViewButton", type: "DWord" },
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Search", name: "SearchboxTaskbarMode", type: "DWord" },
    ],
    undo_script: `
      Remove-ItemProperty -Path "HKCU:\\Control Panel\\Desktop" -Name "UserPreferencesMask" -ErrorAction SilentlyContinue;
      Write-Output "Visual effects mask restored";
    `,
    risk: "advanced",
    enabled: false,
  },
  {
    id: "performance_explorer_auto_discovery",
    name: "Disable Explorer Folder Type Discovery",
    category: "Power",
    description: "Stops Explorer from guessing folder types (music, pictures...) which slows browsing. WARNING: disables Explorer grouping.",
    script: `
      Remove-Item -Path "HKCU:\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags" -Recurse -Force -ErrorAction SilentlyContinue;
      Remove-Item -Path "HKCU:\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\BagMRU" -Recurse -Force -ErrorAction SilentlyContinue;
      $allFolders = "HKCU:\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags\\AllFolders\\Shell";
      if (-not (Test-Path $allFolders)) { New-Item -Path $allFolders -Force | Out-Null };
      New-ItemProperty -Path $allFolders -Name "FolderType" -Value "NotSpecified" -PropertyType String -Force;
      Write-Output "Explorer folder type discovery disabled (restart Explorer to apply)";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags\\AllFolders\\Shell", name: "FolderType", type: "String" },
    ],
    undo_script: `
      Remove-ItemProperty -Path "HKCU:\\Software\\Classes\\Local Settings\\Software\\Microsoft\\Windows\\Shell\\Bags\\AllFolders\\Shell" -Name "FolderType" -ErrorAction SilentlyContinue;
      Write-Output "Explorer folder type discovery restored";
    `,
    risk: "safe",
    enabled: true,
  },

  // --- EXTENDED CLEANUP ---
  {
    id: "cleanup_storage_sense",
    name: "Disable Storage Sense Auto Cleanup",
    category: "Cleanup",
    description: "Prevents Storage Sense from silently deleting temp and recycle bin files without your review.",
    script: `
      $path = "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "01" -Value 0 -Type DWord -Force;
      Write-Output "Storage Sense disabled";
    `,
    registry_entries: [
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\StorageSense\\Parameters\\StoragePolicy", name: "01", type: "DWord" },
    ],
    risk: "safe",
    enabled: true,
  },
  {
    id: "cleanup_component_store",
    name: "Deep Clean Component Store (DISM)",
    category: "Cleanup",
    description: "Runs DISM component cleanup to remove superseded update files and reclaim several GB of drive space.",
    script: `
      Dism.exe /online /Cleanup-Image /StartComponentCleanup /ResetBase;
      Write-Output "Component store cleaned";
    `,
    risk: "safe",
    enabled: false,
  },

  // --- CUSTOMIZE PREFERENCES (VISUAL & UX TOGGLES) ---
  {
    id: "pref_dark_mode",
    name: "Dark Theme for Windows",
    category: "Preferences",
    description: "Switches the system and apps to dark mode (restarts Explorer to apply instantly).",
    script: `
      Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "AppsUseLightTheme" -Value 0 -Type DWord -Force;
      Set-ItemProperty -Path "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" -Name "SystemUsesLightTheme" -Value 0 -Type DWord -Force;
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
      Write-Output "Dark theme enabled";
    `,
    registry_entries: [
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", name: "AppsUseLightTheme", type: "DWord" },
      { path: "HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", name: "SystemUsesLightTheme", type: "DWord" },
    ],
    undo_script: `
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
    `,
    risk: "safe",
    enabled: false,
  },
  {
    id: "pref_show_extensions",
    name: "Show File Extensions in Explorer",
    category: "Preferences",
    description: "Displays .exe, .png and other file extensions in File Explorer (restarts Explorer to apply instantly).",
    script: `
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "HideFileExt" -Value 0 -Type DWord -Force;
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
      Write-Output "File extensions shown";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "HideFileExt", type: "DWord" },
    ],
    undo_script: `
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
    `,
    risk: "safe",
    enabled: false,
  },
  {
    id: "pref_hidden_files",
    name: "Reveal Hidden Files in Explorer",
    category: "Preferences",
    description: "Shows hidden files and folders in File Explorer (restarts Explorer to apply instantly).",
    script: `
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "Hidden" -Value 1 -Type DWord -Force;
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
      Write-Output "Hidden files revealed";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "Hidden", type: "DWord" },
    ],
    undo_script: `
      Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue;
    `,
    risk: "safe",
    enabled: false,
  },
  {
    id: "pref_battery_percent",
    name: "Show Battery Percentage in Tray",
    category: "Preferences",
    description: "Displays the numeric battery percentage next to the battery icon in the system tray.",
    script: `
      Set-ItemProperty -Path "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" -Name "IsBatteryPercentageEnabled" -Value 1 -Type DWord -Force;
      Write-Output "Battery percentage enabled";
    `,
    registry_entries: [
      { path: "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced", name: "IsBatteryPercentageEnabled", type: "DWord" },
    ],
    risk: "safe",
    enabled: false,
  },
  {
    id: "pref_verbose_logon",
    name: "Verbose Startup/Shutdown Messages",
    category: "Preferences",
    description: "Shows detailed status messages during Windows startup and shutdown instead of the spinner.",
    script: `
      $path = "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "VerboseStatus" -Value 1 -Type DWord -Force;
      Write-Output "Verbose logon messages enabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", name: "VerboseStatus", type: "DWord" },
    ],
    risk: "safe",
    enabled: false,
  },
  {
    id: "pref_bsod_verbose",
    name: "Detailed Blue Screen (BSoD) Info",
    category: "Preferences",
    description: "Shows technical error text instead of the sad emoji on Blue Screen of Death.",
    script: `
      $path = "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\CrashControl";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisplayParameters" -Value 1 -Type DWord -Force;
      Set-ItemProperty -Path $path -Name "DisableEmoticon" -Value 1 -Type DWord -Force;
      Write-Output "Detailed BSoD info enabled";
    `,
    registry_entries: [
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\CrashControl", name: "DisplayParameters", type: "DWord" },
      { path: "HKLM:\\SYSTEM\\CurrentControlSet\\Control\\CrashControl", name: "DisableEmoticon", type: "DWord" },
    ],
    risk: "safe",
    enabled: false,
  },
  {
    id: "debloat_onedrive",
    name: "Disable OneDrive & Remove from Explorer",
    category: "Debloat",
    description: "Stops OneDrive syncing, disables autostart, and unpins OneDrive from the File Explorer navigation sidebar.",
    script: `
      Stop-Process -Name "OneDrive" -Force -ErrorAction SilentlyContinue;
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive";
      if (-not (Test-Path $path)) { New-Item -Path $path -Force | Out-Null };
      Set-ItemProperty -Path $path -Name "DisableFileSyncNGSC" -Value 1 -Type DWord -Force;
      $clsid = "HKCR:\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}";
      if (Test-Path $clsid) { Set-ItemProperty -Path $clsid -Name "System.IsPinnedToNameSpaceTree" -Value 0 -Type DWord -Force };
      $clsid64 = "HKCR:\\Wow6432Node\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}";
      if (Test-Path $clsid64) { Set-ItemProperty -Path $clsid64 -Name "System.IsPinnedToNameSpaceTree" -Value 0 -Type DWord -Force };
      Write-Output "OneDrive disabled and removed from Explorer sidebar";
    `,
    undo_script: `
      $path = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive";
      if (Test-Path $path) { Set-ItemProperty -Path $path -Name "DisableFileSyncNGSC" -Value 0 -Type DWord -Force };
      $clsid = "HKCR:\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}";
      if (Test-Path $clsid) { Set-ItemProperty -Path $clsid -Name "System.IsPinnedToNameSpaceTree" -Value 1 -Type DWord -Force };
      $clsid64 = "HKCR:\\Wow6432Node\\CLSID\\{018D5C66-4533-4307-9B53-224DE2ED1FE6}";
      if (Test-Path $clsid64) { Set-ItemProperty -Path $clsid64 -Name "System.IsPinnedToNameSpaceTree" -Value 1 -Type DWord -Force };
      Write-Output "OneDrive policy and Explorer pin restored";
    `,
    registry_entries: [
      { path: "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\OneDrive", name: "DisableFileSyncNGSC", type: "DWord" },
    ],
    risk: "advanced",
    enabled: false,
  },
];
