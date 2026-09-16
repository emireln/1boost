<p align="center">
  <img src="public/app-icon.svg" width="100" height="100" alt="1boost Logo" />
  <h1>1boost</h1>
  <p>A fast, local Windows optimizer and gaming debloater.</p>
  <p>
    <img src="https://img.shields.io/badge/Tauri-2.0-blue?logo=tauri" alt="Tauri" />
    <img src="https://img.shields.io/badge/Rust-orange?logo=rust" alt="Rust" />
    <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Offline-100%25-success" alt="Offline" />
    <img src="https://img.shields.io/badge/Language-EN%20%7C%20PT--BR-lightgrey" alt="Languages" />
  </p>
</p>

---

**1boost** applies system tweaks, debloats background Windows services, and tunes latency for gaming. It runs completely offline, uses native PowerShell and Registry commands, and creates a restore point before touching anything.

### What it does

- **Gaming & Input:** Enables raw 1:1 mouse input, activates HAGS, prioritizes game threads (MMCSS), disables CPU core parking, and sets the Ultimate Performance power plan.
- **Network Tuning:** Disables Nagle’s Algorithm (`TcpAckFrequency` / `TCPNoDelay`) and turns off Energy-Efficient Ethernet spikes.
- **Privacy & Debloat:** Disables telemetry services (DiagTrack, error reporting, tracking tasks), strips Cortana, Bing Start search, Widgets, and cleans temporary files.
- **Safe by Default:** Automatically runs `Checkpoint-Computer` to create a restore point, snapshots registry changes to `%APPDATA%\1boost\backups`, and supports one-click rollback. Advanced tweaks stay off until toggled.

### Extra Tools

- **DNS Switcher:** Quick presets for Cloudflare, Google, Quad9, AdGuard, and others.
- **Update Control:** Toggle between standard updates, security-only, or disabled.
- **System Maintenance:** Quick actions for SFC/DISM scans, network stack resets, and Explorer restarts.
- **Package Manager:** Browse and batch-install common apps and runtimes via WinGet.
- **Live Logs:** Real-time terminal output showing every script and command being executed.

---

### Development

**Prerequisites:** Node.js, Rust, and Tauri prerequisites for Windows.

```bash
# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run build
cd src-tauri && cargo build --release
