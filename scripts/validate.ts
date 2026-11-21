// Checks every recipe in recipes/ (see check.ts for the rules). Exits 1 and lists each problem if any fails.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { checkRecipe, loadContext } from "./check.ts";

const root = join(import.meta.dirname, "..");
const ctx = loadContext(root);
const recipesDir = join(root, "recipes");
const ids = readdirSync(recipesDir).filter((name) => statSync(join(recipesDir, name)).isDirectory());

const problems = ids.flatMap((id) => checkRecipe(ctx, join(recipesDir, id), id));
for (const problem of problems) console.error(`✗ ${problem}`);
if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s) in ${ids.length} recipe(s).`);
  process.exit(1);
}
console.log(`✓ ${ids.length} recipe(s) valid against sh.unset lexicons @ ${ctx.lexiconCommit}`);
