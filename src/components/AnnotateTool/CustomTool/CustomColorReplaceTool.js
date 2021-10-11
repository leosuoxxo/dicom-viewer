import csTools from 'cornerstone-tools';
const BaseAnnotationTool = csTools.importInternal('base/BaseAnnotationTool');

import external from './externalModules.js';

// Drawing
import { getNewContext, draw } from './drawing/index.js';
import drawTextBox from './drawing/drawTextBox.js';
import drawHandles from './drawing/drawHandles.js';
// Utilities
import getRGBPixels from './util/getRGBPixels.js';
import calculateSUV from './util/calculateSUV.js';
import { probeCursor } from './cursors/index.js';
import throttle from './util/throttle';
import { getModule } from './store/index';

export default class CustomColorReplaceTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'CustomColorReplace',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: probeCursor,
      configuration: {
        drawHandles: true,
        renderDashed: false,
      },
    };

    super(props, defaultProps);

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  createNewMeasurement(eventData) {
    const goodEventData =
      eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      return;
    }

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        end: {
          x: eventData.currentPoints.image.x,
          y: eventData.currentPoints.image.y,
          highlight: true,
          active: true,
        },
      },
    };
  }

  /**
   *
   *
   * @param {*} element
   * @param {*} data
   * @param {*} coords
   * @returns {Boolean}
   */
  pointNearTool(element, data, coords) {
    const hasEndHandle = data && data.handles && data.handles.end;
    const validParameters = hasEndHandle;

    if (!validParameters || data.visible === false) {
      return false;
    }

    const probeCoords = external.cornerstone.pixelToCanvas(
      element,
      data.handles.end
    );

    return external.cornerstoneMath.point.distance(probeCoords, coords) < 5;
  }

  updateCachedStats(image, element, data) {
    const x = Math.round(data.handles.end.x);
    const y = Math.round(data.handles.end.y);

    const stats = {};

    if (x >= 0 && y >= 0 && x < image.columns && y < image.rows) {
      stats.x = x;
      stats.y = y;
      if (image.color) {
        stats.storedPixels = getRGBPixels(element, x, y, 1, 1);
      } else {
        stats.storedPixels = external.cornerstone.getStoredPixels(
          element,
          x,
          y,
          1,
          1
        );
        stats.sp = stats.storedPixels[0];
        stats.mo = stats.sp * image.slope + image.intercept;
        stats.suv = calculateSUV(image, stats.sp);
      }
    }

    data.cachedStats = stats;
    data.invalidated = false;
  }

  renderToolData(evt) {
    const eventData = evt.detail;
    const { handleRadius, renderDashed } = this.configuration;
    const toolData = csTools.getToolState(evt.currentTarget, this.name);

    if (!toolData) {
      return;
    }

    // We have tool data for this element - iterate over each one and draw it
    const context = getNewContext(eventData.canvasContext.canvas);
    const { image, element } = eventData;
    const fontHeight = csTools.textStyle.getFontSize();
    const lineDash = getModule('globalConfiguration').configuration.lineDash;

    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      const pointCoords = external.cornerstone.pixelToCanvas(
        eventData.element,
        {
          x: data.handles.end.x,
          y: data.handles.end.y,
        }
      );
      var imgData = context.getImageData(pointCoords.x, pointCoords.y, 1, 1);
      let rgb = { r: 0, g: 0, b: 0 };
      //Read image and make changes on the fly as it's read
      for (var j = 0; j < imgData.data.length; j += 4) {
        rgb.r += imgData.data[j];
        rgb.g += imgData.data[j + 1];
        rgb.b += imgData.data[j + 2];
      }
      for (var k = 0; k < imgData.data.length; k += 4) {
        if (
          imgData.data[k] == rgb.r &&
          imgData.data[k + 1] == rgb.g &&
          imgData.data[k + 2] == rgb.b
        ) {
          // change to your new rgb
          imgData.data[k] = 0;
          imgData.data[k + 1] = 0;
          imgData.data[k + 2] = 0;
        }
      }
      console.log(rgb);

      draw(context, (context) => {
        const color = csTools.toolColors.getColorIfActive(data);

        if (this.configuration.drawHandles) {
          // Draw the handles
          let handleOptions = { handleRadius, color };

          if (renderDashed) {
            handleOptions.lineDash = lineDash;
          }

          drawHandles(context, eventData, data.handles, handleOptions);
        }

        // Update textbox stats
        if (data.invalidated === true) {
          if (data.cachedStats) {
            this.throttledUpdateCachedStats(image, element, data);
          } else {
            this.updateCachedStats(image, element, data);
          }
        }
      });
    }
  }
}
