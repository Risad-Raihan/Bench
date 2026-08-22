/** Hairline container on --panel with an optional mono section label. The default box for grouped facts. */
export interface PanelProps { label?: string; right?: React.ReactNode; children?: React.ReactNode; pad?: number; flush?: boolean }
export function Panel(props: PanelProps): JSX.Element;
/** Mono uppercase label with a hairline rule filling the remaining width and an optional count on the right. */
export interface SectionLabelProps { children: React.ReactNode; color?: string; right?: React.ReactNode }
export function SectionLabel(props: SectionLabelProps): JSX.Element;
/** Dashed empty state. Copy states what is missing, never apologises. */
export interface EmptyStateProps { children: React.ReactNode; hint?: string; action?: string; onAction?: () => void }
export function EmptyState(props: EmptyStateProps): JSX.Element;
/** Loading placeholder bar — --gate-empty fill, reuses the 2.2s sync pulse. No shimmer sweep. */
export interface SkeletonProps { w?: string | number; h?: number; mb?: number }
export function Skeleton(props: SkeletonProps): JSX.Element;
export interface SkeletonRowProps { cols?: string[]; pad?: string }
export function SkeletonRow(props: SkeletonRowProps): JSX.Element;
