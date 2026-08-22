/**
 * Centred dialog on --panel with a --line2 hairline and the system's single shadow. Header carries a copper mono eyebrow; footer holds exactly one primary action.
 */
export interface ModalProps { title: string; eyebrow?: string; children?: React.ReactNode; footer?: React.ReactNode; width?: number; onClose?: () => void }
export function Modal(props: ModalProps): JSX.Element;
/** ⌘K palette. Groups are ordered Actions first, then Ventures, then Recent — actions are reachable from every page. */
export interface CommandPaletteProps {
  query?: string; onQuery?: (v: string) => void;
  groups: { label: string; items: CommandRowProps[] }[];
  onRun?: (item: CommandRowProps) => void; onClose?: () => void; placeholder?: string;
}
export function CommandPalette(props: CommandPaletteProps): JSX.Element;
/** One palette line. `primary` makes the glyph copper — reserve it for creating things. */
export interface CommandRowProps { glyph: string; label: string; hint?: string; color?: string; primary?: boolean; on?: boolean; onClick?: () => void }
export function CommandRow(props: CommandRowProps): JSX.Element;
