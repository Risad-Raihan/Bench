/**
 * The Bench top chrome bar: copper mark, mono uppercase nav, ⌘K jump box.
 * Set `dimmed` when the user is one level down (inside a venture) — app nav goes unlit.
 * @startingPoint section="Chrome" subtitle="App bar, back strip and page header" viewport="1180x150"
 */
export interface AppBarProps {
  items?: string[];
  active?: string;
  /** true inside a venture — no nav item is lit */
  dimmed?: boolean;
  /** the product initial in the copper square — "B" for Bench */ mark?: string;
  onNavigate?: (item: string) => void;
  /** shows the copper "+ New venture" primary action — pass it on every screen; venture creation is top level, not a column affordance */
  onNewVenture?: () => void;
  newLabel?: string;
  /** opens the ⌘K palette */ onJump?: () => void;
  jumpLabel?: string;
  jumpKey?: string;
  /** account menu that hangs from the mark on click — left-aligned under the square */
  menuItems?: string[];
  onMenuSelect?: (item: string) => void;
  /** unread notification count from `notifications` (null read_at). Amber when > 0. Omit to hide. */
  unreadCount?: number;
  /** dropdown hanging from the unread count — typically the notification list */
  unreadMenu?: React.ReactNode;
}
export function AppBar(props: AppBarProps): JSX.Element;
