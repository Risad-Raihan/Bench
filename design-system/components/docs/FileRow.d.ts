/**
 * Docs surface primitives — a file LIST, never a card grid.
 * Row grid is fixed: `48px 1fr 74px 120px 74px 58px` (type, name, size, uploader, date, versions).
 */
export interface FileRowProps {
  name: string; type?: string; typeColor?: string; size?: string; who?: string; date?: string;
  /** version count; >1 makes the version cell an expander */ versions?: number;
  /** selected — copper left edge, --active-row */ on?: boolean;
  expanded?: boolean; onClick?: () => void; onExpand?: () => void;
}
export function FileRow(props: FileRowProps): JSX.Element;
/** Mono uppercase extension in a hairline box. Bench has no icon set — the extension IS the glyph. */
export interface TypeGlyphProps { type?: string; color?: string }
export function TypeGlyph(props: TypeGlyphProps): JSX.Element;
/** One earlier version, stacked under its FileRow when expanded. */
export interface VersionRowProps { version: number | string; who?: string; date?: string; note?: string }
export function VersionRow(props: VersionRowProps): JSX.Element;
export function DocsHeaderRow(): JSX.Element;
/** Dashed upload target; copper outline + --copper-wash while dragging. */
export interface DropZoneProps { label?: string; hint?: string; active?: boolean; onClick?: () => void }
export function DropZone(props: DropZoneProps): JSX.Element;
/** Left filter column. Folder is a flat string, not a tree. */
export interface FolderFilterProps { folders: { label: string; count: number }[]; active?: string; onSelect?: (label: string) => void }
export function FolderFilter(props: FolderFilterProps): JSX.Element;
export interface FolderItemProps { label: string; count: number; on?: boolean; onClick?: () => void }
export function FolderItem(props: FolderItemProps): JSX.Element;
/** Inline preview rail for the selected PDF or image. */
export interface PreviewPanelProps { name: string; type?: string; meta?: React.ReactNode; children?: React.ReactNode; onClose?: () => void }
export function PreviewPanel(props: PreviewPanelProps): JSX.Element;
