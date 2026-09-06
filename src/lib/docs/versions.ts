/**
 * Linear doc version chains. A new upload points `supersedesId` at the
 * current head; archiving the head resurfaces the prior live row.
 * Pure over fixture rows — no database.
 */
export type DocVersion = {
  id: string;
  supersedesId: string | null;
  archivedAt: Date | null;
};

function live(rows: DocVersion[]): DocVersion[] {
  return rows.filter((row) => row.archivedAt == null);
}

export function isSuperseded(doc: DocVersion, rows: DocVersion[]): boolean {
  return live(rows).some((row) => row.supersedesId === doc.id);
}

export function chainHead(rows: DocVersion[]): DocVersion | null {
  const open = live(rows);
  const superseded = new Set(
    open.map((row) => row.supersedesId).filter((id): id is string => id != null),
  );
  return open.find((row) => !superseded.has(row.id)) ?? null;
}

export function resolveVersionChain(rows: DocVersion[]): DocVersion[] {
  const head = chainHead(rows);
  if (!head) return [];
  const byId = new Map(rows.map((row) => [row.id, row]));
  const chain: DocVersion[] = [];
  const seen = new Set<string>();
  let current: DocVersion | undefined = head;
  while (current && !seen.has(current.id)) {
    chain.push(current);
    seen.add(current.id);
    current = current.supersedesId
      ? byId.get(current.supersedesId)
      : undefined;
  }
  return chain;
}

/** False when a live row already supersedes `parentId` (a branch). */
export function canSupersede(parentId: string, rows: DocVersion[]): boolean {
  return !live(rows).some((row) => row.supersedesId === parentId);
}
