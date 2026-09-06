import {
  getDownloadUrl,
  issueSignedToken,
  presignUrl,
} from "@vercel/blob";

const DEFAULT_TTL_MS = 60_000;

export function blobPathname(storageKey: string): string {
  try {
    const url = new URL(storageKey);
    if (url.hostname.endsWith("blob.vercel-storage.com")) {
      return decodeURIComponent(url.pathname.replace(/^\//, ""));
    }
  } catch {
    // already a pathname
  }
  return storageKey.replace(/^\//, "");
}

export async function signedDownloadUrl(
  storageKey: string,
  opts: { download?: boolean; validMs?: number } = {},
): Promise<string> {
  const pathname = blobPathname(storageKey);
  const validUntil = Date.now() + (opts.validMs ?? DEFAULT_TTL_MS);
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(token, {
    operation: "get",
    pathname,
    access: "private",
    validUntil,
  });
  return opts.download ? getDownloadUrl(presignedUrl) : presignedUrl;
}
