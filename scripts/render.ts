// Static review pages, not a second app renderer. Pinned app behavior and theme:
// https://github.com/Undefined6799/unset/tree/0dd079517074917ebd5217f7ecf15f4984cdd5d3/apps/web/lib/components/profile
// Current mode reflects the shipped text/link/button renderer; media mode demonstrates schema-supported imagery.
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { cidOf } from "./blob.ts";

type Obj = Record<string, any>;
export type Mode = "current" | "media";
export type Recipe = { id: string; dir: string; manifest: Obj; profile: Obj; cards: Obj[]; assets: Map<string, string> };
const root = join(import.meta.dirname, "..");
const out = join(root, "dist");
const PRESET: Record<string, string> = { "book-call": "Book a call", hire: "Hire me", subscribe: "Subscribe" };
const DIRECTIONS: Record<string, string> = {
  journalist: "Editorial desk", photographer: "Photo essay", creator: "Channel guide", freelancer: "Service menu",
  developer: "Project index", musician: "Release catalogue", artist: "Studio portfolio", writer: "Bookshelf",
  podcaster: "Listening guide", "small-business": "Shop window", researcher: "Research notebook",
  coach: "Course guide", speaker: "Speaker dossier", "job-seeker": "Selected experience", nonprofit: "Community noticeboard",
};
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
function webHref(uri: unknown): string | null {
  if (typeof uri !== "string") return null;
  try { const u = new URL(uri); return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password ? esc(u.href) : null; }
  catch { return null; }
}
function host(uri: unknown): string { try { return new URL(String(uri)).hostname.replace(/^www\./, ""); } catch { return ""; } }
const rel = 'rel="nofollow ugc noopener noreferrer"';
const layoutOf = (layout: unknown, fallback: string) => ["list", "grid", "carousel"].includes(String(layout)) ? String(layout) : fallback;
const linkText = (uri: unknown) => { try { const u = new URL(String(uri)); return `${host(uri)}${u.pathname.replace(/\/+$/, "")}`; } catch { return ""; } };

function loadRecipes(): Recipe[] {
  return readdirSync(join(root, "recipes")).filter(id => statSync(join(root, "recipes", id)).isDirectory()).map(id => {
    const dir = join(root, "recipes", id);
    const read = (f: string) => JSON.parse(readFileSync(join(dir, f), "utf8"));
    const manifest = read("recipe.json");
    const assets = new Map<string, string>();
    if (existsSync(join(dir, "assets"))) for (const f of readdirSync(join(dir, "assets"))) assets.set(cidOf(readFileSync(join(dir, "assets", f))), f);
    return { id, dir, manifest, profile: read("profile.json"), cards: manifest.cards.map((c: Obj) => read(c.file)), assets };
  });
}
function picture(r: Recipe, blob: Obj | undefined, alt: unknown, cls: string, ratio?: Obj): string {
  const file = blob?.ref?.$link ? r.assets.get(blob.ref.$link) : undefined;
  const dimensions = ratio && Number.isInteger(ratio.width) && Number.isInteger(ratio.height) && ratio.width > 0 && ratio.height > 0
    ? ` width="${ratio.width}" height="${ratio.height}"` : "";
  return file ? `<img class="${cls}" src="${esc(r.id)}/${esc(file)}" alt="${esc(alt)}"${dimensions}>` : "";
}
// A deliberately small escaped subset used by these samples, not a general CommonMark implementation.
function markdown(text: string): string {
  const inline = (s: string) => {
    let html = "", end = 0;
    for (const match of s.matchAll(/\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)) {
      html += esc(s.slice(end, match.index));
      const href = webHref(match[3]);
      html += match[1] !== undefined ? `<strong>${esc(match[1])}</strong>`
        : href ? `<a href="${href}" ${rel}>${esc(match[2])}</a>` : esc(match[0]);
      end = match.index + match[0].length;
    }
    return html + esc(s.slice(end));
  };
  return text.split(/\n{2,}/).map(block => {
    const lines = block.split("\n");
    if (lines.every(l => l.startsWith("- "))) return `<ul>${lines.map(l => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
    if (/^#{1,3} /.test(block) && lines.length === 1) return `<h2>${inline(block.replace(/^#+ /, ""))}</h2>`;
    if (lines.every(l => l.startsWith("> "))) return `<blockquote>${lines.map(l => inline(l.slice(2))).join("<br>")}</blockquote>`;
    return `<p>${lines.map(inline).join("<br>")}</p>`;
  }).join("");
}
function listHead(title: unknown, length: number, noun: string, layout: string): string {
  return `<div class="list-head">${title ? `<h2>${esc(title)}</h2>` : ""}<p class="count">${length} ${noun}${layout === "list" && length > 4 ? " · Scroll for more" : ""}${layout === "carousel" && length > 1 ? '<span class="scroll-hint"> · Scroll sideways</span>' : ""}</p></div>`;
}
function listWrap(body: string, layout: string, length: number): string {
  return `<div class="${layout === "carousel" ? `carousel tier-${Math.min(length, 5)}` : layout === "list" && length > 4 ? "scroll-list" : "list-wrap"}"${layout === "carousel" || length > 4 ? ' tabindex="0" role="group" aria-label="Scrollable items"' : ""}>${body}</div>`;
}
export function cardBody(r: Recipe, c: Obj, mode: Mode): string {
  const kind = c.$type;
  if (kind === "sh.unset.block.text") return `<div class="md">${markdown(c.text)}</div>`;
  if (kind === "sh.unset.block.images") {
    if (mode === "current") return "";
    return `${c.title ? `<h2>${esc(c.title)}</h2>` : ""}<div class="gallery ${c.images.length === 1 ? "single" : ""}">${c.images.map((g: Obj) => `<figure>${picture(r, g.image, g.alt, `pic ${c.fit === "cover" ? "cover" : "contain"}`, g.aspectRatio)}${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`;
  }
  if (kind === "sh.unset.block.links" || kind === "sh.unset.block.showcase") {
    const links = kind.endsWith(".links");
    const layout = layoutOf(c.layout, links ? "list" : "carousel");
    const items: Obj[] = links ? c.items.filter((item: Obj) => webHref(item.uri)) : c.items;
    const entries = items.map(e => {
      const href = webHref(e.uri);
      const cover = mode === "media" && e.image ? picture(r, e.image.image, e.image.alt, "entry-image", e.image.aspectRatio) : "";
      const body = links
        ? `<span class="link-body"><span class="link-title">${esc(e.label || linkText(e.uri))}</span>${e.description ? `<span class="description">${esc(e.description)}</span>` : ""}</span>${e.label ? `<span class="host">${esc(host(e.uri))}</span>` : ""}`
        : `${cover}${e.tag ? `<span class="tag">${esc(e.tag)}</span>` : ""}<h3${href ? ' class="link-title"' : ""}>${esc(e.title)}</h3>${e.description ? `<p class="description">${esc(e.description)}</p>` : ""}`;
      return `<li>${href ? `<a class="entry ${links ? "link-entry" : ""}" href="${href}" ${rel}>${body}</a>` : `<div class="entry">${body}</div>`}</li>`;
    }).join("");
    return listHead(c.title, items.length, links ? "links" : "entries", layout) + listWrap(`<ul class="entries ${layout}${links ? " links" : ""}">${entries}</ul>`, layout, items.length);
  }
  if (kind === "sh.unset.block.buttons") {
    const addresses: string[] = [];
    const buttons = c.buttons.flatMap((b: Obj) => {
      if (b.$type === "sh.unset.block.buttons#email") {
        if (typeof b.address !== "string" || !/^[\w.+-]+@(?:[\w-]+\.)+[\w-]+$/.test(b.address)) return [];
        addresses.push(b.address);
        return [{ href: `mailto:${encodeURIComponent(b.address)}`, label: "Email me" }];
      }
      if (b.$type !== "sh.unset.block.buttons#link") return [];
      const href = webHref(b.uri);
      const label = Object.hasOwn(PRESET, b.preset) ? PRESET[b.preset] : typeof b.label === "string" && b.label.trim() ? b.label : "Open link";
      return href ? [{ href, label }] : [];
    });
    return `<span class="eyebrow">Contact</span>${c.heading ? `<h2>${esc(c.heading)}</h2>` : ""}${c.text ? `<p class="pitch">${esc(c.text)}</p>` : ""}<div class="buttons">${buttons.map((b: Obj, i: number) => `<a class="btn${i === 0 ? " primary" : ""}" href="${b.href}" ${rel}>${esc(b.label)}</a>`).join("")}</div>${addresses.length ? `<p class="addresses">${addresses.map(esc).join(" · ")}</p>` : ""}`;
  }
  return "";
}
function page(title: string, body: string, cls = ""): string {
  return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'"><title>${esc(title)}</title><link rel="stylesheet" href="style.css"></head><body class="${cls}">${body}</body></html>\n`;
}
export function recipePage(r: Recipe, mode: Mode): string {
  const p = r.profile;
  const hasMedia = r.cards.some(c => c.content.$type === "sh.unset.block.images" || c.content.items?.some((e: Obj) => e.image));
  const shape = p.avatarShape === "rounded-square" ? "rounded-square" : "round";
  const avatar = mode === "media" ? picture(r, p.avatar, "", `avatar ${shape}`) : "";
  const cards = r.cards.map(card => {
    const body = cardBody(r, card.content, mode);
    const kind = String(card.content.$type).split(".").at(-1);
    const surface = ["filled", "outlined", "plain"].includes(card.surface) ? card.surface : "filled";
    return body ? `<section class="card ${card.width === "half" ? "half" : "full"} ${surface} kind-${kind}">${body}</section>` : "";
  }).join("");
  const about = `<section id="about" popover="auto" class="about" aria-labelledby="about-title"><div class="about-head"><h2 id="about-title">About</h2><button popovertarget="about" popovertargetaction="hide">Close</button></div>${p.headline ? `<p class="headline">${esc(p.headline)}</p>` : ""}<dl>${p.location ? `<div><dt>Place</dt><dd>${esc(p.location)}</dd></div>` : ""}${webHref(p.website) ? `<div><dt>Web</dt><dd><a href="${webHref(p.website)}" ${rel}>${esc(host(p.website))}</a></dd></div>` : ""}</dl></section>`;
  return page(`${r.manifest.title} · ${mode === "current" ? "Current app" : "Media study"}`, `<div class="preview-tools"><a class="wordmark" href="index.html">unset<span> / recipes</span></a><nav aria-label="Preview mode"><a href="${esc(r.id)}.html"${mode === "current" ? ' aria-current="page"' : ""}>Current app</a><a href="${esc(r.id)}-media.html"${mode === "media" ? ' aria-current="page"' : ""}>Media study</a></nav></div><div class="preview-note"><span>${esc(DIRECTIONS[r.id] ?? r.manifest.title)}</span><p>${mode === "media" ? "Schema-supported images and avatars; not rendered by the pinned app. Layout study, not a shipping screenshot." : "Approximation of the pinned app. Avatar opens About; image blocks and item pictures are omitted."}</p></div><main class="profile-page"><header class="profile"><button class="avatar-button ${shape}" popovertarget="about" aria-label="About ${esc(p.displayName)}">${avatar || `<span class="avatar initial ${shape}" aria-hidden="true">${esc([...String(p.displayName ?? "?")][0])}</span>`}<span class="disclosure" aria-hidden="true">⌄</span></button><h1>${esc(p.displayName)}</h1></header>${about}<div class="cards">${cards}</div></main><footer><span>Invented sample · ${esc(r.manifest.title)} · v${esc(r.manifest.version)}</span><a href="${esc(r.id)}/GUIDE.md">Read the recipe guide</a>${hasMedia && mode === "current" ? '<span>Image composition is shown in the media study.</span>' : ""}</footer>`);
}
function indexPage(recipes: Recipe[]): string {
  const items = recipes.map((r, i) => `<article class="recipe"><a class="recipe-image" href="${r.id}-media.html" aria-label="Open ${esc(r.manifest.title)} media study"><img src="${r.id}/preview-media.png" alt="${esc(r.manifest.title)} layout study" loading="lazy"></a><div class="recipe-caption"><span class="eyebrow">${String(i + 1).padStart(2, "0")} / ${esc(DIRECTIONS[r.id])}</span><h2>${esc(r.manifest.title)}</h2><p>${esc(r.manifest.summary)}</p><div class="recipe-actions"><a href="${r.id}.html">Current app</a><a href="${r.id}-media.html">Media study</a><a href="${r.id}/preview-mobile.png">Mobile</a><a href="${r.id}/preview-media-mobile.png">Media mobile</a></div></div></article>`).join("");
  return page("Profile recipes · Layout studies", `<header class="catalogue-head"><a class="wordmark" href="index.html">unset<span> / recipes</span></a><p class="eyebrow">15 recipes · One profile system</p><h1>A place for<br>what you do.</h1><p class="catalogue-deck">Editorial desks, studio portfolios, bookshelves and community boards. Different ways to tell your story with the same small set of cards.</p><p class="catalogue-note">Each recipe has a current-app approximation and a media study. Media studies include schema-supported images that the pinned app does not yet render. All content and images are invented samples. All assets are local.</p></header><main class="index">${items}</main><footer>Profile recipes · source records, guides and upstream schema copies included · no third-party embeds</footer>`, "catalogue");
}
export function render(): void {
  const recipes = loadRecipes();
  mkdirSync(out, { recursive: true });
  cpSync(join(root, "site", "fonts"), join(out, "fonts"), { recursive: true });
  copyFileSync(join(root, "site", "style.css"), join(out, "style.css"));
  for (const r of recipes) {
    mkdirSync(join(out, r.id), { recursive: true });
    for (const file of r.assets.values()) copyFileSync(join(r.dir, "assets", file), join(out, r.id, file));
    copyFileSync(join(r.dir, "GUIDE.md"), join(out, r.id, "GUIDE.md"));
    for (const preview of ["preview.png", "preview-mobile.png", "preview-media.png", "preview-media-mobile.png"]) if (existsSync(join(r.dir, preview))) copyFileSync(join(r.dir, preview), join(out, r.id, preview));
    for (const mode of ["current", "media"] as const) writeFileSync(join(out, `${r.id}${mode === "media" ? "-media" : ""}.html`), recipePage(r, mode));
  }
  writeFileSync(join(out, "index.html"), indexPage(recipes));
  console.log(`rendered ${recipes.length} recipes in current and media modes to dist/`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) render();
