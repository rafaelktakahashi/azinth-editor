import Scancode from "./Scancode";
import Layer from "./Layer";
import { PhysicalLayout } from "../resources/physicalLayouts";
import { LogicalLayout } from "../resources/logicalLayouts";

export interface KeyboardModifier {
  /**
   * String that uniquely identifies the keyboard. In actuality this string
   * identifies the input (as in, the USB input and such).
   * Example: "\\\\?\\HID#VID_04D9&PID_A0F8&MI_00#8&84b8ce3&0&0000#{884b96c3-56ef-11d1-bc8c-00a0c91405dd}"
   */
  name: string;
  /**
   * A modifier may be triggered by more than one physical key.
   * Think of the Shift key present in every keyboard, which is triggered by
   * either the 0x2A or the 0x36 physical keys.
   */
  scancodes: Scancode[];
}

export default interface Keyboard {
  name: string;
  alias: string;
  physicalLayout: PhysicalLayout;
  logicalLayout: LogicalLayout;
  /**
   * Modifiers registered for this keyboard. For any physical key registered as
   * a modifier, a remap (in any layer) registered to the same physical key
   * won't have any effect.
   */
  modifiers: KeyboardModifier[];
  /**
   * Layers registered for this keyboard. Each layer corresponds to a combination
   * of modifiers registered in this keyboard. Layers should not be automatically
   * instantiated for every possible combination to avoid exploding memory usage,
   * since we do not limit the amount of modifiers registered to a keyboard.
   */
  layers: Layer[];
}
