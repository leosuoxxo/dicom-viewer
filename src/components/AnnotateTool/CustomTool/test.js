import csTools from 'cornerstone-tools';
const BaseTool = csTools.importInternal('base/BaseTool');

import external from './externalModules.js';

// Drawing
import { draw, drawRect, getNewContext } from './drawing/index.js';
import clip from './util/clip.js';
import getLuminance from './util/getLuminance.js';

import { wwwcRegionCursor } from './cursors/index.js';
import { forEach, isEmpty } from 'lodash';

/**
 * @public
 * @class WwwcTool
 * @memberof Tools
 *
 * @classdesc Tool for setting wwwc based on a rectangular region.
 * @extends Tools.Base.BaseTool
 */
export default class CustomColorReplaceTool extends BaseTool {
  /** @inheritdoc */
  constructor(props = {}) {
    const defaultProps = {
      name: 'CustomColorReplace',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      configuration: {
        minWindowWidth: 10,
      },
      svgCursor: wwwcRegionCursor,
    };

    super(props, defaultProps);
    this._resetHandles();

    //
    // Touch
    //

    /** @inheritdoc */
    this.postTouchStartCallback = this._startOutliningRegion.bind(this);

    /** @inheritdoc */
    this.touchDragCallback = this._setHandlesAndUpdate.bind(this);

    /** @inheritdoc */
    this.touchEndCallback = this._applyStrategy.bind(this);

    //
    // MOUSE
    //

    /** @inheritdoc */
    this.postMouseDownCallback = this._startOutliningRegion.bind(this);

    /** @inheritdoc */
    this.mouseClickCallback = this._startOutliningRegion.bind(this);

    /** @inheritdoc */
    this.mouseDragCallback = this._setHandlesAndUpdate.bind(this);

    /** @inheritdoc */
    this.mouseMoveCallback = this._setHandlesAndUpdate.bind(this);

    /** @inheritdoc */
    this.mouseUpCallback = this._applyStrategy.bind(this);
  }

  renderToolData(evt) {
    const eventData = evt.detail;

    if (isEmpty(this.handles.end)) return;
    const { element } = eventData;
    const color = csTools.toolColors.getColorIfActive({ active: true });
    const context = getNewContext(eventData.canvasContext.canvas);

    const pointCoords = external.cornerstone.pixelToCanvas(eventData.element, {
      x: this.handles.end.x,
      y: this.handles.end.y,
    });

    var pointData = context.getImageData(pointCoords.x, pointCoords.y, 1, 1);
    let rgb = { r: 0, g: 0, b: 0 };
    //Read image and make changes on the fly as it's read
    for (var j = 0; j < pointData.data.length; j += 4) {
      rgb.r += pointData.data[j];
      rgb.g += pointData.data[j + 1];
      rgb.b += pointData.data[j + 2];
    }

    var imgData = context.getImageData(
      0,
      0,
      eventData.image.width,
      eventData.image.height
    );

    for (var k = 0; k < imgData.data.length; k += 4) {
      if (imgData.data[k] >= rgb.r - 5 && imgData.data[k] <= rgb.r + 5) {
        // change to your new rgb
        imgData.data[k] = 200;
        imgData.data[k + 1] = 113;
        imgData.data[k + 2] = 113;
      }
    }
    context.putImageData(imgData, 0, 0);

    draw(context, (context) => {
      drawRect(context, element, this.handles.start, this.handles.end, {
        color,
      });
    });
  }

  _startOutliningRegion(evt) {
    const consumeEvent = true;
    const element = evt.detail.element;
    const image = evt.detail.currentPoints.image;

    if (_isEmptyObject(this.handles.start)) {
      this.handles.start = image;
    } else {
      this.handles.end = image;
      this._applyStrategy(evt);
    }

    external.cornerstone.updateImage(element);

    return consumeEvent;
  }

  _setHandlesAndUpdate(evt) {
    const element = evt.detail.element;
    const image = evt.detail.currentPoints.image;

    this.handles.end = image;
    external.cornerstone.updateImage(element);
  }

  _applyStrategy(evt) {
    if (
      _isEmptyObject(this.handles.start) ||
      _isEmptyObject(this.handles.end)
    ) {
      return;
    }

    evt.detail.handles = this.handles;

    _applyWWWCRegion(evt, this.configuration, this._options.targetElements);
    this._resetHandles();
  }

  _resetHandles() {
    this.handles = {
      start: {},
      end: {},
    };
  }
}
const _isEmptyObject = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const _applyWWWCRegion = function (evt, config, targetElements) {
  const eventData = evt.detail;
  console.log('1', eventData);
  const { image, element } = eventData;

  const { start: startPoint, end: endPoint } = evt.detail.handles;

  // Get the rectangular region defined by the handles
  let left = Math.min(startPoint.x, endPoint.x);
  let top = Math.min(startPoint.y, endPoint.y);
  let width = Math.abs(startPoint.x - endPoint.x);
  let height = Math.abs(startPoint.y - endPoint.y);

  // Bound the rectangle so we don't get undefined pixels
  left = clip(left, 0, image.width);
  top = clip(top, 0, image.height);
  width = Math.floor(Math.min(width, Math.abs(image.width - left)));
  height = Math.floor(Math.min(height, Math.abs(image.height - top)));

  // Get the pixel data in the rectangular region
  const pixelLuminanceData = getLuminance(element, left, top, width, height);

  // Calculate the minimum and maximum pixel values
  const minMaxMean = _calculateMinMaxMean(
    pixelLuminanceData,
    image.minPixelValue,
    image.maxPixelValue
  );

  // Adjust the viewport window width and center based on the calculated values
  forEach(targetElements, (e) => {
    const viewport = e.viewport;

    external.cornerstone.setViewport(e.element, viewport);
    external.cornerstone.updateImage(e.element);
  });
  external.cornerstone.updateImage(element);
};

/**
 * Calculates the minimum, maximum, and mean value in the given pixel array
 *
 * @private
 * @method _calculateMinMaxMean
 * @param {number[]} pixelLuminance array of pixel luminance values
 * @param {number} globalMin starting "min" valie
 * @param {bumber} globalMax starting "max" value
 * @returns {Object} {min: number, max: number, mean: number }
 */
const _calculateMinMaxMean = function (pixelLuminance, globalMin, globalMax) {
  const numPixels = pixelLuminance.length;
  let min = globalMax;
  let max = globalMin;
  let sum = 0;

  if (numPixels < 2) {
    return {
      min,
      max,
      mean: (globalMin + globalMax) / 2,
    };
  }

  for (let index = 0; index < numPixels; index++) {
    const spv = pixelLuminance[index];

    min = Math.min(min, spv);
    max = Math.max(max, spv);
    sum += spv;
  }

  return {
    min,
    max,
    mean: sum / numPixels,
  };
};
