import Keyboard from './Keyboard';

/**
 * Top level interface for layouts. One of these gets written to one layout file.
 */
export default interface Layout {
  layoutName: string;
  keyboards: Keyboard[];
}
