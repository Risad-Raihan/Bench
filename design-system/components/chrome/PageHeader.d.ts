/** Level-1 page header — 25px semibold title, optional mono meta line, right slot. The right slot takes a KPI cluster, a single action, or nothing; Pipeline uses title + action only. */
export interface PageHeaderProps { title: string; meta?: React.ReactNode; right?: React.ReactNode; children?: React.ReactNode; }
export function PageHeader(props: PageHeaderProps): JSX.Element;
/** A single 27px mono numeral with a mono uppercase caption. `hot` turns it copper. */
export interface KpiProps { value: React.ReactNode; label: string; hot?: boolean; }
export function Kpi(props: KpiProps): JSX.Element;
/** Footer strip of five equal mono counters, 1px grid gaps. */
export interface StatStripProps { stats: { value: React.ReactNode; label: string }[]; }
export function StatStrip(props: StatStripProps): JSX.Element;
