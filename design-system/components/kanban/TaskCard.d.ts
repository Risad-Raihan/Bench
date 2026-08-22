/**
 * Task board inside a venture: four lanes (Thesis, Tech, GTM, Capital) × four columns (To do, Doing, Blocked, Done).
 * @startingPoint section="Venture" subtitle="Four-lane task board" viewport="1180x460"
 */
export interface TaskCardProps {
  title: string; who: string;
  /** plain mono note, e.g. a completion date */ note?: string;
  /** due date — renders amber */ due?: string;
  /** task created from a note block — renders violet "FROM NOTE" */ fromNote?: boolean;
  done?: boolean;
  /** lane or venture accent for the 2px left edge */ color?: string;
  onClick?: () => void;
}
export function TaskCard(props: TaskCardProps): JSX.Element;
export interface KanbanColumnProps { label: string; children?: React.ReactNode }
export function KanbanColumn(props: KanbanColumnProps): JSX.Element;
export interface LaneProps { name: string; color: string; count: number | string; children?: React.ReactNode; rise?: number }
export function Lane(props: LaneProps): JSX.Element;
