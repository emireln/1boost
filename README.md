<p align="center">
  <img src="public/app-icon.svg" width="120" height="120" alt="1boost Logo Icon" />
  <br />
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 550 160" width="380" height="110">
    <text x="50%" y="52%" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="160" font-weight="900" text-anchor="middle" dominant-baseline="central" letter-spacing="-5">
      <tspan fill="#EB5D3D">1</tspan><tspan fill="#E3E3E3">boost</tspan>
    </text>
  </svg>
  <br />
  <b>Ultra-Minimalist One-Click Windows PC Optimizer & Gaming Debloater</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri" alt="Tauri 2.0" />
  <img src="https://img.shields.io/badge/Rust-orange?logo=rust" alt="Rust" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Style-Material_Design_3-red" alt="MD3 Dark Mode" />
  <img src="https://img.shields.io/badge/Offline-100%25%20Local-success" alt="100% Local" />
  <img src="https://img.shields.io/badge/i18n-EN%20%2F%20PT--BR-lightgrey" alt="EN / PT-BR" />
</p>

---

## ⚡ Overview

**1boost** is a high-performance, 100% local Windows PC optimization desktop application built with **Tauri 2**, **Rust**, and **React/TypeScript**, strictly adhering to **Google Material Design 3 (MD3)** dark mode guidelines.

It delivers a fully automated, **one-click optimization sequence** executing native PowerShell scripts and Registry modifications to strip telemetry, eliminate mouse input lag, optimize network latency, and unlock peak gaming performance — with **zero network dependencies, zero telemetry tracking, and complete offline privacy**.

---

## ✨ Feature Highlights

### 🚀 One-Click Boost (52 Tweaks)
- **Raw 1:1 Mouse Input** — disables Enhanced Pointer Precision + hover lag (`MouseSpeed`, `MouseHoverTime`).
- **Hardware-Accelerated GPU Scheduling (HAGS)** — `HwSchMode = 2` for stable 1% low FPS.
- **MMCSS Gaming Priority** — `SystemResponsiveness = 0`, GPU Priority 8 for max game thread scheduling.
- **Nagle's Algorithm Disabled** — `TcpAckFrequency = 1` + `TCPNoDelay = 1` for zero-latency TCP.
- **Energy-Efficient Ethernet (EEE) Disabled** — eliminates Green Ethernet ping spikes.
- **USB Selective Suspend Disabled** — prevents input lag spikes and disconnects.
- **Ultimate Performance Power Plan** + **CPU Core Parking Disabled** + **Power Throttling Off**.
- **Large System Cache** — gives kernel file cache more RAM for faster disk access.
- **Full Telemetry Stripping** — DiagTrack, dmwappushservice, Location Tracking, Advertising ID, Error Reporting (WER), Activity History, Consumer Features, telemetry tasks, feedback prompts.
- **Security Hardening** — WPBT boot-table execution blocked, device companion app installs prevented.
- **Debloat** — Cortana & Voice Activation, Bing Start Search, Widgets feed, Windows Tips, Store recommendations, End Task on taskbar, background apps, hibernation cleanup, temp/cache clean.
- **System Restore Point Safeguard** — `Checkpoint-Computer` automatically executed before optimizations.
- **🔄 Reversible Tweak Engine** — snapshots registry entries before applying (`%APPDATA%\1boost\backups`); undo any tweak or revert everything in one click.
- **⚙️ Tweak Tiers** — `safe` tweaks included in one-click boost; `advanced` tweaks default OFF with an explicit confirmation dialog.

### 🧰 System Utilities Hub
- **DNS Switcher** — 9 presets (Google, Cloudflare, OpenDNS, Quad9, AdGuard, DNS.SB, ControlD, CleanBrowsing, DHCP reset) with live active-preset detection.
- **Windows Update Modes** — Default, Security Only (delayed feature updates), or Disable (with explicit risk confirmation).
- **System Fixes** — Network stack reset, Windows Update reset, SFC + DISM corruption scan, NTP pool sync, Explorer restart.
- **Windows Features** — Toggle .NET, WSL, Hyper-V, Legacy Media, Windows Sandbox, NFS, and Scheduled Registry Backup.
- **WinGet Software Manager** — 48 curated developer & gaming packages with instant search and one-click upgrade all.

### 🖥️ Real-Time Execution Console
- Streaming PowerShell logs with timestamps, execution levels (info, success, warning, error), and clear controls.

### 🔒 Security & Settings
- **Password App Lock** with cryptographic PBKDF2 hash verification.
- **System Tray Minimization** and **Parallax Stars visual effects**.
- **Full Bilingual Support**: English (EN) and Portuguese (PT-BR).

---

## 🛠️ Verification & Build Commands

```bash
# Frontend Build (Vite + TypeScript)
npm run build

# Rust Backend Type Check
cd src-tauri && cargo check

# Rust Unit & Safety Tests
cd src-tauri && cargo test
```
