// Playwright 1.63.0: local screenshots only; no provider requests, at desktop and mobile sizes.
// API source: node_modules/playwright-core/types/types.d.ts (Page.screenshot, BrowserContext.route).
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { render, type Mode } from "./render.ts";
const root = join(import.meta.dirname, "..");
const recipesDir = join(root, "recipes");
const ids = readdirSync(recipesDir).filter(id => statSync(join(recipesDir, id)).isDirectory());
render();
const browser = await chromium.launch();
let checks = 0;
try {
  for (const [size, width] of [["desktop", 1120], ["mobile", 390]] as const) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, colorScheme: "light" });
    const page = await context.newPage();
    const problems: string[] = [];
    page.on("pageerror", error => problems.push(error.message));
    page.on("request", request => { if (/^https?:/.test(request.url())) problems.push(`Unexpected network request: ${request.url()}`); });
    await context.route(/^https?:/, route => route.abort());
    for (const id of ids) {
      for (const mode of ["current", "media"] as const satisfies readonly Mode[]) {
        await page.goto(pathToFileURL(join(root, "dist", `${id}${mode === "media" ? "-media" : ""}.html`)).href);
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all([...document.images].map(image => image.decode()));
        });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        if (overflow) problems.push(`${id}/${mode}/${size}: page overflows horizontally`);
        const name = `preview${mode === "media" ? "-media" : ""}${size === "mobile" ? "-mobile" : ""}.png`;
        await page.screenshot({ path: join(recipesDir, id, name), fullPage: true });
        copyFileSync(join(recipesDir, id, name), join(root, "dist", id, name));
        checks++;
      }
      // Keyboard activation exercises the no-script avatar disclosure on both viewport sizes.
      await page.locator(".avatar-button").focus();
      await page.keyboard.press("Enter");
      if (!(await page.locator("#about").isVisible())) problems.push(`${id}/${size}: About failed to open`);
      await page.keyboard.press("Escape");
      if (await page.locator("#about").isVisible()) problems.push(`${id}/${size}: About failed to close`);
    }
    // Additional 320px and dark checks, without adding more committed screenshots.
    await page.setViewportSize({ width: 320, height: 700 });
    await page.emulateMedia({ colorScheme: "dark" });
    for (const id of ids) {
      await page.goto(pathToFileURL(join(root, "dist", `${id}-media.html`)).href);
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) problems.push(`${id}/dark/320: page overflow`);
    }
    await context.close();
    if (problems.length) throw new Error(problems.join("\n"));
  }
  const index = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1, colorScheme: "light" });
  await index.goto(pathToFileURL(join(root, "dist", "index.html")).href);
  await index.evaluate(async () => { for (const image of document.images) image.loading = "eager"; await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await index.screenshot({ path: join(root, "dist", "overview.png"), fullPage: true });
  console.log(`${checks} desktop/mobile screenshots; no horizontal page overflow, broken images, page errors or third-party requests. About keyboard checks passed. Also checked every media study at 320px in dark mode.`);
} finally { await browser.close(); }
