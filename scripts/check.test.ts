// Each rule in check.ts, shown failing on a record that breaks it and passing on the shipped recipes.
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { checkRecipe, checkRecord, loadContext, pointerGet } from "./check.ts";

const root = join(import.meta.dirname, "..");
const ctx = loadContext(root);
const dir = join(root, "recipes", "journalist");
const T = "2026-01-01T00:00:00.000Z";
const profile = (extra: object) => ({ $type: "sh.unset.profile", displayName: "Sample", createdAt: T, ...extra });
const readme = (extra: object) => ({ $type: "sh.unset.section", createdAt: T, content: { $type: "sh.unset.section#readme", text: "Hi" }, ...extra });

test("every shipped recipe passes", () => {
  for (const id of readdirSync(join(root, "recipes"))) assert.deepEqual(checkRecipe(ctx, join(root, "recipes", id), id), []);
});

test("a record the lexicon refuses fails", () => {
  assert.match(checkRecord(ctx, dir, profile({ createdAt: "yesterday" })).join(), /datetime/);
});

test("a field the lexicon does not define fails, as the app refuses it on save", () => {
  assert.match(checkRecord(ctx, dir, readme({ colour: "red" })).join(), /\$\.colour: not defined/);
  assert.match(checkRecord(ctx, dir, readme({ content: { $type: "sh.unset.section#readme", text: "x", font: "serif" } })).join(), /content\.font/);
});

test("a headline over the editor's limit fails though the lexicon allows it", () => {
  assert.match(checkRecord(ctx, dir, profile({ headline: "x".repeat(121) })).join(), /editor allows 120/);
  assert.deepEqual(checkRecord(ctx, dir, profile({ headline: "x".repeat(120) })), []);
});

test("a template that sets the card order fails", () => {
  assert.match(checkRecord(ctx, dir, profile({ cards: ["3kabc"] })).join(), /\$\.cards: leave out/);
});

test("sample data may not point at real people", () => {
  const text = (t: string) => readme({ content: { $type: "sh.unset.section#readme", text: t } });
  assert.match(checkRecord(ctx, dir, text("mail me@gmail.com")).join(), /example\.com/);
  assert.match(checkRecord(ctx, dir, text("see https://realperson.dev")).join(), /example domain/);
  assert.match(checkRecord(ctx, dir, text("see https://bsky.app/profile/someone.bsky.social")).join(), /example domain/);
  assert.deepEqual(checkRecord(ctx, dir, text("see https://bsky.app/profile/sam.example.com or tips@sam.example.org")), []);
});

test("a blob that names no file in assets/ fails", () => {
  const avatar = { $type: "blob", ref: { $link: "bafkreigh2akiscaildcqabsyg3dfr6chu3fgpregiymsck7e7aqa4s52zy" }, mimeType: "image/jpeg", size: 10 };
  assert.match(checkRecord(ctx, dir, profile({ avatar })).join(), /names no file in assets/);
});

test("pointerGet follows RFC 6901", () => {
  assert.equal(pointerGet({ a: [{ "b/c": 1 }] }, "/a/0/b~1c"), 1);
  assert.equal(pointerGet({ a: 1 }, "/missing"), undefined);
});
