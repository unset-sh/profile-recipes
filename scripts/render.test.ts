import assert from "node:assert/strict";
import { test } from "node:test";
import { cardBody, recipePage, type Recipe } from "./render.ts";

const recipe: Recipe = {
  id: "sample", dir: "", manifest: { title: "Sample", version: "0.2.0" },
  profile: { displayName: "Sample person", headline: "A headline in About" }, cards: [],
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
