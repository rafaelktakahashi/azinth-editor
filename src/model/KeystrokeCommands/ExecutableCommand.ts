import KeystrokeCommand from '../KeystrokeCommand';
import Scancode from '../Scancode';

export default class ExecutableCommand implements KeystrokeCommand {
  /** Strict mode doesn't let us use `arguments` as a variable name. */
  constructor(scancode: Scancode, path: string, args: string | undefined) {
    this.scancode = scancode;
    this.path = path;
    this.arguments = args;
    this.type = 'executable';
  }
  type: 'executable';
  scancode: Scancode;
  /** Path to the executable to open. */
  path: string;
  /** Arguments to pass to the executable, in one line (separated by spaces) */
  arguments?: string;
}
