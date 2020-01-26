import KeystrokeCommand from "../KeystrokeCommand";

export default class UnicodeCommand implements KeystrokeCommand {
  constructor(
    scancode: string,
    codepoints: number[],
    triggerOnRepeat: boolean
  ) {
    this.type = "unicode";
    this.scancode = scancode;
    this.codepoints = codepoints;
    this.triggerOnRepeat = triggerOnRepeat;
  }
  type: "unicode";
  scancode: string;
  triggerOnRepeat: boolean;
  /**
   * Each codepoint is a 32-bit unsigned integer.
   * Not that it matters much for javascript.
   */
  codepoints: number[];
}
