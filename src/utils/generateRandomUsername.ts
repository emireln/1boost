const PREFIXES = [
  "Cyber",
  "Apex",
  "Pulse",
  "Quantum",
  "Vortex",
  "Hyper",
  "Zero",
  "Shadow",
  "Nitro",
  "Phantom",
  "Titan",
  "Aero",
  "Starlight",
  "Zenith",
];

const SUFFIXES = [
  "Volt",
  "Core",
  "Boost",
  "Nova",
  "Strike",
  "Pulse",
  "Flow",
  "Rider",
  "Blade",
  "Shift",
  "Nexus",
  "Matrix",
  "Forge",
  "Surge",
];

export const generateRandomUsername = (): string => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10 to 99
  return `${prefix}${suffix}${num}`;
};
