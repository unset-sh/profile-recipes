import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { cardBody, loadRecipes, recipePage, type Recipe } from "./render.ts";

const recipe: Recipe = {
  id: "sample", dir: "", manifest: { title: "Sample", version: "0.2.0" },
  profile: { displayName: "Sample person", headline: "A headline in About" }, page: { $type: "sh.unset.page" }, cards: [],
  assets: new Map([["sample-cid", "sample.jpg"]]),
};
const picture = { image: { ref: { $link: "sample-cid" } }, alt: 'A picture & "caption"', aspectRatio: { width: 800, height: 1200 } };

test("an unlinked showcase item is readable without a fake navigation target", () => {
  const html = cardBody(recipe, { $type: "sh.unset.block.showcase", items: [{ title: "Experience" }] }, "current");
  assert.match(html, /Experience/);
  assert.doesNotMatch(html, /<a\b|href="#"/);
});

test("images use nested blobs and preserve source proportions only in the labelled media study", () => {
  const block = { $type: "sh.unset.block.images", images: [picture], fit: "contain" };
  assert.equal(cardBody(recipe, block, "current"), "");
  const html = cardBody(recipe, block, "media");
  assert.match(html, /src="sample\/sample.jpg"/);
  assert.match(html, /width="800" height="1200"/);
  assert.match(html, /A picture &amp; &quot;caption&quot;/);
});

test("email is a working encoded mailto and unsafe addresses are omitted", () => {
  const html = cardBody(recipe, { $type: "sh.unset.block.buttons", buttons: [
    { $type: "sh.unset.block.buttons#email", address: "hello@example.org" },
    { $type: "sh.unset.block.buttons#email", address: "hello@example.org?subject=oops" },
  ] }, "current");
  assert.match(html, /href="mailto:hello%40example.org"/);
  assert.doesNotMatch(html, /subject=oops/);
});

test("record strings are escaped, unsupported blocks hidden and dangerous links inert", () => {
  assert.equal(cardBody(recipe, { $type: "other.example.block", text: "hidden" }, "current"), "");
  const html = cardBody(recipe, { $type: "sh.unset.block.showcase", items: [{ title: '<img onerror="oops">', uri: "javascript:alert(1)" }] }, "current");
  assert.match(html, /&lt;img/);
  assert.doesNotMatch(html, /<img|javascript:|<a\b/);
});

test("current and media pages disclose their mode and put the headline in About", () => {
  const current = recipePage(recipe, "current");
  const media = recipePage(recipe, "media");
  assert.match(current, /Current app/);
  assert.match(media, /Media study/);
  assert.match(media, /not rendered by the pinned app/);
  assert.match(current, /popover="auto"[\s\S]*A headline in About/);
  assert.doesNotMatch(current, /<iframe|<script/);
});


test("unknown button presets and empty labels use the visible app fallback", () => {
  const html = cardBody(recipe, { $type: "sh.unset.block.buttons", buttons: [
    { $type: "sh.unset.block.buttons#link", preset: "toString", uri: "https://example.org", label: "" },
  ] }, "current");
  assert.match(html, />Open link<\/a>/);
  assert.doesNotMatch(html, /function|native code/);
});

test("the samples' Markdown links are usable while raw HTML and unsafe URLs stay inert", () => {
  const html = cardBody(recipe, { $type: "sh.unset.block.text", text: '[Read the report](https://example.org/report?a=1&b=2) <script>bad</script> [Bad](javascript:alert(1))' }, "current");
  assert.match(html, /href="https:\/\/example.org\/report\?a=1&amp;b=2"/);
  assert.match(html, />Read the report<\/a>/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script|href="javascript:/);
});

test("the recipe loader reads page metadata and preserves manifest order and card content", () => {
  const fixture = mkdtempSync(join(tmpdir(), "recipe-render-"));
  try {
    const dir = join(fixture, "recipes/sample");
    mkdirSync(join(dir, "cards"), { recursive: true });
    const write = (file: string, value: object) => writeFileSync(join(dir, file), JSON.stringify(value));
    write("recipe.json", { title: "Sample", version: "0.3.0", cards: [{ file: "cards/z-first.json" }, { file: "cards/a-last.json" }] });
    write("profile.json", { $type: "sh.unset.profile", displayName: "Sample person" });
    write("page.json", { $type: "sh.unset.page", visibility: "signed-in", createdAt: "2026-01-01T00:00:00.000Z" });
    write("cards/z-first.json", { $type: "sh.unset.card", content: { $type: "sh.unset.block.text", text: "First in manifest" } });
    write("cards/a-last.json", { $type: "sh.unset.card", content: { $type: "sh.unset.block.text", text: "Last in manifest" }, width: "half" });
    const loaded = loadRecipes(fixture);
    assert.equal(loaded.length, 1);
    assert.deepEqual(loaded[0]!.page, { $type: "sh.unset.page", visibility: "signed-in", createdAt: "2026-01-01T00:00:00.000Z" });
    assert.deepEqual(loaded[0]!.cards, [
      { $type: "sh.unset.card", content: { $type: "sh.unset.block.text", text: "First in manifest" } },
      { $type: "sh.unset.card", content: { $type: "sh.unset.block.text", text: "Last in manifest" }, width: "half" },
    ]);
    for (const mode of ["current", "media"] as const) {
      const html = recipePage(loaded[0]!, mode);
      assert.ok(html.indexOf("First in manifest") < html.indexOf("Last in manifest"));
      // A local layout study has no viewer identity or access-control role.
      assert.match(html, /Sample person/);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("empty or missing collection rows leave no preview card", () => {
  for (const mode of ["current", "media"] as const) {
    for (const kind of ["links", "showcase", "buttons"]) {
      const field = kind === "buttons" ? "buttons" : "items";
      for (const value of [{}, { [field]: [] }]) {
        const content = { $type: `sh.unset.block.${kind}`, title: "Empty heading", heading: "Empty heading", ...value };
        assert.equal(cardBody(recipe, content, mode), "");
        assert.doesNotMatch(recipePage({ ...recipe, cards: [{ content }] }, mode), /Empty heading|<section class="card /);
      }
    }
  }
});

test("links and buttons whose rows are all skipped leave no preview card", () => {
  for (const content of [
    { $type: "sh.unset.block.links", items: [{ uri: "javascript:alert(1)" }] },
    { $type: "sh.unset.block.buttons", buttons: [{ $type: "sh.unset.block.buttons#link", uri: "javascript:alert(1)" }, { $type: "sh.unset.block.buttons#email", address: "invalid" }, { $type: "com.example.unknown" }] },
  ]) {
    assert.equal(cardBody(recipe, content, "current"), "");
  }
});
