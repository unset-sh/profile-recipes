import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, linkSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { exportDocs } from "./docs-export.ts";

const commit = "a".repeat(40);

function fixture() {
  const base = mkdtempSync(join(tmpdir(), "recipe-docs-"));
  const root = join(base, "source");
  mkdirSync(join(root, "docs", "developer-example"), { recursive: true });
  mkdirSync(join(root, "recipes", "developer"), { recursive: true });
  writeFileSync(join(root, "docs", "_index.md"), "---\ntitle: Recipes\n---\n\n[Learn](https://github.com/unset-sh/profile-recipes/blob/main/README.md).\n");
  writeFileSync(join(root, "docs", "developer-example", "index.md"), "![Example](../../recipes/developer/preview.png)\n");
  writeFileSync(join(root, "recipes", "developer", "preview.png"), "sample image");
  writeFileSync(join(root, "LICENSE"), "AGPL notice\n");
  writeFileSync(join(root, "LICENSE-CONTENT"), "CC0 notice\n");
  return { base, root, output: join(base, "export"), cleanup: () => rmSync(base, { recursive: true, force: true }) };
}

test("exports only the recipe section, with local media, notices and verifiable provenance", () => {
  const f = fixture();
  try {
    writeFileSync(join(f.root, "private.txt"), "not documentation");
    exportDocs(f.root, f.output, commit);
    assert.deepEqual(readdirSync(f.output), ["profile-recipes"]);
    const section = join(f.output, "profile-recipes");
    assert.equal(existsSync(join(section, "private.txt")), false);
    assert.equal(readFileSync(join(section, "LICENSE-CONTENT"), "utf8"), "CC0 notice\n");
    const example = readFileSync(join(section, "developer-example", "index.md"), "utf8");
    assert.match(example, /!\[Example\]\(preview.png\)/);
    assert.ok(example.includes(`/blob/${commit}/docs/developer-example/index.md`));
    assert.equal(readFileSync(join(section, "developer-example", "preview.png"), "utf8"), "sample image");
    assert.ok(readFileSync(join(section, "_index.md"), "utf8").includes(`/blob/${commit}/README.md`));
    const provenance = JSON.parse(readFileSync(join(section, "source.json"), "utf8"));
    assert.equal(provenance.repository, "https://github.com/unset-sh/profile-recipes");
    assert.equal(provenance.commit, commit);
    for (const file of provenance.files) {
      assert.equal(file.sha256, createHash("sha256").update(readFileSync(join(section, file.path))).digest("hex"));
      assert.equal(file.sourceSha256, createHash("sha256").update(readFileSync(join(f.root, file.source))).digest("hex"));
    }
    exportDocs(f.root, join(f.base, "again"), commit);
    assert.equal(readFileSync(join(section, "source.json"), "utf8"), readFileSync(join(f.base, "again", "profile-recipes", "source.json"), "utf8"));
  } finally { f.cleanup(); }
});

test("the documented developer record stays identical to the shipped sample", () => {
  const root = join(import.meta.dirname, "..");
  const page = readFileSync(join(root, "docs", "developer-example", "index.md"), "utf8");
  const example = page.match(/```json\n([\s\S]+?)\n```/);
  assert.ok(example?.[1], "Keep the complete sample record in the worked example");
  assert.deepEqual(JSON.parse(example[1]), JSON.parse(readFileSync(join(root, "recipes", "developer", "cards", "02-stack.json"), "utf8")));
});

test("refuses existing destinations and destinations inside its source", () => {
  const f = fixture();
  try {
    mkdirSync(f.output);
    writeFileSync(join(f.output, "keep"), "other source");
    assert.throws(() => exportDocs(f.root, f.output, commit), /already exists/);
    assert.equal(readFileSync(join(f.output, "keep"), "utf8"), "other source");
    assert.throws(() => exportDocs(f.root, join(f.root, "export"), commit), /inside the source/);
    symlinkSync(f.root, join(f.base, "alias"));
    assert.throws(() => exportDocs(f.root, join(f.base, "alias", "export"), commit), /inside the source/);
  } finally { f.cleanup(); }
});

for (const kind of ["symlink", "hardlink", "directory symlink", "asset directory symlink"] as const) {
  test(`rejects a ${kind} before creating output`, () => {
    const f = fixture();
    try {
      if (kind === "symlink") symlinkSync(join(f.root, "LICENSE"), join(f.root, "docs", "linked.md"));
      if (kind === "hardlink") linkSync(join(f.root, "LICENSE"), join(f.root, "docs", "linked.md"));
      if (kind === "directory symlink") symlinkSync(join(f.root, "recipes"), join(f.root, "docs", "linked"));
      if (kind === "asset directory symlink") {
        rmSync(join(f.root, "recipes", "developer"), { recursive: true });
        symlinkSync(join(f.root, "docs"), join(f.root, "recipes", "developer"));
      }
      assert.throws(() => exportDocs(f.root, f.output, commit), /regular|symlink|hardlink/);
      assert.equal(existsSync(f.output), false);
    } finally { f.cleanup(); }
  });
}

test("requires an index, an exact source commit and the expected asset reference", () => {
  const f = fixture();
  try {
    assert.throws(() => exportDocs(f.root, f.output, "main"), /commit/);
    writeFileSync(join(f.root, "docs", "developer-example", "index.md"), "No image\n");
    assert.throws(() => exportDocs(f.root, f.output, commit), /asset reference/);
    rmSync(join(f.root, "docs", "_index.md"));
    assert.throws(() => exportDocs(f.root, f.output, commit), /_index.md/);
    assert.equal(existsSync(f.output), false);
  } finally { f.cleanup(); }
});

test("rejects a special file without opening it or leaving a partial export", () => {
  const f = fixture();
  try {
    execFileSync("mkfifo", [join(f.root, "docs", "pipe.md")]);
    assert.throws(() => exportDocs(f.root, f.output, commit), /regular file/);
    assert.equal(existsSync(f.output), false);
  } finally { f.cleanup(); }
});
