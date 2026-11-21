// Screenshots each rendered recipe page (dist/<id>.html, from render.ts) into recipes/<id>/preview.png, in light mode
// at 2x for a sharp image on GitHub. Uses Playwright's Chromium (https://playwright.dev/docs/api/class-page#page-screenshot).
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = join(import.meta.dirname, "..");
const recipesDir = join(root, "recipes");
const ids = readdirSync(recipesDir).filter((id) => statSync(join(recipesDir, id)).isDirectory());

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 2, colorScheme: "light" });
for (const id of ids) {
  await page.goto(pathToFileURL(join(root, "dist", `${id}.html`)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(recipesDir, id, "preview.png"), fullPage: true });
  console.log(`recipes/${id}/preview.png`);
}
await browser.close();
