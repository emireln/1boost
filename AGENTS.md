# AGENTS.md - 1boost Developer & AI Agent Guidelines

This repository houses **1boost**, an ultra-minimalist, high-performance, 100% local Windows PC optimization desktop application built with **Tauri 2 (Rust backend)** and **React/TypeScript (frontend)** styled with **Google Material Design 3 (MD3)** dark mode aesthetics.

## Tech Stack & Architecture

- **Backend**: Rust (`src-tauri`) leveraging native Windows PowerShell execution, Registry modifications, and `std::os::windows::process::CommandExt`.
- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Pure CSS design system adhering strictly to Material Design 3 dark mode tokens.
- **Icons**: Google Material Symbols Outlined.
- **IPC Protocol**: Tauri commands (`invoke`) for request/response operations and Tauri event emitters (`app.emit`) for real-time PowerShell execution streaming.
- **Operation Mode**: **100% Local & Offline**. Zero cloud dependencies, zero external database connections, zero telemetry data transmissions.

---

## Agent Engineering Protocols: Caveman & Ponytail

All AI coding assistants and contributors MUST follow these two foundational engineering disciplines:

### 1. Caveman Protocol (Conversational Token Compression)
- **Tenet**: *"Why use many tokens when few tokens do trick."*
- **Cut Filler**: Strip greetings, pleasantries, preambles, meta-commentary, and repetitive summaries.
- **Telegraphic Signal**: Express thought and progress in concise, direct sentences.
- **Byte-for-Byte Code Precision**: Never abridge, truncate, or pseudo-code technical syntax, diffs, or diagnostics.

### 2. Ponytail Protocol (Lazy Senior Developer Code Minimalism)
- **Tenet**: *"The best code is the code you never wrote."*
- **Follow the Necessity Ladder**:
  1. **YAGNI**: Reject unrequested features, speculative extensions, and redundant wrappers.
  2. **Codebase Reuse**: Check existing design tokens, components, and utilities before creating new ones.
  3. **Standard Library**: Prefer TypeScript/Rust built-in functions over utility packages.
  4. **Native Platform**: Leverage native OS/browser features.
  5. **Zero Dependency Bloat**: Do NOT add new dependencies unless strictly necessary.
  6. **Simple Functions**: Choose clean, readable functions over multi-layered abstractions.
  7. **Minimum Viable Code**: Write the smallest amount of production-grade code that satisfies requirements.
- **Safety Carve-Out**: Never skip security, error boundaries, or script safety validation.

---

## Core Design System Tokens

| Token | Value | Purpose |
|---|---|---|
| `--bg-base` | `#121212` | Main application backdrop |
| `--surface-1` | `#1E1E1E` | Titlebar & primary container cards |
| `--surface-2` | `#282828` | Sub-containers, inputs & log viewer |
| `--outline-border` | `#3C3C3C` | Subtle 1px solid borders |
| `--text-primary` | `#E3E3E3` | Main readable text |
| `--text-secondary` | `#A0A0A0` | Subtitles & muted captions |
| `--accent-color` | `#EB5D3D` | Flame Orange/Red CTA & highlights |
| `--accent-glow` | `rgba(235, 93, 61, 0.12)` | Soft selection glow |

---

## UI & Behavioral Directives

1. **TitleBar Nav & Caption Controls**:
   - Navigation buttons MUST be containerless (`.icon-btn-containerless`), 36x36px circular (`border-radius: 50%`), sharing identical hover ripples (`rgba(255, 255, 255, 0.08)`) with caption buttons.
   - All interactive titlebar buttons MUST include `onMouseDown={(e) => e.stopPropagation()}` and `WebkitAppRegion: "no-drag"` to prevent Windows frameless drag regions from capturing click events.

2. **Tooltips & Portals**:
   - Tooltips MUST NOT be rendered inside `overflow: hidden` parent containers. Use `GlobalTooltip.tsx` rendering into `#global-tooltip-portal` on `document.body` with boundary collision detection.

3. **Window Management**:
   - Custom frameless titlebar with window control commands (`minimize_window`, `toggle_maximize_window`, `close_window`) registered natively in Rust (`lib.rs`) and in frontend TypeScript handlers.

4. **Type Safety & Build Verification**:
   - All code edits must compile cleanly with `npm run build` (TypeScript + Vite) and `cargo check` (Rust).
   - Unit tests: `cargo test` inside `src-tauri/` must pass.

---

## Core Features Map

### 1. One-Click Hero Optimizer (`DashboardView.tsx`)
- Central hero boost button that applies selected safe optimization presets in one click.
- Real-time progress percentage bar, active step labels, and completed run timestamp.
- System Restore Point safeguard option before execution.

### 2. Granular Tweak Matrix (`TweakGrid.tsx`)
- Tweak definitions in `src/constants/tweaks.ts` across categories: `Safety`, `Telemetry`, `Gaming`, `Power`, `Debloat`, `Cleanup`, `Preferences`.
- Tweak tiers: `risk: "safe"` (enabled by default) vs `risk: "advanced"` (requires user confirmation before enabling).
- Instant search filter and category toggles.

### 3. Reversible Tweak Engine (`src-tauri/src/tweak_engine.rs`)
- Before applying reversible tweaks, snapshots original registry values into `%APPDATA%\1boost\backups\<tweak_id>.json`.
- `undo_tweak` restores original registry values, runs `undo_script`, and removes backup.
- `revert_all_tweaks` restores all previously modified keys to original Windows defaults.

### 4. System Utilities Hub (`UtilitiesTab.tsx`, `src-tauri/src/utilities.rs`)
- **DNS Switcher**: 9 presets (Cloudflare, Google, Quad9, AdGuard, OpenDNS, CleanBrowsing, ControlD, DNS.SB, DHCP Reset) with active detection and IPv4/IPv6 support.
- **Windows Update Modes**: Default, Security-only, and Disable (with explicit confirmation).
- **System Fixes**: Network reset, Windows Update reset, DISM health scan, NTP time sync, Explorer restart.
- **Windows Features**: .NET, WSL, Hyper-V, Legacy Media, Windows Sandbox, NFS, Registry Backup.
- **WinGet Software Manager**: 48 curated developer & gaming tools with search and one-click upgrade all.

### 5. Execution Console (`ExecutionConsole.tsx`)
- Real-time PowerShell log stream with timestamp, log level (info, success, warning, error), and step-level filtering.

### 6. Settings & Security (`SettingsView.tsx`, `AppLockScreen.tsx`)
- Language selector: English (EN) & Português (PT-BR).
- Password App Lock with cryptographic hash comparison.
- Minimize to System Tray and Parallax Stars visual toggle.
- Auto System Restore Point toggle and reset tweaks to default.

---

## Key Files

```
src-tauri/src/lib.rs           # Tauri commands, PowerShell executor, event streams
src-tauri/src/script_safety.rs # Static analysis engine (+ unit tests)
src-tauri/src/tweak_engine.rs  # Reversible tweak engine: registry snapshots, backup/undo (+ unit tests)
src-tauri/src/utilities.rs     # DNS/update modes/system fixes/features/WinGet commands
src/constants/tweaks.ts        # 52 optimization definitions (PowerShell + undo metadata, safe/advanced tiers)
src/constants/utilities.ts     # DNS presets and curated WinGet package definitions
src/components/                # TitleBar, DashboardView, TweakGrid, UtilitiesTab, ExecutionConsole, SettingsView
src/services/tweakEngine.ts    # Reversible engine bindings (undo/revert-all)
src/services/utilities.ts      # Utilities IPC wrappers (DNS, Updates, Fixes, Features, WinGet)
.agents/skills/caveman/        # Caveman prompt & token compression skill
.agents/skills/ponytail/       # Ponytail Lazy Senior Developer code minimalism skill
.agents/rules/                 # Workspace rules for Caveman and Ponytail
```

---

## Verification Commands

```bash
npm run build                          # TypeScript + Vite production build
cd src-tauri && cargo check            # Rust backend type check
cd src-tauri && cargo test             # Rust safety & tweak engine unit tests
```
