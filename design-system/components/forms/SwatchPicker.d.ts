/**
 * The venture identity colour choice, shown at onboarding. Each swatch previews the actual header treatment —
 * the derived 97° wash plus its 2px top rule — so the partner picks the header they will see, not an abstract dot.
 * Options are the system's twelve identity colours, ordered around the wheel warm to cool; do not extend the list with ad-hoc hex values.
 */
export interface SwatchPickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  /** defaults to VENTURE_COLORS */ options?: { label: string; value: string }[];
  /** short helper beside the label */ note?: string;
}
export function SwatchPicker(props: SwatchPickerProps): JSX.Element;
export interface SwatchProps { label: string; value: string; on?: boolean; onClick?: () => void }
export function Swatch(props: SwatchProps): JSX.Element;
/** The twelve identity colours a venture can own, in wheel order: copper, ember, clay, amber, moss, fern, teal, steel, indigo, violet, plum, magenta. */
export const VENTURE_COLORS: { label: string; value: string }[];
