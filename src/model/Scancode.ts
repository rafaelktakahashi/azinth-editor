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
