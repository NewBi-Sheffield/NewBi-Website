import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const DELAY_MS = 2000; // be polite — 2s between requests

const CATEGORIES = [
  "Hair", "Lashes", "Brows", "Nails", "Barbering",
  "Makeup", "Braiding", "Massage", "Tattoos",
];

type Provider = {
  name: string;
  category: string;
  description: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  instagram: string;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function extractMeta(html: string, property: string): string {
  const match = html.match(
    new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]*)"`, "i")
  ) ?? html.match(
    new RegExp(`<meta[^>]+content="([^"]*)"[^>]+property="${property}"`, "i")
  );
  return match ? decodeHtmlEntities(match[1]) : "";
}

function decodeHtmlEntities(str: string) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function parseDisplayName(ogTitle: string): string {
  // Instagram og:title formats:
  //   "Name (@handle) • Instagram photos and videos"
  //   "Name (@handle) • Instagram"
  const match = ogTitle.match(/^(.+?)\s*\(@[^)]+\)/);
  return match ? match[1].trim() : ogTitle.replace(/\s*•.*$/, "").trim();
}

async function scrapeProfile(handle: string): Promise<{ name: string; description: string } | null> {
  const clean = handle.replace(/^@/, "");
  const url = `https://www.instagram.com/${clean}/`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      console.warn(`  [${handle}] HTTP ${res.status} — skipping`);
      return null;
    }

    const html = await res.text();

    if (html.includes("Log in to Instagram") || html.includes('"requiresLogin"')) {
      console.warn(`  [${handle}] Instagram returned login wall — skipping`);
      return null;
    }

    const ogTitle = extractMeta(html, "og:title");
    const ogDescription = extractMeta(html, "og:description");

    if (!ogTitle) {
      console.warn(`  [${handle}] Could not extract metadata — skipping`);
      return null;
    }

    return {
      name: parseDisplayName(ogTitle),
      description: ogDescription,
    };
  } catch (err) {
    console.warn(`  [${handle}] Fetch error: ${(err as Error).message} — skipping`);
    return null;
  }
}

async function main() {
  const handlesPath = join(__dirname, "handles.txt");
  const outputPath = join(__dirname, "providers.json");

  const lines = readFileSync(handlesPath, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));

  if (lines.length === 0) {
    console.error("No handles found in handles.txt");
    process.exit(1);
  }

  // Load existing providers so we don't lose any manual edits
  let existing: Provider[] = [];
  try {
    existing = JSON.parse(readFileSync(outputPath, "utf-8"));
  } catch {
    // no existing file, start fresh
  }

  const existingByHandle = new Map(existing.map((p) => [p.instagram.replace(/^@/, ""), p]));

  console.log(`Scraping ${lines.length} Instagram profile(s)...\n`);

  const results: Provider[] = [];

  for (const handle of lines) {
    const clean = handle.replace(/^@/, "");
    const ig = `@${clean}`;

    if (existingByHandle.has(clean)) {
      const existing_provider = existingByHandle.get(clean)!;
      // Only scrape if name/description look like placeholders
      if (existing_provider.name !== "?" && existing_provider.description !== "?") {
        console.log(`  [${ig}] Already in providers.json — skipping`);
        results.push(existing_provider);
        continue;
      }
    }

    console.log(`  [${ig}] Scraping...`);
    const data = await scrapeProfile(clean);

    if (data) {
      console.log(`    name: ${data.name}`);
      console.log(`    bio:  ${data.description.slice(0, 80)}${data.description.length > 80 ? "…" : ""}`);
    }

    const provider: Provider = {
      name: data?.name ?? ig,
      category: "Uncategorized", // <-- fill in manually or add logic
      description: data?.description ?? "",
      address: null,
      phone: null,
      email: null,
      instagram: ig,
    };

    results.push(provider);

    if (handle !== lines[lines.length - 1]) await sleep(DELAY_MS);
  }

  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} provider(s) to providers.json`);
  console.log(`\nValid categories: ${CATEGORIES.join(", ")}`);
  console.log('Set "category" for each provider, then run: npm run import-providers');
}

main();
