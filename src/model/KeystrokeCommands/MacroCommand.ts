import KeystrokeCommand from "../KeystrokeCommand";
import Scancode from "../Scancode";

export interface VirtualKeypress {
  type: "make" | "break";
  /** One-byte unsigned integer. Not that it matters for javascript. */
  vKey: number;
}

export default class MacroCommand implements KeystrokeCommand {
  constructor(scancode: Scancode, keypresses: VirtualKeypress[]) {
    this.type = "macro";
    this.scancode = scancode;
    this.keypresses = keypresses;
  }
  type: "macro";
  scancode: Scancode;
  triggerOnRepeat: boolean;
  keypresses: VirtualKeypress[];
}
