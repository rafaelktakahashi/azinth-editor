/**
 * Azinth uses its own notation for scancodes, which have one or two bytes.
 * One byte scancodes are notated by 'XX' and two-byte scancodes are notated
 * by 'XX:YY', where XX and YY are bytes represented by two hex digits.
 */
declare type Scancode = string;

/**
 * This file doesn't do much, since we can't enforce anything about the scancode
 * type other than it being a string. Typing variables with this is for purely
 * semantic reasons.
 */
export default Scancode;

function scToValue(sc: Scancode) {
  // Turns a scancode into a number.
  // This is only used in ScancodeComparator, so it's only important that the
  // returned value preserves ordering.

  // For scancodes without a prefix, return the scancode parsed as a byte. It's
  // probably overkill to parse these strings just to order them, but I can't
  // really think of a better way.
  if (!sc.includes(':')) {
    return parseInt(sc, 16);
  } else {
    // If there's a prefix, add the prefix's parsed value multiplied by 0x100.
    // That'll make prefixed scancodes always compare higher than those without
    // prefixes.
    return (
      parseInt(sc.split(':')[0], 16) * 0x100 + parseInt(sc.split(':')[1], 16)
    );
  }
}

// A function that compares two scancodes, for the purposes of ordering lists of
// scancodes.
export function ScancodeComparator(sc1: Scancode, sc2: Scancode) {
  return scToValue(sc1) - scToValue(sc2);
}
