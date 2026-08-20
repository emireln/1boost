// Curated WinGet app catalog (48 apps with official logo sources)

export type AppCategory =
  | "Browsers"
  | "Gaming"
  | "Media"
  | "Dev"
  | "Utilities"
  | "Security"
  | "Communication"
  | "Office";

export interface CuratedApp {
  id: string;
  name: string;
  category: AppCategory;
  /** Official website used to resolve the app logo favicon. */
  domain: string;
}

/** Official brand icon via Google favicon service (https, works in WebView2). */
export const APP_LOGO_URL = (domain: string, size = 128): string =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;

export const CURATED_APPS: CuratedApp[] = [
  // --- BROWSERS ---
  { id: "Brave.Brave", name: "Brave Browser", category: "Browsers", domain: "brave.com" },
  { id: "Google.Chrome", name: "Google Chrome", category: "Browsers", domain: "google.com" },
  { id: "Mozilla.Firefox", name: "Mozilla Firefox", category: "Browsers", domain: "mozilla.org" },
  { id: "Opera.Opera", name: "Opera Browser", category: "Browsers", domain: "opera.com" },

  // --- GAMING ---
  { id: "Valve.Steam", name: "Steam", category: "Gaming", domain: "store.steampowered.com" },
  { id: "EpicGames.EpicGamesLauncher", name: "Epic Games Launcher", category: "Gaming", domain: "epicgames.com" },
  { id: "Discord.Discord", name: "Discord", category: "Gaming", domain: "discord.com" },
  { id: "Blizzard.BattleNet", name: "Battle.net", category: "Gaming", domain: "battle.net" },
  { id: "EA.EADesktop", name: "EA App", category: "Gaming", domain: "ea.com" },
  { id: "GOG.Galaxy", name: "GOG Galaxy", category: "Gaming", domain: "gog.com" },
  { id: "itch.itch", name: "itch.io", category: "Gaming", domain: "itch.io" },

  // --- MEDIA ---
  { id: "OBSProject.OBSStudio", name: "OBS Studio", category: "Media", domain: "obsproject.com" },
  { id: "Spotify.Spotify", name: "Spotify", category: "Media", domain: "spotify.com" },
  { id: "VideoLAN.VLC", name: "VLC Media Player", category: "Media", domain: "videolan.org" },
  { id: "clsid2.mpc-hc", name: "Media Player Classic", category: "Media", domain: "mpc-hc.org" },
  { id: "PeterPawlowski.foobar2000", name: "foobar2000", category: "Media", domain: "foobar2000.org" },
  { id: "Audacity.Audacity", name: "Audacity", category: "Media", domain: "audacityteam.org" },
  { id: "HandBrake.HandBrake", name: "HandBrake", category: "Media", domain: "handbrake.fr" },

  // --- DEV ---
  { id: "Microsoft.VisualStudioCode", name: "VS Code", category: "Dev", domain: "code.visualstudio.com" },
  { id: "Notepad++.Notepad++", name: "Notepad++", category: "Dev", domain: "notepad-plus-plus.org" },
  { id: "Git.Git", name: "Git", category: "Dev", domain: "git-scm.com" },
  { id: "GitHub.GitHubDesktop", name: "GitHub Desktop", category: "Dev", domain: "github.com" },
  { id: "Docker.DockerDesktop", name: "Docker Desktop", category: "Dev", domain: "docker.com" },
  { id: "OpenJS.NodeJS", name: "Node.js", category: "Dev", domain: "nodejs.org" },
  { id: "Python.Python.3.12", name: "Python 3.12", category: "Dev", domain: "python.org" },
  { id: "Rustlang.Rustup", name: "Rust (rustup)", category: "Dev", domain: "rust-lang.org" },
  { id: "Postman.Postman", name: "Postman", category: "Dev", domain: "postman.com" },
  { id: "Microsoft.WindowsTerminal", name: "Windows Terminal", category: "Dev", domain: "microsoft.com" },

  // --- UTILITIES ---
  { id: "7zip.7zip", name: "7-Zip", category: "Utilities", domain: "7-zip.org" },
  { id: "ShareX.ShareX", name: "ShareX", category: "Utilities", domain: "getsharex.com" },
  { id: "CPUID.CPU-Z", name: "CPU-Z", category: "Utilities", domain: "cpuid.com" },
  { id: "TechPowerUp.GPU-Z", name: "GPU-Z", category: "Utilities", domain: "techpowerup.com" },
  { id: "Microsoft.PowerToys", name: "Microsoft PowerToys", category: "Utilities", domain: "microsoft.com" },
  { id: "voidtools.Everything", name: "Everything", category: "Utilities", domain: "voidtools.com" },
  { id: "REALiX.HWiNFO", name: "HWiNFO", category: "Utilities", domain: "hwinfo.com" },
  { id: "Rufus.Rufus", name: "Rufus", category: "Utilities", domain: "rufus.ie" },
  { id: "CrystalDewWorld.CrystalDiskInfo", name: "CrystalDiskInfo", category: "Utilities", domain: "crystalmark.info" },
  { id: "Bitsum.ProcessLasso", name: "Process Lasso", category: "Utilities", domain: "bitsum.com" },

  // --- SECURITY ---
  { id: "Bitwarden.Bitwarden", name: "Bitwarden", category: "Security", domain: "bitwarden.com" },
  { id: "KeePassXCTeam.KeePassXC", name: "KeePassXC", category: "Security", domain: "keepassxc.org" },
  { id: "Malwarebytes.Malwarebytes", name: "Malwarebytes", category: "Security", domain: "malwarebytes.com" },
  { id: "ProtonTechnologies.ProtonVPN", name: "Proton VPN", category: "Security", domain: "protonvpn.com" },
  { id: "OpenVPNTechnologies.OpenVPN", name: "OpenVPN", category: "Security", domain: "openvpn.net" },

  // --- COMMUNICATION ---
  { id: "SlackTechnologies.Slack", name: "Slack", category: "Communication", domain: "slack.com" },
  { id: "Zoom.Zoom", name: "Zoom", category: "Communication", domain: "zoom.us" },
  { id: "Telegram.TelegramDesktop", name: "Telegram Desktop", category: "Communication", domain: "telegram.org" },

  // --- OFFICE ---
  { id: "TheDocumentFoundation.LibreOffice", name: "LibreOffice", category: "Office", domain: "libreoffice.org" },
  { id: "SumatraPDF.SumatraPDF", name: "SumatraPDF", category: "Office", domain: "sumatrapdfreader.org" },
];
