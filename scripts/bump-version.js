import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Paths
const pkgPath = path.join(rootDir, "package.json");
const tauriConfPath = path.join(rootDir, "src-tauri", "tauri.conf.json");
const cargoPath = path.join(rootDir, "src-tauri", "Cargo.toml");

function bumpPatchVersion(versionStr) {
  const parts = versionStr.split(".").map(Number);
  if (parts.length === 3 && !parts.some(isNaN)) {
    parts[2] += 1;
    return parts.join(".");
  }
  return versionStr;
}

try {
  // 1. Read package.json
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const currentVer = pkg.version || "1.1.9";
  const newVer = bumpPatchVersion(currentVer);

  pkg.version = newVer;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`[1boost Version Bump] package.json updated to ${newVer}`);

  // 2. Read src-tauri/tauri.conf.json
  if (fs.existsSync(tauriConfPath)) {
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, "utf-8"));
    tauriConf.version = newVer;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + "\n");
    console.log(`[1boost Version Bump] tauri.conf.json updated to ${newVer}`);
  }

  // 3. Read src-tauri/Cargo.toml
  if (fs.existsSync(cargoPath)) {
    let cargoContent = fs.readFileSync(cargoPath, "utf-8");
    cargoContent = cargoContent.replace(/version\s*=\s*"[^"]+"/, `version = "${newVer}"`);
    fs.writeFileSync(cargoPath, cargoContent);
    console.log(`[1boost Version Bump] Cargo.toml updated to ${newVer}`);
  }
} catch (err) {
  console.error("Failed to bump version:", err);
}
