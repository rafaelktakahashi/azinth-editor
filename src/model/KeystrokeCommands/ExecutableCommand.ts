import KeystrokeCommand from "../KeystrokeCommand";

export default interface ExecutableCommand extends KeystrokeCommand {
  type: "executable";
  /** Path to the executable to open. */
  path: string;
  /** Arguments to pass to the executable, in one line (separated by spaces) */
  arguments: string;
}
