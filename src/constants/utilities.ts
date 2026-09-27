// Curated WinGet app catalog (48 apps; local initial avatars)

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
}

export const CURATED_APPS: CuratedApp[] = [
  // --- BROWSERS ---
  { id: "Brave.Brave", name: "Brave Browser", category: "Browsers" },
  { id: "Google.Chrome", name: "Google Chrome", category: "Browsers" },
  { id: "Mozilla.Firefox", name: "Mozilla Firefox", category: "Browsers" },
  { id: "Opera.Opera", name: "Opera Browser", category: "Browsers" },

  // --- GAMING ---
  { id: "Valve.Steam", name: "Steam", category: "Gaming" },
  { id: "EpicGames.EpicGamesLauncher", name: "Epic Games Launcher", category: "Gaming" },
  { id: "Discord.Discord", name: "Discord", category: "Gaming" },
  { id: "Blizzard.BattleNet", name: "Battle.net", category: "Gaming" },
  { id: "EA.EADesktop", name: "EA App", category: "Gaming" },
  { id: "GOG.Galaxy", name: "GOG Galaxy", category: "Gaming" },
  { id: "itch.itch", name: "itch.io", category: "Gaming" },

  // --- MEDIA ---
  { id: "OBSProject.OBSStudio", name: "OBS Studio", category: "Media" },
  { id: "Spotify.Spotify", name: "Spotify", category: "Media" },
  { id: "VideoLAN.VLC", name: "VLC Media Player", category: "Media" },
  { id: "clsid2.mpc-hc", name: "Media Player Classic", category: "Media" },
  { id: "PeterPawlowski.foobar2000", name: "foobar2000", category: "Media" },
  { id: "Audacity.Audacity", name: "Audacity", category: "Media" },
  { id: "HandBrake.HandBrake", name: "HandBrake", category: "Media" },

  // --- DEV ---
  { id: "Microsoft.VisualStudioCode", name: "VS Code", category: "Dev" },
  { id: "Notepad++.Notepad++", name: "Notepad++", category: "Dev" },
  { id: "Git.Git", name: "Git", category: "Dev" },
  { id: "GitHub.GitHubDesktop", name: "GitHub Desktop", category: "Dev" },
  { id: "Docker.DockerDesktop", name: "Docker Desktop", category: "Dev" },
  { id: "OpenJS.NodeJS", name: "Node.js", category: "Dev" },
  { id: "Python.Python.3.12", name: "Python 3.12", category: "Dev" },
  { id: "Rustlang.Rustup", name: "Rust (rustup)", category: "Dev" },
  { id: "Postman.Postman", name: "Postman", category: "Dev" },
  { id: "Microsoft.WindowsTerminal", name: "Windows Terminal", category: "Dev" },

  // --- UTILITIES ---
  { id: "7zip.7zip", name: "7-Zip", category: "Utilities" },
  { id: "ShareX.ShareX", name: "ShareX", category: "Utilities" },
  { id: "CPUID.CPU-Z", name: "CPU-Z", category: "Utilities" },
  { id: "TechPowerUp.GPU-Z", name: "GPU-Z", category: "Utilities" },
  { id: "Microsoft.PowerToys", name: "Microsoft PowerToys", category: "Utilities" },
  { id: "voidtools.Everything", name: "Everything", category: "Utilities" },
  { id: "REALiX.HWiNFO", name: "HWiNFO", category: "Utilities" },
  { id: "Rufus.Rufus", name: "Rufus", category: "Utilities" },
  { id: "CrystalDewWorld.CrystalDiskInfo", name: "CrystalDiskInfo", category: "Utilities" },
  { id: "Bitsum.ProcessLasso", name: "Process Lasso", category: "Utilities" },

  // --- SECURITY ---
  { id: "Bitwarden.Bitwarden", name: "Bitwarden", category: "Security" },
  { id: "KeePassXCTeam.KeePassXC", name: "KeePassXC", category: "Security" },
  { id: "Malwarebytes.Malwarebytes", name: "Malwarebytes", category: "Security" },
  { id: "ProtonTechnologies.ProtonVPN", name: "Proton VPN", category: "Security" },
  { id: "OpenVPNTechnologies.OpenVPN", name: "OpenVPN", category: "Security" },

  // --- COMMUNICATION ---
  { id: "SlackTechnologies.Slack", name: "Slack", category: "Communication" },
  { id: "Zoom.Zoom", name: "Zoom", category: "Communication" },
  { id: "Telegram.TelegramDesktop", name: "Telegram Desktop", category: "Communication" },

  // --- OFFICE ---
  { id: "TheDocumentFoundation.LibreOffice", name: "LibreOffice", category: "Office" },
  { id: "SumatraPDF.SumatraPDF", name: "SumatraPDF", category: "Office" },
];
