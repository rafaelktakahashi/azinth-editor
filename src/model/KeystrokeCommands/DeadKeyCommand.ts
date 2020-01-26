import KeystrokeCommand from "../KeystrokeCommand";

/**
 * Represents one dead key replacement.
 */
export interface Replacement {
  from: number[];
  to: number[];
}

export default interface DeadKeyCommand extends KeystrokeCommand {
  type: "deadkey";
  scancode: string;
  triggerOnRepeat: boolean;
  /**
   * Each codepoint is a 32-bit unsigned integer.
   * Not that it matters much for javascript.
   */
  codepoints: number[];
  replacements: Replacement[];
}
