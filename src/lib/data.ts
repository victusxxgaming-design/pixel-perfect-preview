export type Platform = "pc" | "ios" | "android" | "other";

export const PLATFORMS: { id: Platform; label: string; blurb: string }[] = [
  { id: "pc", label: "PC", blurb: "Emulator & desktop addons" },
  { id: "ios", label: "iOS", blurb: "iPhone & iPad builds" },
  { id: "android", label: "Android", blurb: "APK-ready packages" },
  { id: "other", label: "Other", blurb: "Tools, packs & utilities" },
];

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  platform: Platform;
  version: string;
  released: string;
  stock: "in" | "low" | "out";
  hue: number;
  rating: number;
  sales: number;
  features: string[];
  notes: string[];
};

export const PRODUCTS: Product[] = [
  { slug: "obsidian-hud", name: "Obsidian HUD", tagline: "A clean, minimal interface overlay pack.", price: 14.99, platform: "pc", version: "4.2.1", released: "Oct 12, 2026", stock: "in", hue: 292, rating: 4.9, sales: 3120, features: ["12 HUD layouts", "Custom crosshair presets", "Low-overhead rendering", "One-click profile import"], notes: ["Improved 1440p scaling", "New compact minimap layout", "Fixed overlay flicker on resize"] },
  { slug: "nova-sensitivity", name: "Nova Sensitivity Suite", tagline: "Tuned sensitivity profiles for every device.", price: 9.99, platform: "android", version: "3.0.4", released: "Oct 8, 2026", stock: "in", hue: 250, rating: 4.8, sales: 5410, features: ["48 device profiles", "Gyro calibration helper", "Profile backup", "Quick switch widget"], notes: ["Added 6 new device profiles", "Faster calibration flow"] },
  { slug: "prism-skins-vault", name: "Prism Visual Vault", tagline: "Curated visual themes and lobby backdrops.", price: 19.99, platform: "ios", version: "2.7.0", released: "Oct 2, 2026", stock: "low", hue: 320, rating: 4.7, sales: 1980, features: ["40+ lobby backdrops", "Animated themes", "iPad-optimized", "Monthly drops"], notes: ["Autumn theme collection", "Reduced package size by 18%"] },
  { slug: "pulse-audio-pack", name: "Pulse Audio Pack", tagline: "Crisp, balanced in-game audio presets.", price: 7.49, platform: "other", version: "1.9.2", released: "Sep 28, 2026", stock: "in", hue: 200, rating: 4.6, sales: 2240, features: ["Footstep clarity EQ", "Headset presets", "Night mode", "Spatial balance"], notes: ["New open-back headset preset"] },
  { slug: "vector-macro-pad", name: "Vector Keymap Studio", tagline: "Remap and organize controls with precision.", price: 12.99, platform: "pc", version: "5.1.0", released: "Sep 21, 2026", stock: "in", hue: 270, rating: 4.8, sales: 2760, features: ["Visual key editor", "Per-profile layouts", "Export & share", "Conflict detection"], notes: ["Redesigned editor", "Shared layout codes"] },
  { slug: "halo-fps-booster", name: "Halo Performance Kit", tagline: "Smoother frames on mid-range devices.", price: 11.99, platform: "android", version: "2.4.3", released: "Sep 15, 2026", stock: "out", hue: 160, rating: 4.5, sales: 4100, features: ["Graphics presets", "Thermal-aware mode", "Background cleaner", "FPS overlay"], notes: ["Thermal mode tuning", "Android 16 support"] },
  { slug: "aurora-ui-ios", name: "Aurora Interface", tagline: "A refined interface theme for iOS.", price: 13.49, platform: "ios", version: "1.6.0", released: "Sep 9, 2026", stock: "in", hue: 305, rating: 4.7, sales: 1430, features: ["Rounded icon set", "Dynamic accents", "Dark-first palette", "Haptic presets"], notes: ["Dynamic accent sync"] },
  { slug: "drift-crosshair-lab", name: "Drift Crosshair Lab", tagline: "Design and test custom crosshairs.", price: 5.99, platform: "other", version: "3.3.1", released: "Aug 30, 2026", stock: "in", hue: 230, rating: 4.6, sales: 3380, features: ["200+ presets", "Live preview", "Color-blind palettes", "Export to profile"], notes: ["New color-blind palettes"] },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const platformLabel = (p: Platform) => PLATFORMS.find((x) => x.id === p)!.label;
export const money = (n: number) => `$${n.toFixed(2)}`;

export const FAQS = [
  { q: "How do I receive my purchase?", a: "Right after payment is confirmed, your activation key and the latest download appear on the order page and in your dashboard." },
  { q: "Do I get older versions?", a: "We only ship the latest stable version of each product. Updates within your license period are included." },
  { q: "Which payment methods are supported?", a: "Cards, PayPal, UPI and selected crypto options (shown at checkout)." },
  { q: "Is Vantix affiliated with the game publisher?", a: "No. Vantix is an independent store and is not affiliated with, endorsed or sponsored by any game publisher." },
  { q: "What if my key doesn't work?", a: "Open a ticket or reach us on Discord — our team replies within a few hours, every day." },
];

export const ORDERS = [
  { id: "VX-20481", date: "Oct 16, 2026", items: ["obsidian-hud"], total: 14.99, payment: "paid", key: "active" },
  { id: "VX-20377", date: "Oct 10, 2026", items: ["nova-sensitivity", "drift-crosshair-lab"], total: 15.98, payment: "paid", key: "active" },
  { id: "VX-20212", date: "Sep 29, 2026", items: ["pulse-audio-pack"], total: 7.49, payment: "pending", key: "pending" },
  { id: "VX-19987", date: "Aug 14, 2026", items: ["aurora-ui-ios"], total: 13.49, payment: "paid", key: "expired" },
  { id: "VX-19802", date: "Aug 2, 2026", items: ["halo-fps-booster"], total: 11.99, payment: "failed", key: "unavailable" },
] as const;

export const fakeKey = (seed: string) => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const parts: string[] = [];
  for (let i = 0; i < 4; i++) {
    let s = "";
    for (let j = 0; j < 5; j++) { h = (h * 1103515245 + 12345) >>> 0; s += chars[h % chars.length]; }
    parts.push(s);
  }
  return "DEMO-" + parts.join("-");
};
