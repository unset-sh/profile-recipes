// sync.mjs: copies agent-kit at one commit of its main branch into a repository, and checks that copy.
//
//   node .claude/agent-kit/sync.mjs --check                 the copy matches its lock (no network)
//   node .claude/agent-kit/sync.mjs <commit>                install the kit as it is at that commit of main
//   node .claude/agent-kit/sync.mjs <commit> --from <repo>  fetch from that git repository instead of GitHub
//   --root <folder>                                         act on that repository instead of the current folder
//
// Run it from the repository root. It reads and writes only the paths the kit owns:
//   .claude/rules/org/**   .claude/skills/org-*/**   .claude/agents/org-*.md   .claude/agent-kit/**
// It fetches main with git into a temporary folder, refuses a commit that is not on main, and copies the
// shipped files from that commit's tree. A full commit id names exactly one tree, so the pin is the content.
// Node built-ins and the git command only, so adopting the kit adds no dependency. The source is
// unset-sh/agent-kit; this file is one of the copied files and is checked like the others.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const KIT = "unset-sh/agent-kit";
export const LOCK_PATH = ".claude/agent-kit/lock.json";
export const SYNC_PATH = ".claude/agent-kit/sync.mjs";
export const SOURCE = `https://github.com/${KIT}.git`;

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
// Names Windows reserves, with or without an extension ("NUL.txt and NUL.tar.gz are both equivalent to NUL"), and
// it says no name may end in a period. Read 2026-11-22: https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file
// COM0 and LPT0 are not on its list; refusing them too costs nothing. Superscript digits never pass SEGMENT.
const RESERVED = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\.|$)/i;
const ORG_NAME = /^org-[a-z0-9]+(-[a-z0-9]+)*$/;
const COMMIT = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const MAX_PATH = 200;
const MAX_DEST = 240;
const MAX_FILES = 500;
const MAX_FILE_BYTES = 1024 * 1024;
const GIT_TIMEOUT_MS = 120_000;
/** Where the kit's own files live in its repository. A tree entry anywhere else is not the kit's. */
const SHIPPED_FOLDERS = ["rules/", "skills/", "agents/"];
const REGULAR_FILE_MODES = new Set(["100644", "100755"]);

/** A refusal with a message a person can act on. Anything else that is thrown is a bug. */
export class SyncError extends Error {}

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

/** A path segment every file system the organisation uses can hold: no "..", no trailing dot, no reserved name. */
function portableSegment(part) {
  return SEGMENT.test(part) && !part.endsWith(".") && !RESERVED.test(part);
}

/**
 * Where a kit file lands in a repository, or null when the kit may not ship that path. The destination is
 * computed here from fixed rules and never read from the kit, so a commit cannot choose where it writes.
 */
export function destinationOf(path) {
  if (typeof path !== "string" || path.length === 0 || path.length > MAX_PATH) return null;
  const parts = path.split("/");
  if (!parts.every(portableSegment)) return null;
  if (path === "sync.mjs") return SYNC_PATH;
  const [area, second] = parts;
  const leaf = parts.at(-1);
  if (area === "rules" && parts.length === 2 && leaf.endsWith(".md")) return `.claude/rules/org/${leaf}`;
  if (area === "agents" && parts.length === 2 && leaf.endsWith(".md") && ORG_NAME.test(leaf.slice(0, -3))) {
    return `.claude/agents/${leaf}`;
  }
  if (area === "skills" && parts.length >= 3 && ORG_NAME.test(second) && leaf.endsWith(".md")) {
    return `.claude/${path}`;
  }
  return null;
}

/**
 * True only for a repository path that destinationOf can produce, so a lock cannot name any other file. The
 * lock itself is written by this script, never copied from the kit, and is not a kit destination.
 */
export function isKitDestination(dest) {
  if (typeof dest !== "string" || dest.length > MAX_DEST) return false;
  if (dest === SYNC_PATH) return true;
  const source = [
    [".claude/rules/org/", "rules/"],
    [".claude/agents/", "agents/"],
    [".claude/skills/", "skills/"],
  ].find(([prefix]) => dest.startsWith(prefix));
  if (source === undefined) return false;
  return destinationOf(source[1] + dest.slice(source[0].length)) === dest;
}

/**
 * Refuse a set of destinations that would collide on a file system that ignores letter case (macOS, Windows):
 * the same file twice, the same folder spelt two ways, or a file where another file needs a folder.
 */
function assertNoCollision(destinations) {
  const files = new Set();
  const folders = new Map();
  for (const dest of destinations) {
    const lower = dest.toLowerCase();
    if (files.has(lower)) throw new SyncError(`the kit lists ${dest} twice`);
    files.add(lower);
    const parts = dest.split("/");
    for (let depth = 1; depth < parts.length; depth += 1) {
      const folder = parts.slice(0, depth).join("/");
      const spelt = folders.get(folder.toLowerCase());
      if (spelt !== undefined && spelt !== folder) {
        throw new SyncError(`the kit spells one folder two ways: ${spelt} and ${folder}`);
      }
      folders.set(folder.toLowerCase(), folder);
    }
  }
  for (const lower of files) {
    if (folders.has(lower)) throw new SyncError(`the kit needs ${folders.get(lower)} as both a file and a folder`);
  }
}

/** True for a path in the kit's repository that the kit ships, or that it would have to refuse. */
function inShippedArea(path) {
  return path === "sync.mjs" || SHIPPED_FOLDERS.some((folder) => path.startsWith(folder));
}

/**
 * Turn the tree of one kit commit into the files to install. `entries` are the commit's tree entries as
 * { path, mode, size, read }, where read() returns the bytes. Checks, in order: the commit, then for each
 * entry in a shipped folder that it is a regular file, that the kit may ship its path, and its size; then
 * that no two destinations collide, and that sync.mjs is among them. Entries elsewhere are not the kit's.
 */
export function kitFromTree(commit, entries) {
  if (typeof commit !== "string" || !COMMIT.test(commit)) throw new SyncError("the kit commit is not a full 40-character commit id");
  const files = new Map();
  for (const { path, mode, size, read } of entries) {
    if (!inShippedArea(path)) continue;
    if (!REGULAR_FILE_MODES.has(mode)) throw new SyncError(`${path} is a link or not a regular file; the kit ships only regular files`);
    const dest = destinationOf(path);
    if (dest === null) throw new SyncError(`${path} is in a shipped folder, but the kit may not ship that path`);
    if (files.has(dest)) throw new SyncError(`the kit lists ${dest} twice`);
    if (size > MAX_FILE_BYTES) throw new SyncError(`${path} is larger than the kit allows`);
    if (files.size >= MAX_FILES) throw new SyncError("the kit has more files than it allows");
    const bytes = read();
    files.set(dest, { sha256: sha256(bytes), bytes });
  }
  assertNoCollision(files.keys());
  if (!files.has(SYNC_PATH)) throw new SyncError("the kit commit does not contain sync.mjs");
  return { commit, files };
}

function assertRepositoryRoot(root) {
  if (!existsSync(join(root, ".git"))) {
    throw new SyncError(`${root} is not a repository root (no .git). Run this from the repository root.`);
  }
}

/** The first symbolic link on the way to a path, or null. Nothing here reads or writes through a link. */
function symlinkOnPath(root, dest) {
  const parts = dest.split("/");
  for (let depth = 1; depth <= parts.length; depth += 1) {
    const partial = parts.slice(0, depth).join("/");
    const stat = lstatSync(join(root, ...partial.split("/")), { throwIfNoEntry: false });
    if (stat === undefined) return null;
    if (stat.isSymbolicLink()) return partial;
  }
  return null;
}

function assertNoSymlink(root, dest) {
  const link = symlinkOnPath(root, dest);
  if (link !== null) throw new SyncError(`${link} is a symbolic link; the kit does not write through links`);
}

/** The folders that hold the kit's names. Each must be a real folder, or absent, before anything is walked. */
const KIT_FOLDERS = [".claude", ".claude/rules", ".claude/rules/org", ".claude/skills", ".claude/agents", ".claude/agent-kit"];

function assertRealKitFolders(root) {
  for (const folder of KIT_FOLDERS) {
    const stat = lstatSync(join(root, ...folder.split("/")), { throwIfNoEntry: false });
    if (stat === undefined) continue;
    if (stat.isSymbolicLink()) throw new SyncError(`${folder} is a symbolic link; the kit does not read or write through links`);
    if (!stat.isDirectory()) throw new SyncError(`${folder} is not a folder`);
  }
}

function walk(root, folder, found) {
  const entries = readdirSync(join(root, ...folder.split("/")), { withFileTypes: true });
  for (const entry of entries) {
    const path = `${folder}/${entry.name}`;
    if (entry.isDirectory()) walk(root, path, found);
    else found.push(path);
  }
}

function namesIn(root, folder) {
  const stat = lstatSync(join(root, ...folder.split("/")), { throwIfNoEntry: false });
  if (stat === undefined || !stat.isDirectory()) return [];
  return readdirSync(join(root, ...folder.split("/")), { withFileTypes: true });
}

/** Every file, link or other entry under the kit's names in a repository, except the lock. Sorted. */
export function ownedEntries(root) {
  const found = [];
  for (const folder of [".claude/rules/org", ".claude/agent-kit"]) {
    const stat = lstatSync(join(root, ...folder.split("/")), { throwIfNoEntry: false });
    if (stat === undefined) continue;
    if (stat.isDirectory()) walk(root, folder, found);
    else found.push(folder);
  }
  for (const entry of namesIn(root, ".claude/skills")) {
    if (!entry.name.startsWith("org-")) continue;
    if (entry.isDirectory()) walk(root, `.claude/skills/${entry.name}`, found);
    else found.push(`.claude/skills/${entry.name}`);
  }
  for (const entry of namesIn(root, ".claude/agents")) {
    if (entry.name.startsWith("org-")) found.push(`.claude/agents/${entry.name}`);
  }
  return found.filter((path) => path !== LOCK_PATH).sort();
}

function readLock(root) {
  const stat = lstatSync(join(root, ...LOCK_PATH.split("/")), { throwIfNoEntry: false });
  if (stat === undefined) throw new SyncError(`${LOCK_PATH} is missing`);
  if (!stat.isFile()) throw new SyncError(`${LOCK_PATH} is not a regular file`);
  let lock;
  try {
    lock = JSON.parse(readFileSync(join(root, ...LOCK_PATH.split("/")), "utf8"));
  } catch {
    throw new SyncError(`${LOCK_PATH} is not valid JSON`);
  }
  const valid =
    lock !== null &&
    typeof lock === "object" &&
    lock.kit === KIT &&
    typeof lock.commit === "string" &&
    COMMIT.test(lock.commit) &&
    lock.files !== null &&
    typeof lock.files === "object" &&
    !Array.isArray(lock.files);
  if (!valid) throw new SyncError(`${LOCK_PATH} does not have the shape this script writes`);
  for (const [dest, hash] of Object.entries(lock.files)) {
    if (!isKitDestination(dest)) throw new SyncError(`${LOCK_PATH} lists a path the kit does not own: ${dest}`);
    if (typeof hash !== "string" || !SHA256.test(hash)) throw new SyncError(`${LOCK_PATH} has no valid sha256 for ${dest}`);
  }
  if (!Object.hasOwn(lock.files, SYNC_PATH)) throw new SyncError(`${LOCK_PATH} does not list ${SYNC_PATH}`);
  return lock;
}

/**
 * Compare the copy with its lock. Returns a list of problems in plain words; an empty list means the copy is
 * exactly what the lock records. Reads nothing from the network.
 */
export function check(root) {
  assertRepositoryRoot(root);
  assertRealKitFolders(root);
  assertNoSymlink(root, LOCK_PATH);
  const lock = readLock(root);
  const problems = [];
  for (const [dest, hash] of Object.entries(lock.files).sort(([a], [b]) => (a < b ? -1 : 1))) {
    const link = symlinkOnPath(root, dest);
    const stat = lstatSync(join(root, ...dest.split("/")), { throwIfNoEntry: false });
    if (link !== null) problems.push(`reached through a symbolic link (${link}): ${dest}`);
    else if (stat === undefined) problems.push(`missing: ${dest}`);
    else if (!stat.isFile()) problems.push(`not a regular file: ${dest}`);
    else if (sha256(readFileSync(join(root, ...dest.split("/")))) !== hash) problems.push(`changed: ${dest}`);
  }
  for (const path of ownedEntries(root)) {
    if (!Object.hasOwn(lock.files, path)) problems.push(`not part of the kit, but under the kit's names: ${path}`);
  }
  return { commit: lock.commit, problems };
}

/**
 * Replace the kit's files in a repository with those of a validated kit commit, then write the lock. Returns
 * the lock and the paths it removed. A first install, with no lock yet, refuses to touch anything already under
 * the kit's names, because those files are the repository's and not an earlier commit's.
 */
export function install(root, kit) {
  assertRepositoryRoot(root);
  assertRealKitFolders(root);
  for (const dest of [...kit.files.keys(), LOCK_PATH]) assertNoSymlink(root, dest);
  const present = ownedEntries(root);
  const hasLock = lstatSync(join(root, ...LOCK_PATH.split("/")), { throwIfNoEntry: false }) !== undefined;
  if (!hasLock && present.length > 0) {
    throw new SyncError(`no lock yet, but files already use the kit's names; rename or remove them first: ${present.join(", ")}`);
  }
  const removed = present.filter((path) => !kit.files.has(path));
  for (const path of removed) rmSync(join(root, ...path.split("/")), { force: true });
  const locked = {};
  for (const dest of [...kit.files.keys()].sort()) {
    const { sha256: hash, bytes } = kit.files.get(dest);
    const target = join(root, ...dest.split("/"));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
    locked[dest] = hash;
  }
  const lock = { kit: KIT, commit: kit.commit, files: locked };
  mkdirSync(dirname(join(root, ...LOCK_PATH.split("/"))), { recursive: true });
  writeFileSync(join(root, ...LOCK_PATH.split("/")), `${JSON.stringify(lock, null, 2)}\n`);
  return { lock, removed };
}

/** Variables that would point git at another repository than the temporary one. */
const REPOSITORY_VARIABLES = [
  "GIT_DIR",
  "GIT_WORK_TREE",
  "GIT_INDEX_FILE",
  "GIT_OBJECT_DIRECTORY",
  "GIT_ALTERNATE_OBJECT_DIRECTORIES",
  "GIT_COMMON_DIR",
  "GIT_NAMESPACE",
];

// Which transports git may use. GIT_ALLOW_PROTOCOL overrides every protocol.*.allow setting, including one given
// with -c, so it is set here rather than inherited (read 2026-11-23: https://github.com/git/git/blob/v2.43.0/
// Documentation/git.txt and Documentation/config/protocol.txt). https reaches GitHub, file a local --from; ext::,
// ssh and any git-remote-<name> helper on PATH are refused.
const ALLOWED_PROTOCOLS = "https:file";
// No hook from the user's template or config runs in the temporary repository (fetch fires reference-transaction),
// and every fetched object is checked as it arrives.
const GIT_SETTINGS = ["-c", "core.hooksPath=/dev/null", "-c", "fetch.fsckObjects=true"];

/** Text from git with any password or token in a URL taken out, so it can be printed in a CI log. */
function withoutCredentials(text, source) {
  const named = source === SOURCE ? text : text.replaceAll(source, "the --from repository");
  return named.replace(/\/\/[^/@\s]*@/g, "//");
}

/**
 * Run git in the temporary repository: never prompting for credentials, only over https or a local path, never
 * running a hook, and never pointed elsewhere by the caller's environment. A failure becomes a refusal that
 * names the step.
 */
function git(cwd, args, step, source = SOURCE) {
  const env = { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_ALLOW_PROTOCOL: ALLOWED_PROTOCOLS };
  for (const name of REPOSITORY_VARIABLES) delete env[name];
  try {
    return execFileSync("git", [...GIT_SETTINGS, ...args], {
      cwd,
      env,
      maxBuffer: MAX_FILE_BYTES * 2,
      stdio: ["ignore", "pipe", "pipe"],
      timeout: GIT_TIMEOUT_MS,
    });
  } catch (error) {
    const said = withoutCredentials(String(error.stderr ?? "").trim().split("\n").at(-1) || error.message, source);
    throw new SyncError(`${step} failed (${said})`);
  }
}

// `ls-tree -l -z` prints "<mode> <type> <object> <size, padded>\t<path>\0" with the path verbatim and "-" as the
// size of a non-blob (read 2026-11-23 at https://git-scm.com/docs/git-ls-tree, page of git 2.42.0).
/** The entries of a commit's tree, each with a read() that loads the blob from the local object store. */
function treeEntries(cwd, commit) {
  const listing = git(cwd, ["ls-tree", "-r", "-l", "-z", "--full-tree", commit], "listing the kit commit's files");
  return listing
    .toString("utf8")
    .split("\0")
    .filter((line) => line.length > 0)
    .map((line) => {
      const tab = line.indexOf("\t");
      const [mode, , object, size] = line.slice(0, tab).split(/ +/);
      const path = line.slice(tab + 1);
      return { path, mode, size: Number(size), read: () => git(cwd, ["cat-file", "blob", object], `reading ${path}`) };
    });
}

/**
 * Fetch the kit's main branch into a temporary repository, refuse a commit that is not on it, and read that
 * commit's tree. Main is fetched by name, so the commit is present only if main contains it.
 */
export function fetchKit(commit, source = SOURCE) {
  if (!COMMIT.test(commit)) throw new SyncError("the kit commit is not a full 40-character commit id");
  if (typeof source !== "string" || source.length === 0 || source.startsWith("-")) {
    throw new SyncError("--from must name a git repository");
  }
  const folder = mkdtempSync(join(tmpdir(), "agent-kit-"));
  try {
    git(folder, ["init", "--quiet"], "preparing a temporary repository");
    const from = source === SOURCE ? SOURCE : "the --from repository";
    git(folder, ["fetch", "--quiet", "--no-tags", source, "+refs/heads/main:refs/kit/main"], `fetching main from ${from}`, source);
    const onMain = `${commit} is not a commit on the kit's main branch`;
    let type;
    try {
      type = git(folder, ["cat-file", "-t", commit], "looking up the commit").toString("utf8").trim();
    } catch {
      throw new SyncError(onMain);
    }
    if (type !== "commit") throw new SyncError(onMain);
    try {
      // Exit 0: an ancestor; 1: not; anything else: an error. All but 0 refuse (https://git-scm.com/docs/git-merge-base).
      git(folder, ["merge-base", "--is-ancestor", commit, "refs/kit/main"], "checking the commit is on main");
    } catch {
      throw new SyncError(onMain);
    }
    return kitFromTree(commit, treeEntries(folder, commit));
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}

function parseArguments(argv) {
  const options = { check: false, commit: null, from: SOURCE, root: process.cwd() };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--check") options.check = true;
    else if (argument === "--from" || argument === "--root") {
      const value = argv[index + 1];
      if (value === undefined) throw new SyncError(`${argument} needs a value`);
      options[argument.slice(2)] = value;
      index += 1;
    } else if (COMMIT.test(argument) && options.commit === null) options.commit = argument;
    else throw new SyncError(`unknown argument: ${argument}`);
  }
  if (options.check === (options.commit !== null)) {
    throw new SyncError("usage: sync.mjs --check | sync.mjs <full commit of agent-kit main> [--from <git repository>]");
  }
  if (options.check && options.from !== SOURCE) throw new SyncError("--from has no meaning with --check");
  return options;
}

export async function main(argv, print = console.log) {
  const options = parseArguments(argv);
  if (options.check) {
    const { commit, problems } = check(options.root);
    if (problems.length === 0) {
      print(`agent-kit ${commit.slice(0, 7)}: the copy matches its lock.`);
      return 0;
    }
    print(`agent-kit ${commit.slice(0, 7)}: the copy does not match its lock.`);
    for (const problem of problems) print(`  ${problem}`);
    print("Kit files are never edited here. Change unset-sh/agent-kit, or restore the copy with:");
    print(`  node ${SYNC_PATH} ${commit}`);
    return 1;
  }
  const { lock, removed } = install(options.root, fetchKit(options.commit, options.from));
  print(`agent-kit ${lock.commit.slice(0, 7)}: ${Object.keys(lock.files).length} files written.`);
  for (const path of removed) print(`  removed, no longer in the kit: ${path}`);
  return 0;
}

/**
 * True when Node was started on this file, by any path that leads to it. Both sides are resolved, because a
 * repository may be reached through a linked folder, and a script that silently did nothing would let a broken
 * copy pass its check.
 */
function startedAsScript() {
  if (process.argv[1] === undefined) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (startedAsScript()) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (error) {
    if (!(error instanceof SyncError)) throw error;
    console.error(`sync.mjs: ${error.message}`);
    process.exitCode = 1;
  }
}
