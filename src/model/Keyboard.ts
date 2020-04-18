import Layer from "./Layer";
import { PhysicalLayout } from "../resources/physicalLayouts";
import { LogicalLayout } from "../resources/logicalLayouts";
import KeyboardModifier from "./KeyboardModifier";

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
