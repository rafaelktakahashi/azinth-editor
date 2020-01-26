import KeystrokeCommand from "../KeystrokeCommand";

export default interface UnicodeCommand extends KeystrokeCommand {
  type: "unicode";
  triggerOnRepeat: boolean;
  /**
   * Each codepoint is a 32-bit unsigned integer.
   * Not that it matters much for javascript.
   */
  codepoints: number[];
}
