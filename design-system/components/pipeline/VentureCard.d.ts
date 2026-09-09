/**
 * A venture on the pipeline board: 3px identity left edge, 14.5px name, 11.5px caption, six-segment gate rail, footer with the AVL owner chip and the founder's name.
 * Progress lives in the gate rail and the column header track — no percentage or ratio figures on the card.
 * @startingPoint section="Pipeline" subtitle="Five-stage venture board" viewport="1180x420"
 */
export interface VentureCardProps {
  name: string; caption: string;
  /** venture identity colour, e.g. var(--magenta) */ color?: string;
  gates?: number; gateTotal?: number;
  /** AVL owner initials, e.g. "RN" */ who: string;
  /** AVL owner's avatar key ("av-07"); renders in place of the initials chip when set */ ownerAvatar?: string | null;
  /** the founder's avatar key ("av-07"), shown next to their name */ founderAvatar?: string | null;
  /** the founder's name, captured at onboarding — sits opposite the owner chip */ founder?: string;
  /** an amber warning that REPLACES the founder line, e.g. "STALE 14D". Amber always means look here, so it outranks the name. */ flag?: string;
  onClick?: () => void;
  /** index for the staggered entrance (0,1,2…) */ rise?: number;
  /** false drops the six-segment gate rail — the "clean" card: name, one-liner, owner */ showGates?: boolean;
  /** false drops the founder line, leaving the owner chip alone */ showMeta?: boolean;
}
export function VentureCard(props: VentureCardProps): JSX.Element;
export interface GateBarProps { total?: number; filled?: number; color?: string; height?: number; gap?: number }
export function GateBar(props: GateBarProps): JSX.Element;
export interface WhoChipProps { initials: string; size?: number }
export function WhoChip(props: WhoChipProps): JSX.Element;
/** Dashed mono-uppercase affordance at the bottom of a stage column. */
export interface AddButtonProps { children?: React.ReactNode; onClick?: () => void; icon?: import("../media/Icon").Glyph }
export function AddButton(props: AddButtonProps): JSX.Element;
/** One of the five stage columns. Sits on --bg2 so every card is one surface step above its column — that step, not a background gradient, is how the board separates. */
export interface StageColumnProps { stage: string; count: string; progress?: number; color?: string; steps?: number; children?: React.ReactNode }
export function StageColumn(props: StageColumnProps): JSX.Element;
/** Five- or six-column grid with 1px --grid gaps. Default is the five stage columns; pass `columns={6}` when the Application intake column is present (ADR-0002). */
export function PipelineBoard(props: { children?: React.ReactNode; columns?: number }): JSX.Element;
