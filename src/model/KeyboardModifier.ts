import Scancode from "./Scancode";

export default interface KeyboardModifier {
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
