/** The only text input in Bench: hairline box on --bg2, copper hairline and copper label on focus. No filled or floating-label variants. */
export interface TextFieldProps {
  label: string; value?: string; onChange?: (v: string) => void; placeholder?: string;
  /** shows a ghost "Optional" marker beside the label */ optional?: boolean;
  multiline?: boolean; autoFocus?: boolean;
}
export function TextField(props: TextFieldProps): JSX.Element;
