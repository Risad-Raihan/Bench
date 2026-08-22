/** Level-2 breadcrumb strip: back link, venture dot + name, venture switcher. One of the three signals that you went down a level. */
export interface BackStripProps { parent?: string; current: string; /** venture identity colour */ color?: string; onBack?: () => void; switchLabel?: string; onSwitch?: () => void; }
export function BackStrip(props: BackStripProps): JSX.Element;
