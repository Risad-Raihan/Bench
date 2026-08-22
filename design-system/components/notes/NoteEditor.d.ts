/**
 * The Notion-style note editor: 216px sidebar / flexible doc / 200px metadata rail.
 * @startingPoint section="Notes" subtitle="Three-column note editor" viewport="1180x560"
 */
export interface NoteSidebarProps { groups: { label: string; items: { label: string; color?: string }[] }[]; active?: string; onSelect?: (label: string) => void }
export function NoteSidebar(props: NoteSidebarProps): JSX.Element;
export interface SidebarLinkProps { label: string; color?: string; on?: boolean; onClick?: () => void }
export function SidebarLink(props: SidebarLinkProps): JSX.Element;
/** A hoverable document block. Drag handle and + appear on hover only — never render them at rest. */
export interface NoteBlockProps { children?: React.ReactNode; rise?: number }
export function NoteBlock(props: NoteBlockProps): JSX.Element;
export function NoteQuote(props: { children?: React.ReactNode }): JSX.Element;
/** A live task record embedded in a note — the same record the kanban board renders. */
export interface TaskBlockProps { label: string; pill?: string; pillColor?: string; done?: boolean; onToggle?: () => void }
export function TaskBlock(props: TaskBlockProps): JSX.Element;
/** The slash command palette — the only element in Bench with a shadow. */
export interface SlashMenuProps { heading?: string; items: { glyph: string; label: string; hint?: string; on?: boolean }[] }
export function SlashMenu(props: SlashMenuProps): JSX.Element;
export interface MetaRailProps { sections: { label: string; value?: React.ReactNode; color?: string; links?: string[] }[] }
export function MetaRail(props: MetaRailProps): JSX.Element;
export function MetaLink(props: { children?: React.ReactNode }): JSX.Element;

/** The whole three-column notes screen assembled: sidebar, document body, metadata rail. */
export interface NoteEditorProps {
  sidebarGroups: NoteSidebarProps["groups"];
  activeNote?: string;
  crumbs?: React.ReactNode;
  title?: string;
  byline?: React.ReactNode;
  children?: React.ReactNode;
  meta?: MetaRailProps["sections"];
  onSelectNote?: (label: string) => void;
}
export function NoteEditor(props: NoteEditorProps): JSX.Element;
