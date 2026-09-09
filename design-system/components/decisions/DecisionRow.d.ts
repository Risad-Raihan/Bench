/**
 * Decisions log — chronological, newest first. One line each; expanding reveals the rationale.
 * Row grid: `14px 1fr 150px 130px 70px` (twisty, decision, venture-or-who, source, date).
 */
export interface DecisionRowProps {
  decision: string; date: string; who: string;
  /** set on the app-level view; omit inside a venture */ venture?: string;
  ventureColor?: string;
  /** backlink label to the note it came from, e.g. "Call with Tunde" */ source?: string;
  rationale?: string;
  expanded?: boolean; onToggle?: () => void; onOpenSource?: () => void;
}
export function DecisionRow(props: DecisionRowProps): JSX.Element;
/** Magenta-tinted backlink chip to the source note — magenta because quotes and note provenance are magenta. */
export interface SourceChipProps { children: React.ReactNode; onClick?: (e?: any) => void }
export function SourceChip(props: SourceChipProps): JSX.Element;
/** Copper-outlined mono action. The only "button" in Bench besides AddButton. */
export interface ActionButtonProps { children: React.ReactNode; onClick?: () => void; accent?: boolean; icon?: import("../media/Icon").Glyph }
export function ActionButton(props: ActionButtonProps): JSX.Element;
