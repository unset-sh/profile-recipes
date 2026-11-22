// What the DCO check asks of a pull request: every commit it adds carries a Developer Certificate of Origin sign-off,
// a `Signed-off-by: Name <email>` line on its own (https://developercertificate.org). The check run is dco-check.ts.
import { execFileSync } from "node:child_process";

export type Commit = { sha: string; parents: number; message: string };

// The owner's pull requests need no sign-off: the work is his, and agents open their pull requests under his account.
// Bots (Dependabot and the like) cannot certify anything.
const OWNER = "undefined6799";

export function isExempt(login: string): boolean {
  const name = login.toLowerCase();
  return name === OWNER || name.endsWith("[bot]");
}

// A whole line, as `git commit -s` and GitHub's web editor write it. The name and email are not compared with the
// commit's author: the line is the contributor's statement, and matching would fail people for a typo.
const SIGNOFF = /^Signed-off-by: \S.*<[^<>\s]+@[^<>\s]+>\s*$/im;

/** The commits that need a sign-off and have none. A merge commit adds no work of its own, so it needs none. */
export function unsignedCommits(commits: Commit[]): Commit[] {
  return commits.filter((c) => c.parents < 2 && !SIGNOFF.test(c.message));
}

/** True for a full 40-character commit id, so nothing else reaches git as an argument. */
export function isObjectId(value: string): boolean {
  return /^[0-9a-f]{40}$/.test(value);
}

/** The commits reachable from `head` and not from `base`, newest first. */
export function readCommits(repo: string, base: string, head: string): Commit[] {
  if (!isObjectId(base) || !isObjectId(head)) throw new Error("base and head must be full commit ids");
  const log = execFileSync("git", ["log", "--format=%H%x00%P%x00%B%x1e", `${base}..${head}`], {
    cwd: repo,
    encoding: "utf8",
  });
  return log
    .split("\x1e")
    .map((record) => record.replace(/^\n/, ""))
    .filter((record) => record.length > 0)
    .map((record) => {
      const [sha = "", parents = "", message = ""] = record.split("\x00");
      return { sha, parents: parents.split(" ").filter(Boolean).length, message };
    });
}
