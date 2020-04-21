import KeystrokeCommand from '../KeystrokeCommand';
import Scancode from '../Scancode';

/**
 * Represents one dead key replacement.
 */
export interface Replacement {
  from: number[];
  to: number[];
}

export default class DeadKeyCommand implements KeystrokeCommand {
  constructor(
    scancode: Scancode,
    codepoints: number[],
    replacements: Replacement[],
    triggerOnRepeat: boolean
  ) {
    this.type = 'deadkey';
    this.scancode = scancode;
    this.codepoints = codepoints;
    this.replacements = replacements;
    this.triggerOnRepeat = triggerOnRepeat;
  }
  type: 'deadkey';
  scancode: string;
  triggerOnRepeat: boolean;
  /**
   * Each codepoint is a 32-bit unsigned integer.
   * Not that it matters much for javascript.
   */
  codepoints: number[];
  replacements: Replacement[];
}
