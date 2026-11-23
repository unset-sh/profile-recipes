// Prepare a new, isolated export. Publishing and credentials belong to docs-mirror.yml.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const repository = "https://github.com/unset-sh/profile-recipes";
const section = "profile-recipes";
const imageSource = "recipes/developer/preview.png";
const imagePage = "developer-example/index.md";
const imageReference = "../../recipes/developer/preview.png";

function inside(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path === "" || (!isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`));
}

function regularFile(root: string, path: string): Buffer {
  const parts = path.split("/");
  for (let i = 1; i < parts.length; i++) {
    const dir = lstatSync(join(root, ...parts.slice(0, i)));
    if (dir.isSymbolicLink() || !dir.isDirectory()) throw new Error(`Not a regular directory (symlink forbidden): ${path}`);
  }
  const stat = lstatSync(join(root, path));
  if (!stat.isFile() || stat.nlink !== 1) throw new Error(`Not a regular file (symlinks and hardlinks forbidden): ${path}`);
  return readFileSync(join(root, path));
}

function markdownFiles(root: string, directory = "docs"): string[] {
  const stat = lstatSync(join(root, directory));
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`Not a regular directory (symlink forbidden): ${directory}`);
  return readdirSync(join(root, directory)).sort().flatMap((name) => {
    const path = `${directory}/${name}`;
    const entry = lstatSync(join(root, path));
    if (entry.isDirectory()) return markdownFiles(root, path);
    regularFile(root, path);
    if (!path.endsWith(".md")) throw new Error(`Docs sources must be Markdown; add assets explicitly: ${path}`);
    return [path];
  });
}

const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

export function exportDocs(source: string, destination: string, commit: string): string {
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error("An exact 40-character source commit is required");
  const root = realpathSync(source);
  const requested = resolve(destination);
  const output = join(realpathSync(dirname(requested)), basename(requested));
  if (inside(root, output) || inside(output, root)) throw new Error("Export must not be inside the source or contain it");
  try {
    lstatSync(output);
    throw new Error(`Export destination already exists: ${output}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const sources = markdownFiles(root);
  if (!sources.includes("docs/_index.md")) throw new Error("docs/_index.md is required");
  const files: Array<{ path: string; source: string; license: string; original: Buffer; bytes: Buffer }> = sources.map((sourcePath) => {
    const original = regularFile(root, sourcePath);
    let content = original.toString("utf8");
    // Repository links in the authored page work on GitHub; the export freezes them to its source revision.
    content = content.replaceAll(`${repository}/blob/main/`, `${repository}/blob/${commit}/`);
    const path = sourcePath.slice("docs/".length);
    if (path === imagePage) {
      const link = `](${imageReference})`;
      if (content.split(link).length !== 2) throw new Error(`Expected one asset reference in ${sourcePath}`);
      content = content.replace(link, "](preview.png)");
    }
    content = `${content.trimEnd()}\n\n---\n\n[Source at ${commit.slice(0, 7)}](${repository}/blob/${commit}/${sourcePath}).\n`;
    return { path, source: sourcePath, license: "AGPL-3.0-only", original, bytes: Buffer.from(content) };
  });
  if (!sources.includes(`docs/${imagePage}`)) throw new Error(`docs/${imagePage} is required for the example asset reference`);
  for (const [sourcePath, path, license] of [
    ["LICENSE", "LICENSE", "AGPL-3.0-only"],
    ["LICENSE-CONTENT", "LICENSE-CONTENT", "CC0-1.0"],
    [imageSource, "developer-example/preview.png", "CC0-1.0"],
  ] as const) {
    const bytes = regularFile(root, sourcePath);
    files.push({ path, source: sourcePath, license, original: bytes, bytes });
  }
  files.sort((a, b) => a.path.localeCompare(b.path, "en"));
  const manifest = {
    schemaVersion: 1,
    repository,
    commit,
    sourcePath: "docs/",
    files: files.map(({ path, source, license, original, bytes }) => ({
      path, source, license, sourceSha256: sha256(original), sha256: sha256(bytes),
    })),
  };

  // All inputs are checked and read before creating anything; never replace an existing export.
  mkdirSync(output);
  try {
    for (const file of files) {
      const target = join(output, section, file.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.bytes, { flag: "wx" });
    }
    writeFileSync(join(output, section, "source.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
  } catch (error) {
    rmSync(output, { recursive: true, force: true });
    throw error;
  }
  return join(output, section);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const output = process.argv[2];
    if (!output || process.argv.length !== 3) throw new Error("Usage: bun scripts/docs-export.ts <new-output-directory>");
    const root = resolve(import.meta.dirname, "..");
    const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
    if (git("status", "--porcelain", "--untracked-files=all")) throw new Error("Commit source changes before exporting; provenance requires a clean checkout");
    const paths = [...markdownFiles(root), "LICENSE", "LICENSE-CONTENT", imageSource, "scripts/docs-export.ts"];
    git("ls-files", "--error-unmatch", "--", ...paths);
    const commit = git("rev-parse", "HEAD");
    console.log(`Exported ${exportDocs(root, output, commit)} from ${commit}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
