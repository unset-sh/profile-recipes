// Prints the blob reference and aspect ratio for a sample picture, ready to paste into a card record.
// Usage: bun run blob-ref -- recipes/<id>/assets/<file>.jpg
import { readFileSync } from "node:fs";
import { blobRefFor, jpegFacts } from "./blob.ts";

const path = process.argv[2];
if (path === undefined) {
  console.error("usage: bun run blob-ref -- <file.jpg>");
  process.exit(2);
}
const facts = jpegFacts(readFileSync(path));
if (facts === undefined) {
  console.error(`${path}: not a JPEG`);
  process.exit(1);
}
const image = { image: blobRefFor(path), alt: "", aspectRatio: { width: facts.width, height: facts.height } };
console.log(JSON.stringify(image, null, 2));
