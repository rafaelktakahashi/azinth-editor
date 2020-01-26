import KeystrokeCommand from "../KeystrokeCommand";
import Scancode from "../Scancode";

export default class UnicodeCommand implements KeystrokeCommand {
  constructor(
    scancode: Scancode,
    codepoints: number[],
    triggerOnRepeat: boolean
  ) {
    this.type = "unicode";
    this.scancode = scancode;
    this.codepoints = codepoints;
    this.triggerOnRepeat = triggerOnRepeat;
  }
  type: "unicode";
  scancode: Scancode;
  triggerOnRepeat: boolean;
  /**
   * Each codepoint is a 32-bit unsigned integer.
   * Not that it matters much for javascript.
   */
  codepoints: number[];
}
