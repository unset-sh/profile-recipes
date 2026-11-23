// Each rule in check.ts, shown failing on a record that breaks it and passing on the shipped recipes.
import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkRecipe, checkRecord, loadContext, pointerGet } from "./check.ts";

const root = join(import.meta.dirname, "..");
const ctx = loadContext(root);
const dir = join(root, "recipes", "journalist");
const T = "2026-01-01T00:00:00.000Z";
const profile = (extra: object) => ({ $type: "sh.unset.profile", displayName: "Sample", createdAt: T, ...extra });
const page = (extra: object = {}) => ({ $type: "sh.unset.page", createdAt: T, ...extra });
const readme = (extra: object) => ({ $type: "sh.unset.card", createdAt: T, content: { $type: "sh.unset.block.text", text: "Hi" }, ...extra });

test("every shipped recipe passes", () => {
  for (const id of readdirSync(join(root, "recipes"))) assert.deepEqual(checkRecipe(ctx, join(root, "recipes", id), id), []);
});

test("a record the lexicon refuses fails", () => {
  assert.match(checkRecord(ctx, dir, profile({ createdAt: "yesterday" })).join(), /datetime/);
});

test("a template field the vendored schemas do not define fails", () => {
  assert.match(checkRecord(ctx, dir, readme({ colour: "red" })).join(), /\$\.colour: not defined/);
  assert.match(checkRecord(ctx, dir, readme({ content: { $type: "sh.unset.block.text", text: "x", font: "serif" } })).join(), /content\.font/);
});

test("a headline over the editor's limit fails though the lexicon allows it", () => {
  assert.match(checkRecord(ctx, dir, profile({ headline: "x".repeat(121) })).join(), /editor allows 120/);
  assert.deepEqual(checkRecord(ctx, dir, profile({ headline: "x".repeat(120) })), []);
});

test("text templates respect the editor's UTF-8 byte cap below the schema cap", () => {
  const content = (text: string) => readme({ content: { $type: "sh.unset.block.text", text } });
  assert.deepEqual(checkRecord(ctx, dir, content("é".repeat(5000))), []);
  assert.match(checkRecord(ctx, dir, content("é".repeat(5001))).join(), /editor allows 10000 UTF-8 bytes/);
});

test("showcase templates respect the editor's row cap", () => {
  const content = (length: number) => readme({ content: { $type: "sh.unset.block.showcase", items: Array.from({ length }, () => ({ title: "Sample" })) } });
  assert.deepEqual(checkRecord(ctx, dir, content(30)), []);
  assert.match(checkRecord(ctx, dir, content(31)).join(), /editor allows 30 rows/);
});

test("historical profile visibility and card order are not profile fields", () => {
  assert.match(checkRecord(ctx, dir, profile({ visibility: "public" })).join(), /\$\.visibility: not defined/);
  assert.match(checkRecord(ctx, dir, profile({ cards: ["3kabc"] })).join(), /\$\.cards: not defined/);
});

test("page templates accept visibility and dates but leave card references for the member's actual records", () => {
  assert.deepEqual(checkRecord(ctx, dir, page({ visibility: "public" })), []);
  assert.deepEqual(checkRecord(ctx, dir, { $type: "sh.unset.page" }), []);
  assert.match(checkRecord(ctx, dir, page({ createdAt: "yesterday" })).join(), /datetime/);
  for (const cards of [[], ["3kabc"], [{ uri: "at://did:plc:sample/sh.unset.card/3kabc" }]]) {
    assert.match(checkRecord(ctx, dir, page({ cards })).join(), /\$\.cards: leave out/);
  }
});

test("unknown knownValues remain valid and do not become closed template enums", () => {
  assert.deepEqual(checkRecord(ctx, dir, profile({ avatarShape: "future-shape" })), []);
  assert.deepEqual(checkRecord(ctx, dir, page({ visibility: "future-policy" })), []);
  assert.deepEqual(checkRecord(ctx, dir, readme({ width: "future-width", surface: "future-surface" })), []);
});

test("sample data may not point at real people", () => {
  const text = (t: string) => readme({ content: { $type: "sh.unset.block.text", text: t } });
  assert.match(checkRecord(ctx, dir, text("mail me@gmail.com")).join(), /example\.com/);
  assert.match(checkRecord(ctx, dir, text("see https://realperson.dev")).join(), /example domain/);
  assert.match(checkRecord(ctx, dir, text("see https://bsky.app/profile/someone.bsky.social")).join(), /example domain/);
  assert.deepEqual(checkRecord(ctx, dir, text("see https://bsky.app/profile/sam.example.com or tips@sam.example.org")), []);
  assert.deepEqual(checkRecord(ctx, dir, text("see https://scholar.google.com/citations?user=example-sam")), []);
  assert.match(checkRecord(ctx, dir, text("see https://scholar.google.com/citations?user=AbC123")).join(), /example domain/);
});

test("a blob that names no file in assets/ fails", () => {
  const avatar = { $type: "blob", ref: { $link: "bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy" }, mimeType: "image/jpeg", size: 10 };
  assert.match(checkRecord(ctx, dir, profile({ avatar })).join(), /names no file in assets/);
});

test("pointerGet follows RFC 6901", () => {
  assert.equal(pointerGet({ a: [{ "b/c": 1 }] }, "/a/0/b~1c"), 1);
  assert.equal(pointerGet({ a: 1 }, "/missing"), undefined);
  for (const pointer of ["/a/00", "/a/+0", "/a/", "/a/0e0", "/a/0/~2"]) {
    assert.equal(pointerGet({ a: [{ "~2": 1 }] }, pointer), undefined, pointer);
  }
});

test("current card blocks validate with optional fields omitted", () => {
  assert.deepEqual(checkRecord(ctx, dir, { $type: "sh.unset.card", content: { $type: "sh.unset.block.text", text: "Hi" } }), []);
  assert.deepEqual(checkRecord(ctx, dir, { $type: "sh.unset.profile" }), []);
});

test("button headings required by the editor cannot be omitted or left blank in samples", () => {
  const content = { $type: "sh.unset.block.buttons", buttons: [{ $type: "sh.unset.block.buttons#link", uri: "https://example.org" }] };
  for (const heading of [undefined, "", "   "]) {
    const card = readme({ content: { ...content, ...(heading === undefined ? {} : { heading }) } });
    assert.match(checkRecord(ctx, dir, card).join(), /editor requires a heading/);
  }
  assert.deepEqual(checkRecord(ctx, dir, readme({ content: { ...content, heading: "Get in touch" } })), []);
});

test("open unions still reject unknown blocks in these templates", () => {
  assert.match(checkRecord(ctx, dir, readme({ content: { $type: "com.example.block", text: "Hi" } })).join(), /unsupported template type/);
});

test("a block's primary type uses the NSID without a main fragment", () => {
  assert.match(checkRecord(ctx, dir, readme({ content: { $type: "sh.unset.block.text#main", text: "Hi" } })).join(), /must omit #main/);
});

test("template fields are checked through external and local schema refs", () => {
  const card = readme({ content: { $type: "sh.unset.block.showcase", items: [{ title: "Project", invented: true }] } });
  assert.match(checkRecord(ctx, dir, card).join(), /content\.items\[0\]\.invented: not defined/);
  const sample = JSON.parse(readFileSync(join(dir, "profile.json"), "utf8"));
  const images = readme({ content: { $type: "sh.unset.block.images", images: [{ image: sample.avatar, alt: "Sample", aspectRatio: { width: 1, height: 1, invented: true } }] } });
  assert.match(checkRecord(ctx, dir, images).join(), /aspectRatio\.invented: not defined/);
});

test("a JPEG sample avatar satisfies an upstream image wildcard", () => {
  const sample = JSON.parse(readFileSync(join(dir, "profile.json"), "utf8"));
  assert.deepEqual(checkRecord(ctx, dir, profile({ avatar: sample.avatar })), []);
});

test("sample links follow the HTTPS and no-credentials instructions", () => {
  for (const website of ["http://example.com", "https://user:password@example.com"]) {
    assert.match(checkRecord(ctx, dir, profile({ website })).join(), /HTTPS|credentials/);
  }
  assert.deepEqual(checkRecord(ctx, dir, profile({ website: "https://example.com" })), []);
});

test("slots include writing guidance and a rule for unanswered optional fields", () => {
  const fixture = mkdtempSync(join(tmpdir(), "recipe-check-"));
  try {
    cpSync(dir, fixture, { recursive: true });
    const file = join(fixture, "recipe.json");
    const manifest = JSON.parse(readFileSync(file, "utf8"));
    delete manifest.slots[0].write;
    delete manifest.slots[0].required;
    delete manifest.slots.find((slot: { required: boolean }) => slot.required === false).ifEmpty;
    manifest.slots.find((slot: { pointer: string }) => slot.pointer === "/content/heading").required = false;
    writeFileSync(file, JSON.stringify(manifest));
    const problems = checkRecipe(ctx, fixture, "journalist").join();
    assert.match(problems, /slots\[0\]\.write/);
    assert.match(problems, /slots\[0\]\.required/);
    assert.match(problems, /\.ifEmpty/);
    assert.match(problems, /editor requires a button card's heading/);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

// These fixtures exercise the real file loader and the same provenance gate used by npm run check.
function withRecipe(run: (fixture: string) => void): void {
  const fixture = mkdtempSync(join(tmpdir(), "recipe-records-"));
  try {
    cpSync(dir, fixture, { recursive: true });
    writeFileSync(join(fixture, "page.json"), JSON.stringify(page({ visibility: "public" })));
    run(fixture);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test("a recipe needs its page record", () => {
  withRecipe(fixture => {
    rmSync(join(fixture, "page.json"));
    assert.match(checkRecipe(ctx, fixture, "journalist").join(), /journalist\/page\.json: missing/);
  });
});

test("each record file must have the type its role expects", () => {
  for (const [file, expected, wrong] of [
    ["profile.json", "sh.unset.profile", page()],
    ["page.json", "sh.unset.page", profile({})],
    ["cards/01-about.json", "sh.unset.card", profile({})],
  ] as const) {
    withRecipe(fixture => {
      writeFileSync(join(fixture, file), JSON.stringify(wrong));
      assert.ok(checkRecipe(ctx, fixture, "journalist").some(problem => problem.includes(`${file}: $type must be "${expected}"`)));
    });
  }
});

test("recipe manifests must pin the same source repository and commit as the schemas", () => {
  withRecipe(fixture => {
    const file = join(fixture, "recipe.json");
    const manifest = JSON.parse(readFileSync(file, "utf8"));
    manifest.lexicon = { repository: "https://github.com/Undefined6799/unset", commit: "0dd079517074917ebd5217f7ecf15f4984cdd5d3" };
    writeFileSync(file, JSON.stringify(manifest));
    const problems = checkRecipe(ctx, fixture, "journalist").join();
    assert.match(problems, /lexicon\.repository must be/);
    assert.match(problems, /lexicon\.commit must be/);
  });
});

function withSchemas(run: (fixture: string) => void): void {
  const fixture = mkdtempSync(join(tmpdir(), "recipe-schemas-"));
  try {
    cpSync(join(root, "schemas"), join(fixture, "schemas"), { recursive: true });
    cpSync(join(root, "limits.json"), join(fixture, "limits.json"));
    run(fixture);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
}

test("schema provenance detects byte drift before loading records", () => {
  withSchemas(fixture => {
    const file = join(fixture, "schemas/upstream/sh.unset.profile.json");
    writeFileSync(file, `${readFileSync(file, "utf8")}\n`);
    assert.throws(() => loadContext(fixture), /sh\.unset\.profile\.json.*sha256/);
  });
});

test("schema provenance requires the exact declared file inventory", () => {
  withSchemas(fixture => {
    rmSync(join(fixture, "schemas/upstream/sh.unset.block.text.json"));
    assert.throws(() => loadContext(fixture), /schema inventory/);
  });
  withSchemas(fixture => {
    writeFileSync(join(fixture, "schemas/upstream/extra.json"), "{}");
    assert.throws(() => loadContext(fixture), /schema inventory/);
  });
});

test("schema provenance records canonical paths for all recipe dependencies", () => {
  assert.ok(ctx.docs.has("sh.unset.page"));
  withSchemas(fixture => {
    const path = join(fixture, "schemas/upstream/source.json");
    const source = JSON.parse(readFileSync(path, "utf8"));
    source.files = { ...source.files, "sh.unset.profile.json": { sourcePath: "wrong/profile.json", sha256: "0".repeat(64) } };
    writeFileSync(path, JSON.stringify(source));
    assert.throws(() => loadContext(fixture), /sourcePath|schema inventory/);
  });
});
