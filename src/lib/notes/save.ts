/**
 * Pure note-save helpers. `plain_text` is flattened from TipTap JSON so
 * Postgres FTS can index without parsing `content`. Snapshots are "blur
 * with changes OR every 5 min of continuous editing" (ADR-0003).
 */

export const SNAPSHOT_MS = 5 * 60 * 1000;

export const EMPTY_DOC: TipTapNode = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export type SnapshotReason = "blur" | "interval";

export type TipTapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
};

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "blockquote",
  "listItem",
  "bulletList",
  "orderedList",
  "codeBlock",
]);

function mentionLabel(node: TipTapNode): string {
  const label = node.attrs?.label;
  return typeof label === "string" ? label : "";
}

function nodeText(node: TipTapNode): string {
  if (node.type === "task" || node.type === "decision") return "";
  if (node.type === "mention") return mentionLabel(node);
  if (typeof node.text === "string") return node.text;
  if (!node.content?.length) return "";

  const inner = node.content.map(nodeText).join("");
  if (node.type && BLOCK_TYPES.has(node.type) && node.type !== "listItem") {
    return inner;
  }
  return inner;
}

/** Flatten a TipTap/ProseMirror JSON doc to searchable plain text. */
export function flattenToPlainText(doc: unknown): string {
  if (!doc || typeof doc !== "object") return "";
  const root = doc as TipTapNode;
  const blocks = (root.content ?? [])
    .map(nodeText)
    .map((t) => t.trim())
    .filter(Boolean);
  return blocks.join("\n\n");
}

function mentionVentureId(node: TipTapNode): string | null {
  const id = node.attrs?.ventureId;
  return typeof id === "string" && id ? id : null;
}

function walkMentions(node: TipTapNode, into: Set<string>) {
  if (node.type === "mention") {
    const id = mentionVentureId(node);
    if (id) into.add(id);
  }
  node.content?.forEach((child) => walkMentions(child, into));
}

/** Unique `@venture` ids in a TipTap doc, in insertion order. */
export function collectMentionVentureIds(doc: unknown): string[] {
  const ids = new Set<string>();
  if (doc && typeof doc === "object") walkMentions(doc as TipTapNode, ids);
  return [...ids];
}

/**
 * Mention ids added/removed between two docs. Used on autosave to reconcile
 * `note_mentions`. Duplicate mentions of the same venture collapse to one id.
 */
export function diffMentions(
  oldDoc: unknown,
  newDoc: unknown,
): { added: string[]; removed: string[] } {
  const oldIds = new Set(collectMentionVentureIds(oldDoc));
  const newIds = new Set(collectMentionVentureIds(newDoc));
  return {
    added: [...newIds].filter((id) => !oldIds.has(id)),
    removed: [...oldIds].filter((id) => !newIds.has(id)),
  };
}

export function asEditorDoc(content: unknown): TipTapNode {
  if (
    content &&
    typeof content === "object" &&
    (content as TipTapNode).type === "doc"
  ) {
    return content as TipTapNode;
  }
  return EMPTY_DOC;
}

export function shouldSnapshot(opts: {
  reason: SnapshotReason;
  hasChanges: boolean;
  since: Date;
  now: Date;
}): boolean {
  if (!opts.hasChanges) return false;
  if (opts.reason === "blur") return true;
  return opts.now.getTime() - opts.since.getTime() >= SNAPSHOT_MS;
}
