// The DCO check run by .github/workflows/dco.yml on each pull request. Exits 1, naming each commit and the fix, when a
// commit the pull request adds has no sign-off. See dco.ts for the rules and CONTRIBUTING.md for what contributors do.
import { join } from "node:path";
import { isExempt, readCommits, unsignedCommits } from "./dco.ts";

const base = process.env.BASE_SHA ?? "";
const head = process.env.HEAD_SHA ?? "";
const author = process.env.PR_AUTHOR ?? "";

if (author !== "" && isExempt(author)) {
  console.log(`✓ No sign-off needed for a pull request from ${author}.`);
  process.exit(0);
}

const commits = readCommits(join(import.meta.dirname, ".."), base, head);
const unsigned = unsignedCommits(commits);
if (unsigned.length === 0) {
  console.log(`✓ All ${commits.length} commit(s) are signed off.`);
  process.exit(0);
}

for (const c of unsigned) {
  const subject = c.message.split("\n")[0] ?? "";
  console.log(`::error title=Missing sign-off::${c.sha.slice(0, 7)} ${subject}`);
}
console.error(`
${unsigned.length} of ${commits.length} commit(s) have no "Signed-off-by:" line.

Signing off certifies the Developer Certificate of Origin (https://developercertificate.org): the work is yours
to give. To add it, then push again with --force-with-lease:
  one commit:      git commit --amend --no-edit -s
  several commits: git rebase --signoff origin/main
Commits made in GitHub's web editor are signed off for you.`);
process.exit(1);
