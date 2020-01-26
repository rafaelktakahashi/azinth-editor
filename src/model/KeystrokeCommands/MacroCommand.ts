import KeystrokeCommand from "../KeystrokeCommand";

export interface VirtualKeypress {
  type: "make" | "break";
  /** One-byte unsigned integer. Not that it matters for javascript. */
  vKey: number;
}

export default interface MacroCommand extends KeystrokeCommand {
  type: "macro";
  triggerOnRepeat: boolean;
  keypresses: VirtualKeypress[];
}
