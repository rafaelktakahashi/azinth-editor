import Scancode from "./Scancode";

type KeystrokeType = "unicode" | "macro" | "deadkey" | "executable";

/**
 * Interface for all keystroke commands. Each and every keystroke has a scancode
 * corresponding to a physical key on a keyboard, and a type distinguishing its
 * behavior.
 */
export default interface KeystrokeCommand {
  /**
   * The keystroke type field is mostly for serialization.
   * In practice, we should cast by checking the real types.
   */
  type: KeystrokeType;
  /**
   * Each keystroke command is uniquely identified by its scancode.
   */
  scancode: Scancode;
}
