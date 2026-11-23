// The checks every recipe must pass. validate.ts runs them over recipes/; check.test.ts proves each one fails when it
// should. Samples use the vendored upstream schemas and the editor's stricter limits (limits.json).
// Rejecting unknown fields and union members is this repository's template policy, not an AT Protocol rule.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { jsonToLex, Lexicons, type LexiconDoc } from "@atproto/lexicon";
import { cidOf, jpegFacts } from "./blob.ts";

export type Problem = string;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Obj = { [key: string]: Json };
type Def = {
  type: string;
  ref?: string;
  refs?: string[];
  items?: Def;
  accept?: string[];
  maxSize?: number;
  record?: { properties: Record<string, Def> };
  properties?: Record<string, Def>;
};

export type Limits = {
  profile: { headlineGraphemes: number };
  textBytes: number;
  cardListItems: Record<string, number>;
  sampleHosts: string[];
};

export type Context = { lexicons: Lexicons; docs: Map<string, LexiconDoc>; limits: Limits; lexiconCommit: string; lexiconRepository: string };

const SLOT_KINDS = ["text", "markdown", "uri", "email", "image", "list"];
const EMPTY_RULES = ["drop-field", "drop-item", "drop-card"];
const GUIDE_HEADINGS = ["## Who this is for", "## The layout", "## Interview", "## Writing rules", "## Before publishing"];
const SEMVER = /^\d+\.\d+\.\d+$/;
const ID = /^[a-z][a-z0-9-]{1,40}$/;
const EXAMPLE_DOMAIN = /(^|\.)example\.(com|org|net)$/;

export function loadContext(root: string): Context {
  const lexicons = new Lexicons();
  const docs = new Map<string, LexiconDoc>();
  const dir = join(root, "schemas", "upstream");
  for (const file of readdirSync(dir).filter((f) => f.startsWith("sh.unset.") && f.endsWith(".json"))) {
    const doc = readJson(join(dir, file)) as unknown as LexiconDoc;
    docs.set(doc.id, structuredClone(doc)); // Lexicons.add rewrites refs to absolute lex: URIs in place.
    lexicons.add(doc);
  }
  const source = readJson(join(dir, "source.json")) as { commit: string; repository: string };
  return { lexicons, docs, limits: readJson(join(root, "limits.json")) as unknown as Limits, lexiconCommit: source.commit, lexiconRepository: source.repository };
}

/** Every problem with the recipe in `dir`, each prefixed with the file it is in. Empty means it passes. */
export function checkRecipe(ctx: Context, dir: string, id: string): Problem[] {
  const manifestPath = join(dir, "recipe.json");
  if (!existsSync(manifestPath)) return [`${id}: recipe.json is missing`];
  const manifest = readJson(manifestPath);
  if (!isObj(manifest)) return [`${id}/recipe.json: expected an object`];
  const problems = checkManifest(ctx, manifest, id).map((p) => `${id}/recipe.json: ${p}`);
  const records = loadRecords(dir, manifest, problems, id);
  for (const [file, record] of records) {
    problems.push(...checkRecord(ctx, dir, record).map((p) => `${id}/${file}: ${p}`));
  }
  problems.push(...checkSlots(manifest, records).map((p) => `${id}/recipe.json: ${p}`));
  problems.push(...checkFiles(dir, manifest).map((p) => `${id}/${p}`));
  return problems;
}

function checkManifest(ctx: Context, m: Obj, id: string): Problem[] {
  const problems: Problem[] = [];
  if (m.id !== id) problems.push(`id must be "${id}", the folder name`);
  if (typeof m.id === "string" && !ID.test(m.id)) problems.push("id must be lowercase letters, digits and hyphens");
  if (typeof m.version !== "string" || !SEMVER.test(m.version)) problems.push("version must be MAJOR.MINOR.PATCH");
  for (const key of ["title", "summary"]) if (!nonEmpty(m[key])) problems.push(`${key} is required`);
  const persona = m.persona;
  if (!isObj(persona) || !Array.isArray(persona.for) || persona.for.length === 0) {
    problems.push("persona.for must list who the recipe suits");
  }
  const lexicon = m.lexicon;
  if (!isObj(lexicon) || lexicon.commit !== ctx.lexiconCommit) {
    problems.push(`lexicon.commit must be "${ctx.lexiconCommit}", the commit schemas/upstream/ was copied from`);
  }
  if (!isObj(lexicon) || lexicon.repository !== ctx.lexiconRepository) problems.push(`lexicon.repository must be "${ctx.lexiconRepository}"`);
  if (!Array.isArray(m.cards) || m.cards.length === 0) problems.push("cards must list at least one card");
  return problems;
}

/** The profile and each card, keyed by file, in page order. Missing or unreadable files are reported. */
function loadRecords(dir: string, m: Obj, problems: Problem[], id: string): Map<string, Obj> {
  const records = new Map<string, Obj>();
  const listed = Array.isArray(m.cards) ? m.cards : [];
  const files = ["profile.json", ...listed.map((c) => (isObj(c) && typeof c.file === "string" ? c.file : ""))];
  for (const file of files) {
    if (file === "") {
      problems.push(`${id}/recipe.json: each card needs a file`);
      continue;
    }
    const path = join(dir, file);
    if (!existsSync(path)) {
      problems.push(`${id}/${file}: missing`);
      continue;
    }
    const record = readJson(path);
    if (isObj(record)) records.set(file, record);
    else problems.push(`${id}/${file}: expected an object`);
  }
  const cardsDir = join(dir, "cards");
  const onDisk = existsSync(cardsDir) ? readdirSync(cardsDir).map((f) => `cards/${f}`) : [];
  for (const file of onDisk) if (!files.includes(file)) problems.push(`${id}/${file}: not listed in recipe.json cards`);
  return records;
}

export function checkRecord(ctx: Context, dir: string, record: Obj): Problem[] {
  const nsid = record.$type;
  if (nsid !== "sh.unset.profile" && nsid !== "sh.unset.card") {
    return ['$type must be "sh.unset.profile" or "sh.unset.card"'];
  }
  const problems: Problem[] = [];
  try {
    ctx.lexicons.assertValidRecord(nsid, jsonToLex(record));
  } catch (error) {
    problems.push((error as Error).message);
  }
  const root = ctx.docs.get(nsid)?.defs.main as unknown as Def;
  problems.push(...walk(ctx, dir, nsid, root, record, "$"));
  if (nsid === "sh.unset.profile") problems.push(...checkProfile(ctx, record));
  else problems.push(...checkCardLimits(ctx, record));
  problems.push(...sampleData(ctx, record, "$"));
  return problems;
}

function checkProfile(ctx: Context, record: Obj): Problem[] {
  const problems: Problem[] = [];
  if ("cards" in record) problems.push("$.cards: leave out; whoever applies the recipe writes it from the card order");
  const headline = record.headline;
  const max = ctx.limits.profile.headlineGraphemes;
  if (typeof headline === "string" && graphemes(headline) > max) {
    problems.push(`$.headline: the editor allows ${max} characters`);
  }
  return problems;
}

function checkCardLimits(ctx: Context, record: Obj): Problem[] {
  const content = record.content;
  if (!isObj(content) || typeof content.$type !== "string") return [];
  const kind = content.$type.replace("sh.unset.block.", "").replace(/#main$/, "");
  // Upstream domains/profile/card-edit.ts readButtons at the pinned source commit:
  // heading is optional in the schema, but required when a person saves in this editor.
  if (kind === "buttons" && !nonEmpty(content.heading)) return ["$.content.heading: the editor requires a heading"];
  if (kind === "text" && typeof content.text === "string" && Buffer.byteLength(content.text, "utf8") > ctx.limits.textBytes) {
    return [`$.content.text: the editor allows ${ctx.limits.textBytes} UTF-8 bytes`];
  }
  const max = ctx.limits.cardListItems[kind];
  const items = content.items;
  if (max !== undefined && Array.isArray(items) && items.length > max) {
    return [`$.content.items: the editor allows ${max} rows`];
  }
  return [];
}

/**
 * Fields the lexicon does not define, and blobs that do not match a file in assets/. Follows refs within the record's
 * lexicon and into the block schemas, and union members through the `$type` they name.
 */
function walk(ctx: Context, dir: string, nsid: string, def: Def | undefined, value: Json, path: string): Problem[] {
  if (def === undefined) return [];
  if (def.type === "ref" && def.ref !== undefined) {
    const target = resolve(ctx, nsid, def.ref);
    return walk(ctx, dir, target.nsid, target.def, value, path);
  }
  if (def.type === "union" && isObj(value) && typeof value.$type === "string") {
    // https://atproto.com/specs/lexicon#lexicon-files: data $type uses a bare NSID for a main definition.
    if (value.$type.endsWith("#main")) return [`${path}.$type: must omit #main`];
    const target = resolve(ctx, nsid, value.$type);
    const supported = def.refs?.some((ref) => {
      const candidate = resolve(ctx, nsid, ref);
      return candidate.nsid === target.nsid && candidate.name === target.name;
    });
    return supported ? walk(ctx, dir, target.nsid, target.def, value, path) : [`${path}.$type: unsupported template type ${value.$type}`];
  }
  if (def.type === "array" && Array.isArray(value)) {
    return value.flatMap((item, i) => walk(ctx, dir, nsid, def.items, item, `${path}[${i}]`));
  }
  if (def.type === "blob") return checkBlob(dir, def, value, path);
  const props = def.record?.properties ?? def.properties;
  if (props === undefined || !isObj(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => {
    if (key === "$type") return [];
    const prop = Object.hasOwn(props, key) ? props[key] : undefined;
    if (prop === undefined) return [`${path}.${key}: not defined by the vendored schema; omit from templates`];
    return walk(ctx, dir, nsid, prop, child, `${path}.${key}`);
  });
}

function resolve(ctx: Context, nsid: string, ref: string): { nsid: string; name: string; def: Def | undefined } {
  const [docId, name] = ref.startsWith("#") ? [nsid, ref.slice(1)] : (ref.split("#") as [string, string]);
  return { nsid: docId, name: name ?? "main", def: ctx.docs.get(docId)?.defs[name ?? "main"] as unknown as Def | undefined };
}

function checkBlob(dir: string, def: Def, value: Json, path: string): Problem[] {
  if (!isObj(value) || !isObj(value.ref) || typeof value.ref.$link !== "string") return [];
  const asset = findAsset(dir, value.ref.$link);
  if (asset === undefined) return [`${path}: names no file in assets/ (run bun run blob-ref)`];
  const problems: Problem[] = [];
  if (value.size !== asset.bytes.length) problems.push(`${path}.size: ${asset.name} is ${asset.bytes.length} bytes`);
  const mimeType = value.mimeType;
  if (typeof mimeType !== "string" || !(def.accept ?? []).some((accept) => accept === mimeType || (accept.endsWith("/*") && mimeType.startsWith(accept.slice(0, -1))))) {
    problems.push(`${path}.mimeType: must be one of ${(def.accept ?? []).join(", ")}`);
  }
  if (def.maxSize !== undefined && asset.bytes.length > def.maxSize) problems.push(`${path}: over ${def.maxSize} bytes`);
  const facts = jpegFacts(asset.bytes);
  if (facts === undefined) return [...problems, `${path}: ${asset.name} is not a JPEG`];
  if (value.mimeType !== "image/jpeg") problems.push(`${path}.mimeType: a JPEG sample must declare image/jpeg`);
  if (facts.hasMetadata) problems.push(`${path}: ${asset.name} carries metadata; strip it`);
  if (Math.max(facts.width, facts.height) > 2560) problems.push(`${path}: ${asset.name} is over 2560 px`);
  return problems;
}

function findAsset(dir: string, cid: string): { name: string; bytes: Uint8Array } | undefined {
  const assets = join(dir, "assets");
  if (!existsSync(assets)) return undefined;
  for (const name of readdirSync(assets)) {
    const bytes = readFileSync(join(assets, name));
    if (cidOf(bytes) === cid) return { name, bytes };
  }
  return undefined;
}

/**
 * Sample data must not point at real people: every address is on an RFC 2606 example domain, or on a platform host
 * in limits.json with "example" in its path. Applies to every string, markdown included.
 */
function sampleData(ctx: Context, value: Json, path: string): Problem[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => sampleData(ctx, v, `${path}[${i}]`));
  if (isObj(value)) return Object.entries(value).flatMap(([k, v]) => (k === "ref" ? [] : sampleData(ctx, v, `${path}.${k}`)));
  if (typeof value !== "string") return [];
  const problems: Problem[] = [];
  for (const [address] of value.matchAll(/[\w.+-]+@([\w-]+\.)+[\w-]+/g)) {
    const domain = address.split("@")[1] ?? "";
    if (!EXAMPLE_DOMAIN.test(domain)) {
      problems.push(`${path}: sample email ${address} must use example.com, .org or .net`);
    }
  }
  for (const [uri] of value.matchAll(/[a-z][a-z0-9+.-]*:\/\/[^\s)>\]"]+/gi)) {
    problems.push(...sampleUri(ctx, uri).map((p) => `${path}: ${p}`));
  }
  return problems;
}

function sampleUri(ctx: Context, uri: string): Problem[] {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return [`${uri} is not a URL`];
  }
  if (url.protocol !== "https:") return [`${uri}: sample links must use HTTPS`];
  if (url.username !== "" || url.password !== "") return [`${uri}: sample links must not contain credentials`];
  if (EXAMPLE_DOMAIN.test(url.hostname)) return [];
  if (ctx.limits.sampleHosts.includes(url.hostname) && `${url.pathname}${url.search}`.toLowerCase().includes("example")) return [];
  return [`${uri}: sample links use an example domain, or a listed platform with "example" in the path or query`];
}

function checkSlots(m: Obj, records: Map<string, Obj>): Problem[] {
  if (!Array.isArray(m.slots) || m.slots.length === 0) return ["slots must list what to ask the member"];
  const problems: Problem[] = [];
  const seen = new Set<string>();
  for (const [i, slot] of m.slots.entries()) {
    const at = `slots[${i}]`;
    if (!isObj(slot)) {
      problems.push(`${at}: expected an object`);
      continue;
    }
    if (typeof slot.id !== "string" || seen.has(slot.id)) problems.push(`${at}.id: required and unique`);
    else seen.add(slot.id);
    if (typeof slot.kind !== "string" || !SLOT_KINDS.includes(slot.kind)) {
      problems.push(`${at}.kind: one of ${SLOT_KINDS.join(", ")}`);
    }
    if (!nonEmpty(slot.ask)) problems.push(`${at}.ask: the question to put to the member`);
    if (!nonEmpty(slot.write)) problems.push(`${at}.write: explain how to word the answer`);
    if (typeof slot.required !== "boolean") problems.push(`${at}.required: must be true or false`);
    if ((slot.required === false || slot.ifEmpty !== undefined) && (typeof slot.ifEmpty !== "string" || !EMPTY_RULES.includes(slot.ifEmpty))) {
      problems.push(`${at}.ifEmpty: one of ${EMPTY_RULES.join(", ")}`);
    }
    const record = typeof slot.file === "string" ? records.get(slot.file) : undefined;
    if (record === undefined) problems.push(`${at}.file: names no record of this recipe`);
    else if (typeof slot.pointer !== "string" || pointerGet(record, slot.pointer) === undefined) {
      problems.push(`${at}.pointer: ${String(slot.pointer)} points at nothing in ${String(slot.file)}`);
    }
    if (record && isObj(record.content) && record.content.$type === "sh.unset.block.buttons" && slot.pointer === "/content/heading" && slot.required !== true) {
      problems.push(`${at}.required: the editor requires a button card's heading; an unanswered heading drops the card`);
    }
  }
  return problems;
}

function checkFiles(dir: string, m: Obj): Problem[] {
  const problems: Problem[] = [];
  const guidePath = join(dir, "GUIDE.md");
  if (!existsSync(guidePath)) problems.push("GUIDE.md: missing");
  else {
    const guide = readFileSync(guidePath, "utf8");
    for (const heading of GUIDE_HEADINGS) if (!guide.includes(`\n${heading}\n`)) problems.push(`GUIDE.md: needs "${heading}"`);
  }
  const preview = typeof m.preview === "string" ? m.preview : "preview.png";
  if (!existsSync(join(dir, preview))) problems.push(`${preview}: missing (run bun run previews)`);
  return problems;
}

/** RFC 6901 §§3–4: https://www.rfc-editor.org/rfc/rfc6901; invalid syntax or a missing value returns undefined. */
export function pointerGet(value: Json, pointer: string): Json | undefined {
  if (pointer === "") return value;
  if (!pointer.startsWith("/")) return undefined;
  let current: Json | undefined = value;
  for (const raw of pointer.slice(1).split("/")) {
    if (/~(?:[^01]|$)/.test(raw)) return undefined;
    const key = raw.replaceAll("~1", "/").replaceAll("~0", "~");
    if (Array.isArray(current)) {
      if (!/^(0|[1-9]\d*)$/.test(key)) return undefined;
      current = current[Number(key)];
    }
    else if (isObj(current)) current = Object.hasOwn(current, key) ? current[key] : undefined;
    else return undefined;
  }
  return current;
}

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
const graphemes = (text: string) => [...segmenter.segment(text)].length;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const nonEmpty = (v: unknown) => typeof v === "string" && v.trim() !== "";
const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8")) as Json;
