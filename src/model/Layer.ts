import KeystrokeCommand from './KeystrokeCommand';

/**
 * Layer of a keyboard layout. Each layer is activated by a particular combination
 * of modifiers. Modifiers are registered in the keyboard.
 */
export default interface Layer {
  alias: string;
  /**
   * Names of the modifiers necessary to activate this layer. Additionally,
   * any modifiers present in the keyboard but not in this layer must not be
   * pressed in order to activate this layer.
   */
  modifiers: string[];
  /**
   * All remaps for this layer; each scancode should have at most one command
   * associated with it, but we don't particularly enforce that.
   */
  remaps: KeystrokeCommand[];
}
