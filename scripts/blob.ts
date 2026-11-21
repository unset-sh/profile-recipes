// Blob references for the sample pictures a recipe ships in its assets/ folder.
// A blob's CID is CIDv1, raw codec (0x55), SHA-256, base32 (https://atproto.com/specs/blob, read 2026-11-21),
// so a reference in a record can be checked against the file it names.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { CID } from "multiformats/cid";
import * as raw from "multiformats/codecs/raw";
import { create as digest } from "multiformats/hashes/digest";

const SHA256_CODE = 0x12;

export type BlobRefJson = { $type: "blob"; ref: { $link: string }; mimeType: string; size: number };

export function cidOf(bytes: Uint8Array): string {
  const hash = createHash("sha256").update(bytes).digest();
  return CID.createV1(raw.code, digest(SHA256_CODE, hash)).toString();
}

export function blobRefFor(path: string, mimeType = "image/jpeg"): BlobRefJson {
  const bytes = readFileSync(path);
  return { $type: "blob", ref: { $link: cidOf(bytes) }, mimeType, size: bytes.length };
}

export type JpegFacts = { width: number; height: number; hasMetadata: boolean };

/**
 * Reads a JPEG's size from its first SOF marker and reports any APP1..APP15 segment (EXIF, XMP, ICC and the like),
 * since the app stores pictures with no metadata (sh.unset.defs#image). JFIF (APP0) carries none and is allowed.
 * Marker layout: ITU T.81 Annex B.
 */
export function jpegFacts(bytes: Uint8Array): JpegFacts | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined;
  let hasMetadata = false;
  let i = 2;
  while (i + 4 <= bytes.length) {
    if (bytes[i] !== 0xff) return undefined;
    const marker = bytes[i + 1] ?? 0;
    const length = ((bytes[i + 2] ?? 0) << 8) | (bytes[i + 3] ?? 0);
    if (marker >= 0xe1 && marker <= 0xef) hasMetadata = true;
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      const height = ((bytes[i + 5] ?? 0) << 8) | (bytes[i + 6] ?? 0);
      const width = ((bytes[i + 7] ?? 0) << 8) | (bytes[i + 8] ?? 0);
      return { width, height, hasMetadata };
    }
    i += 2 + length;
  }
  return undefined;
}
