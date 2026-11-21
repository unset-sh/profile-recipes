// Renders each recipe's sample records to a static page in dist/, plus an index of all recipes. These pages are an
// approximation for browsing and for preview.png: the unset.sh app is the real renderer, and its look wins. Colours
// and fonts follow the app's theme (Undefined6799/unset shared/ui/theme.css @ 4abcada); button words follow its
// apps/web/lib/profile/messages.ts CARD_TEXT. Every string from a record is escaped before it reaches the page.
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cidOf } from "./blob.ts";

type Obj = Record<string, any>;
type Recipe = { id: string; dir: string; manifest: Obj; profile: Obj; cards: Obj[]; assets: Map<string, string> };

const root = join(import.meta.dirname, "..");
const out = join(root, "dist");
const PRESET: Record<string, string> = { bookCall: "Book a call", hire: "Hire me", subscribe: "Subscribe", custom: "Open link" };

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const safeHref = (uri: unknown) => (typeof uri === "string" && /^https?:\/\//i.test(uri) ? esc(uri) : "#");
const host = (uri: string) => {
  try {
    return new URL(uri).hostname.replace(/^www\./, "");
  } catch {
    return uri;
  }
};

function loadRecipes(): Recipe[] {
  const dir = join(root, "recipes");
  return readdirSync(dir)
    .filter((id) => statSync(join(dir, id)).isDirectory())
    .map((id) => {
      const rdir = join(dir, id);
      const read = (f: string) => JSON.parse(readFileSync(join(rdir, f), "utf8"));
      const manifest = read("recipe.json");
      const assets = new Map<string, string>();
      const adir = join(rdir, "assets");
      if (existsSync(adir)) for (const f of readdirSync(adir)) assets.set(cidOf(readFileSync(join(adir, f))), f);
      return { id, dir: rdir, manifest, profile: read("profile.json"), cards: manifest.cards.map((c: Obj) => read(c.file)), assets };
    });
}

function picture(r: Recipe, blob: Obj | undefined, alt: unknown, cls: string): string {
  const file = blob?.ref?.$link ? r.assets.get(blob.ref.$link) : undefined;
  return file ? `<img class="${cls}" src="${r.id}/${esc(file)}" alt="${esc(alt)}">` : "";
}

/** Just enough CommonMark for the samples: paragraphs, bullet lists, **bold**. No raw HTML, as in the app. */
function markdown(text: string): string {
  const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n");
      if (lines.every((l) => l.startsWith("- "))) return `<ul>${lines.map((l) => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
      return `<p>${lines.map(inline).join("<br>")}</p>`;
    })
    .join("");
}

function cardBody(r: Recipe, c: Obj): string {
  const kind = String(c.$type).replace("sh.unset.section#", "");
  const title = c.title ? `<h2>${esc(c.title)}</h2>` : "";
  switch (kind) {
    case "readme":
      return `<div class="md">${markdown(c.text)}</div>`;
    case "links":
      return `${title}<div class="links ${esc(c.layout ?? "list")}">${c.items
        .map((l: Obj) => `<a class="link" href="${safeHref(l.uri)}"><span class="host">${esc(host(l.uri))}</span><span>${esc(l.label ?? new URL(l.uri).pathname.replace(/^\//, ""))}</span>${l.description ? `<small>${esc(l.description)}</small>` : ""}</a>`)
        .join("")}</div>`;
    case "collection":
      return `${title}<div class="entries ${esc(c.layout ?? "carousel")}">${c.items
        .map((e: Obj) => `<a class="entry" href="${safeHref(e.uri)}">${picture(r, e.image?.image, e.image?.alt, "cover")}${e.tag ? `<span class="tag">${esc(e.tag)}</span>` : ""}<strong>${esc(e.title)}</strong>${e.description ? `<small>${esc(e.description)}</small>` : ""}</a>`)
        .join("")}</div>`;
    case "buttons":
      return `<span class="eyebrow">Contact</span><h2>${esc(c.heading)}</h2>${c.text ? `<p>${esc(c.text)}</p>` : ""}<div class="buttons">${c.buttons
        .map((b: Obj, i: number) => {
          const cls = i === 0 ? "btn primary" : "btn";
          if (b.$type?.endsWith("#emailButton")) return `<span class="${cls}">Email me</span>`;
          const label = b.preset === "custom" || !(b.preset in PRESET) ? (b.label ?? PRESET.custom) : PRESET[b.preset];
          return `<a class="${cls}" href="${safeHref(b.uri)}">${esc(label)}</a>`;
        })
        .join("")}</div>`;
    case "image":
      return `${picture(r, c.image, c.image?.alt, `pic ${esc(c.fit ?? "contain")}`)}${c.caption ? `<small>${esc(c.caption)}</small>` : ""}`;
    case "gallery":
      return `${title}<div class="gallery">${c.images
        .map((g: Obj) => `<figure>${picture(r, g.image?.image, g.image?.alt, `pic ${esc(g.fit ?? "contain")}`)}${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ""}</figure>`)
        .join("")}</div>`;
    default:
      return ""; // A kind this preview does not know is hidden, as in the app.
  }
}

function recipePage(r: Recipe): string {
  const p = r.profile;
  const cards = r.cards
    .map((card) => `<section class="card ${esc(card.width ?? "full")} ${esc(card.surface ?? "filled")}">${cardBody(r, card.content)}</section>`)
    .join("");
  const meta = [p.location, p.website ? host(p.website) : ""].filter(Boolean).map(esc).join(" · ");
  return page(
    `${esc(r.manifest.title)} recipe`,
    `<header class="profile">${picture(r, p.avatar, "", `avatar ${esc(p.avatarShape ?? "round")}`)}<div><h1>${esc(p.displayName)}</h1><p class="headline">${esc(p.headline)}</p><p class="meta">${meta}</p></div></header><main class="cards">${cards}</main><footer>Sample data · ${esc(r.manifest.title)} recipe v${esc(r.manifest.version)} · approximate preview</footer>`,
  );
}

function indexPage(recipes: Recipe[]): string {
  const items = recipes
    .map((r) => `<a class="recipe" href="${esc(r.id)}.html"><img src="${esc(r.id)}/preview.png" alt=""><strong>${esc(r.manifest.title)}</strong><small>${esc(r.manifest.summary)}</small></a>`)
    .join("");
  return page("unset.sh profile recipes", `<header class="intro"><h1>Profile recipes</h1><p class="headline">Ready-made unset.sh profile layouts, with guides an AI can follow.</p></header><main class="index">${items}</main>`);
}

const page = (title: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src 'self'; style-src 'self'; font-src 'self'">
<title>${title}</title><link rel="stylesheet" href="style.css"></head><body>${body}</body></html>
`;

const recipes = loadRecipes();
mkdirSync(out, { recursive: true });
cpSync(join(root, "site", "fonts"), join(out, "fonts"), { recursive: true });
copyFileSync(join(root, "site", "style.css"), join(out, "style.css"));
for (const r of recipes) {
  mkdirSync(join(out, r.id), { recursive: true });
  for (const file of r.assets.values()) copyFileSync(join(r.dir, "assets", file), join(out, r.id, file));
  const preview = join(r.dir, r.manifest.preview ?? "preview.png");
  if (existsSync(preview)) copyFileSync(preview, join(out, r.id, "preview.png"));
  writeFileSync(join(out, `${r.id}.html`), recipePage(r));
}
writeFileSync(join(out, "index.html"), indexPage(recipes));
console.log(`rendered ${recipes.length} recipe(s) to dist/`);
