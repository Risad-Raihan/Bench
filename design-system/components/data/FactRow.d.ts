/** Key/value line inside a Panel: 104px mono uppercase key, 12.5px value. `mono` for figures. */
export interface FactRowProps { k: string; v: React.ReactNode; color?: string; mono?: boolean }
export function FactRow(props: FactRowProps): JSX.Element;
/** Hairline mono chip for an external link (repo, Figma, Play Store, Granola) or a source-note backlink. Copper on hover. */
export interface LinkChipProps { children: React.ReactNode; onClick?: () => void }
export function LinkChip(props: LinkChipProps): JSX.Element;
/** One gate in the current stage's checklist: teal tick, label, and who cleared it. A cleared gate is a milestone, not a cancelled task — the label drops to --dim, never struck through. */
export interface ChecklistRowProps { label: string; by?: string; done?: boolean; onToggle?: () => void }
export function ChecklistRow(props: ChecklistRowProps): JSX.Element;
/** Open-task count for one lane, drawn as a segment bar in the lane colour. */
export interface LaneBarRowProps { lane: string; color: string; open: number; max?: number }
export function LaneBarRow(props: LaneBarRowProps): JSX.Element;
/** Generic one-line row — a note, a meeting, anything with a label and one mono figure. */
export interface LineRowProps { label: string; meta?: React.ReactNode; color?: string; onClick?: () => void }
export function LineRow(props: LineRowProps): JSX.Element;
/** Activity feed line: actor initials, coloured event dot, one-line text, relative time. Text truncates rather than wrapping — the feed is scannable history, not content. */
export interface ActivityRowProps {
  who: string; text: React.ReactNode; when: string; color?: string;
  /** tighter row for a side column — 17px chip, 12px text, 6px padding */ compact?: boolean;
}
export function ActivityRow(props: ActivityRowProps): JSX.Element;
