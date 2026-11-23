// Exercise the workflow's actual publishing shell against local, disposable Git remotes.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

const workflow = readFileSync(join(import.meta.dirname, "..", ".github", "workflows", "docs-mirror.yml"), "utf8");
const marker = "      - name: Replace only profile-recipes and push without rewriting history\n";
assert.equal(workflow.split(marker).length, 2, "Keep one identifiable publisher step");
const publisher = workflow.split(marker)[1]!.split("        run: |\n")[1]!
  .split("\n").map((line) => line.startsWith("          ") ? line.slice(10) : line).join("\n");
const realGit = execFileSync("sh", ["-c", "command -v git"], { encoding: "utf8" }).trim();
const quote = (value: string) => `'${value.replaceAll("'", "'\\''")}'`;

function fixture() {
  const base = mkdtempSync(join(tmpdir(), "docs-publish-"));
  const remote = join(base, "remote.git");
  const target = join(base, "target");
  const runner = join(base, "runner");
  const bin = join(base, "bin");
  mkdirSync(join(runner, "docs-export", "profile-recipes"), { recursive: true });
  mkdirSync(bin);
  const env = { ...process.env, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "commit.gpgsign", GIT_CONFIG_VALUE_0: "false", GIT_TERMINAL_PROMPT: "0",
    GIT_AUTHOR_NAME: "Test", GIT_AUTHOR_EMAIL: "test@example.com", GIT_COMMITTER_NAME: "Test", GIT_COMMITTER_EMAIL: "test@example.com",
    RUNNER_TEMP: runner, SOURCE_COMMIT: "a".repeat(40), GIT_CALL_LOG: join(base, "calls"),
  };
  const git = (cwd: string, ...args: string[]) => execFileSync(realGit, args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git(base, "init", "--bare", "--initial-branch=main", remote);
  git(base, "clone", remote, target);
  mkdirSync(join(target, "profile-recipes"));
  mkdirSync(join(target, "other-source"));
  writeFileSync(join(target, "framework.txt"), "keep framework\n");
  writeFileSync(join(target, "other-source", "_index.md"), "keep other source\n");
  writeFileSync(join(target, "profile-recipes", "_index.md"), "old recipe page\n");
  writeFileSync(join(target, "profile-recipes", "obsolete.md"), "remove on replacement\n");
  git(target, "add", ".");
  git(target, "commit", "-m", "Base");
  git(target, "push", "origin", "main");
  writeFileSync(join(runner, "docs-export", "profile-recipes", "_index.md"), "new recipe page\n");
  writeFileSync(join(runner, "docs-export", "profile-recipes", "source.json"), '{"commit":"sample"}\n');
  // A wrapper records Git arguments and can simulate an unrelated index change after the clean-tree check.
  writeFileSync(join(bin, "git"), `#!/bin/sh\nset -eu\nprintf '%s ' "$@" >> "$GIT_CALL_LOG"\nprintf '\\n' >> "$GIT_CALL_LOG"\nif [ "$1" = add ] && [ "\${INJECT_STAGE:-}" = 1 ]; then\n  ${quote(realGit)} "$@"\n  printf 'unexpected change\\n' > framework.txt\n  ${quote(realGit)} add -- framework.txt\n  exit 0\nfi\nexec ${quote(realGit)} "$@"\n`, { mode: 0o755 });
  const run = (extra: Record<string, string> = {}) => spawnSync("bash", ["-c", publisher], { cwd: target,
    env: { ...env, PATH: `${bin}:${process.env.PATH}`, ...extra }, encoding: "utf8" });
  const readRemote = (path: string) => git(remote, "show", `main:${path}`);
  const advance = (path: string) => {
    const other = join(base, "concurrent");
    git(base, "clone", remote, other);
    writeFileSync(join(other, path), "concurrent update\n");
    git(other, "add", "--", path);
    git(other, "commit", "-m", "Concurrent update");
    git(other, "push", "origin", "main");
    return git(other, "rev-parse", "HEAD");
  };
  return { base, target, remote, runner, git, run, readRemote, advance,
    calls: () => readFileSync(env.GIT_CALL_LOG, "utf8"), cleanup: () => rmSync(base, { recursive: true, force: true }) };
}

test("publisher replaces only its section, preserves other sources and skips an identical export", () => {
  const f = fixture();
  try {
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(f.readRemote("framework.txt"), "keep framework");
    assert.equal(f.readRemote("other-source/_index.md"), "keep other source");
    assert.equal(f.readRemote("profile-recipes/_index.md"), "new recipe page");
    assert.equal(existsSync(join(f.target, "profile-recipes", "obsolete.md")), false);
    const head = f.git(f.remote, "rev-parse", "main");
    assert.equal(f.run().status, 0);
    assert.equal(f.git(f.remote, "rev-parse", "main"), head);
    assert.match(f.calls(), /push origin HEAD:main/);
    assert.doesNotMatch(f.calls(), /--force|\+HEAD|push[^\n]* -f(?: |$)/);
  } finally { f.cleanup(); }
});

test("publisher refuses pre-existing destination changes before replacing its section", () => {
  const f = fixture();
  try {
    writeFileSync(join(f.target, "framework.txt"), "local work\n");
    assert.notEqual(f.run().status, 0);
    assert.equal(readFileSync(join(f.target, "profile-recipes", "_index.md"), "utf8"), "old recipe page\n");
    assert.equal(f.readRemote("framework.txt"), "keep framework");
    assert.doesNotMatch(f.calls(), /push /);
  } finally { f.cleanup(); }
});

test("publisher refuses a staged path outside profile-recipes even if it arrives after the clean-tree check", () => {
  const f = fixture();
  try {
    const result = f.run({ INJECT_STAGE: "1" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /outside profile-recipes/);
    assert.equal(f.readRemote("framework.txt"), "keep framework");
    assert.equal(f.readRemote("profile-recipes/_index.md"), "old recipe page");
    assert.doesNotMatch(f.calls(), /commit -s|push /);
  } finally { f.cleanup(); }
});

test("publisher rebases a disjoint concurrent change and preserves it", () => {
  const f = fixture();
  try {
    const concurrent = f.advance("other-source/_index.md");
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(f.readRemote("other-source/_index.md"), "concurrent update");
    assert.equal(f.readRemote("profile-recipes/_index.md"), "new recipe page");
    assert.equal(f.git(f.remote, "merge-base", "main", concurrent), concurrent);
    assert.match(f.calls(), /pull --rebase origin main/);
    assert.doesNotMatch(f.calls(), /--force|\+HEAD/);
  } finally { f.cleanup(); }
});

test("publisher stops on a rebase conflict without replacing the concurrent target commit", () => {
  const f = fixture();
  try {
    const concurrent = f.advance("profile-recipes/_index.md");
    const result = f.run();
    assert.notEqual(result.status, 0);
    assert.equal(f.git(f.remote, "rev-parse", "main"), concurrent);
    assert.equal(f.readRemote("profile-recipes/_index.md"), "concurrent update");
    assert.match(f.calls(), /pull --rebase origin main/);
    assert.doesNotMatch(f.calls(), /--force|\+HEAD/);
  } finally { f.cleanup(); }
});

for (const destination of ["framework-moved.md", "profile-recipes/moved.md"]) {
  test(`publisher refuses a rebased rename to ${destination} and leaves the remote unchanged`, () => {
    const f = fixture();
    try {
      const article = "Original first line\n" + Array.from({ length: 20 }, (_, i) => `Stable line ${i}\n`).join("");
      writeFileSync(join(f.target, "profile-recipes", "article.md"), article);
      f.git(f.target, "add", "--", "profile-recipes/article.md");
      f.git(f.target, "commit", "-m", "Add article");
      f.git(f.target, "push", "origin", "main");
      writeFileSync(join(f.runner, "docs-export", "profile-recipes", "article.md"), article.replace("Original first line", "Changed by exporter"));

      const other = join(f.base, "rename");
      f.git(f.base, "clone", f.remote, other);
      f.git(other, "mv", "profile-recipes/article.md", destination);
      f.git(other, "commit", "-m", "Move article");
      f.git(other, "push", "origin", "main");
      const concurrent = f.git(other, "rev-parse", "HEAD");

      const result = f.run();
      assert.notEqual(result.status, 0, "A clean rebase must not authorize publishing a renamed export");
      assert.match(result.stderr, destination.startsWith("profile-recipes/") ? /differs from the generated export/ : /outside profile-recipes/);
      assert.equal(f.git(f.remote, "rev-parse", "main"), concurrent);
      assert.equal(f.readRemote(destination), article.trim());
      assert.match(f.calls(), /pull --rebase origin main/);
      assert.equal((f.calls().match(/^push origin HEAD:main/gm) ?? []).length, 1, "Do not push after the unsafe rebase");
    } finally { f.cleanup(); }
  });
}

test("workflow confines publication to current main, its protected environment and pinned actions", () => {
  assert.match(workflow, /branches: \[main\]/);
  assert.match(workflow, /if: github\.ref == 'refs\/heads\/main' && \(github\.event_name == 'push' \|\| github\.event_name == 'workflow_dispatch'\)/);
  assert.doesNotMatch(workflow, /pull_request|workflow_run|contents: write|id-token:|packages:/);
  assert.match(workflow, /permissions: \{\}/);
  assert.match(workflow, /environment: docs-mirror\n    permissions:\n      contents: read/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.equal((workflow.match(/ref: main/g) ?? []).length, 2);
  const actions = [...workflow.matchAll(/uses: ([^\s]+)/g)].map((match) => match[1]!);
  assert.equal(actions.length, 5);
  for (const action of actions) {
    assert.match(action, /^(?:actions\/checkout|oven-sh\/setup-bun|actions\/upload-artifact|actions\/download-artifact)@[a-f0-9]{40}$/);
  }
  assert.deepEqual([...new Set([...workflow.matchAll(/secrets\.([A-Z_]+)/g)].map((match) => match[1]))], ["DOCS_DEPLOY_KEY"]);
  assert.match(workflow, /SOURCE_COMMIT: \$\{\{ steps\.export\.outputs\.commit \}\}/);
  assert.ok(workflow.indexOf("bun run check") < workflow.indexOf("ssh-key:"));
  assert.ok(workflow.indexOf("bun scripts/docs-export.ts") < workflow.indexOf("ssh-key:"));
});

test("the job that holds the publishing key runs none of this repository's code", () => {
  const [, exporter, mirror] = workflow.split(/^  (?:export|mirror):\n/m);
  assert.ok(exporter && mirror, "Keep the export and mirror jobs");
  // The exporter runs the source and its dependencies, so it gets no environment and no secret.
  assert.doesNotMatch(exporter, /environment:|secrets\./);
  assert.match(exporter, /bun run check/);
  // The mirror job never checks out this repository, installs Bun or runs a script from it.
  assert.match(mirror, /needs: export\n/);
  assert.match(mirror, /environment: docs-mirror/);
  assert.doesNotMatch(mirror, /setup-bun|\bbun |scripts\/|node_modules/);
  const checkouts = [...mirror.matchAll(/uses: actions\/checkout@[a-f0-9]{40}[^\n]*\n {8}with:\n {10}repository: ([^\n]+)/g)];
  assert.equal(checkouts.length, 1);
  assert.equal(checkouts[0]![1], "unset-sh/docs");
  assert.equal((mirror.match(/uses: actions\/checkout@/g) ?? []).length, 1);
  // What arrives from the exporter is checked before the key is read.
  assert.ok(mirror.indexOf("^[0-9a-f]{40}$") < mirror.indexOf("secrets.DOCS_DEPLOY_KEY"));
  assert.ok(mirror.indexOf("! -type d ! -type f") < mirror.indexOf("secrets.DOCS_DEPLOY_KEY"));
});
