/**
 * The venture identity header — the only place in Bench that uses a gradient: 97° at 17% opacity, plus a 2px full-strength rule.
 * Pass `color` (the venture's identity colour, picked at onboarding) and the wash is derived from it — one hue fading into the warm black,
 * so every venture's header, card edge, dot and tabs read as the same colour. Omit `color` and it falls back to the four-colour studio wash.
 * @startingPoint section="Venture" subtitle="Venture header, gate rail and tabs" viewport="1180x300"
 */
export interface VentureHeaderProps {
  name: string; sub: string;
  tags?: ({ label: string; hot?: boolean } | string)[];
  stage: string; stageMeta?: string;
  /** the venture's identity colour, e.g. var(--magenta) — drives the header gradient and top rule */ color?: string;
}
export function VentureHeader(props: VentureHeaderProps): JSX.Element;
/** Outlined mono uppercase chip for the venture header. `hot` = amber, the only warning colour. */
export interface TagProps { children: React.ReactNode; hot?: boolean }
export function Tag(props: TagProps): JSX.Element;
/** Five stage cells with state: "done" (teal, full rule), "now" (copper, 66% rule, raised surface), or undefined (locked). */
export interface GateRailProps { gates: { stage: string; label: string; state?: "done" | "now" }[]; onSelect?: (stage: string) => void }
export function GateRail(props: GateRailProps): JSX.Element;
/** Raised mono tabs carrying the venture accent on the active tab's top edge. */
export interface VentureTabsProps { tabs: { label: string; count?: number }[]; active: string; onSelect?: (label: string) => void; scope?: string; accent?: string }
export function VentureTabs(props: VentureTabsProps): JSX.Element;
