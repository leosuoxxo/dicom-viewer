/**
 * A {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|color, gradient or pattern} to use inside shapes.
 * @typedef {(String|CanvasGradient|CanvasPattern)} FillStyle
 */

/**
 * A {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle|color, gradient or pattern} to use for the lines around shapes.
 * @typedef {(String|CanvasGradient|CanvasPattern)} StrokeStyle
 */

/**
 * @callback ContextFn
 * @param {CanvasRenderingContext2D} context
 */

import draw from './draw.js';
import drawHandles from './drawHandles.js';
import drawLine from './drawLine.js';
import drawLink from './drawLink.js';
import drawRect from './drawRect';
import drawLinkedTextBox from './drawLinkedTextBox.js';
import drawTextBox from './drawTextBox.js';
import fillBox from './fillBox.js';
import fillTextLines from './fillTextLines.js';
import getNewContext from './getNewContext.js';
import path from './path.js';
import setShadow from './setShadow.js';

// Named exports
export {
  draw,
  drawHandles,
  drawLine,
  drawLink,
  drawRect,
  drawLinkedTextBox,
  drawTextBox,
  fillBox,
  fillTextLines,
  getNewContext,
  path,
  setShadow,
};
