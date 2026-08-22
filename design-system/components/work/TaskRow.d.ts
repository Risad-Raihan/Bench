/**
 * My work — every task assigned to you across every venture, grouped by when. The first screen the partners open.
 * @startingPoint section="My work" subtitle="Cross-venture task list" viewport="1180x520"
 */
export interface TaskRowProps {
  title: string; venture: string;
  /** venture identity colour for the dot */ ventureColor?: string;
  /** lane label: Thesis | Tech | GTM | Capital | Ops */ lane: string;
  laneColor?: string;
  /** mono date or em dash */ date?: string;
  /** renders the date amber, e.g. "2D LATE" */ late?: boolean;
  done?: boolean; onToggle?: () => void; onClick?: () => void;
}
export function TaskRow(props: TaskRowProps): JSX.Element;
/** Copper-outlined mono filter chips. Exactly one active. */
export interface FilterBarProps { filters: string[]; active?: string; onSelect?: (f: string) => void }
export function FilterBar(props: FilterBarProps): JSX.Element;
/** Sticky-feeling group divider: Overdue (amber) / This week / No date. */
export interface GroupHeaderProps { label: string; count: number | string; hot?: boolean }
export function GroupHeader(props: GroupHeaderProps): JSX.Element;
