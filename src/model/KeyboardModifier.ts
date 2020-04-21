import Scancode from './Scancode';

export default interface KeyboardModifier {
  /**
   * Name of this modifier. Each layer uses only a list of modifier names to
   * identify the modifier combination that triggers it.
   */
  name: string;
  /**
   * A modifier may be triggered by more than one physical key.
   * Think of the Shift key present in every keyboard, which is triggered by
   * either the 0x2A or the 0x36 physical keys.
   */
  scancodes: Scancode[];
}
