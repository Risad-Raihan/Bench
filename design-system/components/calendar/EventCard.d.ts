/**
 * Week calendar, two-way Google sync. Any meeting can spawn a note already linked to the right venture.
 * @startingPoint section="Calendar" subtitle="Five-day week with venture-linked meetings" viewport="1180x420"
 */
export interface EventCardProps {
  time: string; title: string;
  /** violet micro-flag: "Note ready" or "+ Create note" */ flag?: string;
  /** venture identity colour; --ash for personal */ color?: string;
  onClick?: () => void;
}
export function EventCard(props: EventCardProps): JSX.Element;
export interface DayColumnProps { label: string; today?: boolean; children?: React.ReactNode }
export function DayColumn(props: DayColumnProps): JSX.Element;
export function WeekGrid(props: { children?: React.ReactNode }): JSX.Element;
/** Footer with the looping teal pulse — the only infinite animation in the system. */
export interface SyncBarProps { children?: React.ReactNode; live?: boolean }
export function SyncBar(props: SyncBarProps): JSX.Element;
