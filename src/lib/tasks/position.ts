/**
 * Fractional index for a task's place inside one board cell
 * `(venture, lane, status)`. Insert by averaging neighbours; rebalance
 * the cell when any gap drops below 0.0001.
 */
export const POSITION_GAP = 1000;
export const REBALANCE_THRESHOLD = 0.0001;

export function positionBetween(before?: number, after?: number): number {
  if (before == null && after == null) return POSITION_GAP;
  if (before == null) return after! / 2;
  if (after == null) return before + POSITION_GAP;
  return (before + after) / 2;
}

export function needsRebalance(sortedPositions: number[]): boolean {
  for (let i = 1; i < sortedPositions.length; i++) {
    if (sortedPositions[i] - sortedPositions[i - 1] < REBALANCE_THRESHOLD) {
      return true;
    }
  }
  return false;
}

export type Positioned = { id: string; position: number };

export function rebalance<T extends Positioned>(cellTasks: T[]): T[] {
  const sorted = cellTasks
    .map((task, index) => ({ task, index }))
    .sort((a, b) =>
      a.task.position === b.task.position
        ? a.index - b.index
        : a.task.position - b.task.position,
    );
  return sorted.map(({ task }, i) => ({
    ...task,
    position: (i + 1) * POSITION_GAP,
  }));
}
