// The DCO check (dco.ts): which commits need a sign-off, what counts as one, and reading a pull request's commits
// from a real git repository.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { isExempt, isObjectId, readCommits, unsignedCommits } from "./dco.ts";

const commit = (message: string, parents = 1) => ({ sha: "a".repeat(40), parents, message });

test("a commit with a sign-off line passes", () => {
  assert.deepEqual(unsignedCommits([commit("Add a recipe\n\nSigned-off-by: Sam Sample <sam@example.com>\n")]), []);
});

test("the sign-off GitHub's web editor writes passes", () => {
  const web = "Update GUIDE.md\n\nSigned-off-by: sam-sample <123+sam-sample@users.noreply.github.com>";
  assert.deepEqual(unsignedCommits([commit(web)]), []);
});

test("a commit without a sign-off fails", () => {
  assert.equal(unsignedCommits([commit("Add a recipe\n")]).length, 1);
});

test("a sign-off with no email address fails", () => {
  assert.equal(unsignedCommits([commit("Add a recipe\n\nSigned-off-by: Sam Sample\n")]).length, 1);
});

test("a sign-off quoted inside a line fails", () => {
  assert.equal(unsignedCommits([commit("Add a recipe; see Signed-off-by: Sam <sam@example.com>\n")]).length, 1);
});

test("a merge commit needs no sign-off", () => {
  assert.deepEqual(unsignedCommits([commit("Merge branch 'main'", 2)]), []);
});

test("the owner's and bots' pull requests are exempt, everyone else's are not", () => {
  assert.equal(isExempt("Undefined6799"), true);
  assert.equal(isExempt("undefined6799"), true);
  assert.equal(isExempt("dependabot[bot]"), true);
  assert.equal(isExempt("sam-sample"), false);
  assert.equal(isExempt("bot-sam"), false);
});

test("only a full commit id is accepted", () => {
  assert.equal(isObjectId("0123456789abcdef0123456789abcdef01234567"), true);
  assert.equal(isObjectId("main"), false);
  assert.equal(isObjectId("--output=x"), false);
});

test("the commits a branch adds are read from git, with their messages and parents", () => {
  const dir = mkdtempSync(join(tmpdir(), "dco-"));
  const git = (...args: string[]) => execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  git("init", "--quiet", "--initial-branch=main");
  git("config", "user.name", "Sam Sample");
  git("config", "user.email", "sam@example.com");
  writeFileSync(join(dir, "a.txt"), "a");
  git("add", "a.txt");
  git("commit", "--quiet", "-m", "Base");
  const base = git("rev-parse", "HEAD");
  writeFileSync(join(dir, "b.txt"), "b");
  git("add", "b.txt");
  git("commit", "--quiet", "-s", "-m", "Signed");
  writeFileSync(join(dir, "c.txt"), "c");
  git("add", "c.txt");
  git("commit", "--quiet", "-m", "Not signed");
  const head = git("rev-parse", "HEAD");

  const commits = readCommits(dir, base, head);
  assert.deepEqual(
    commits.map((c) => [c.message.split("\n")[0], c.parents]),
    [
      ["Not signed", 1],
      ["Signed", 1],
    ],
  );
  assert.deepEqual(
    unsignedCommits(commits).map((c) => c.sha),
    [head],
  );
});
