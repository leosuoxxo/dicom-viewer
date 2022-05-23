import csTools from 'cornerstone-tools';
const BaseAnnotationTool = csTools.importInternal('base/BaseAnnotationTool');

// Drawing
import { getNewContext, draw, setShadow, drawLine } from './drawing/index.js';

import { lengthCursor } from './cursors';

import lineSegDistance from './util/lineSegDistance.js';
import getPixelSpacing from './util/getPixelSpacing';
import throttle from './util/throttle';
import { castArray, last } from 'lodash';

export default class CustomHistogramTool extends BaseAnnotationTool {
  constructor(props = {}) {
    const defaultProps = {
      name: 'CustomHistogram',
      supportedInteractionTypes: ['Mouse', 'Touch'],
      svgCursor: lengthCursor,
    };

    super(props, defaultProps);

    this.throttledUpdateCachedStats = throttle(this.updateCachedStats, 110);
  }

  createNewMeasurement(eventData) {
    const goodEventData =
      eventData && eventData.currentPoints && eventData.currentPoints.image;

    if (!goodEventData) {
      console.log(
        `required eventData not supplied to tool ${this.name}'s createNewMeasurement`
      );

      return;
    }

    const { x, y } = eventData.currentPoints.image;

    return {
      visible: true,
      active: true,
      color: undefined,
      invalidated: true,
      handles: {
        start: {
          x,
          y,
          highlight: true,
          active: false,
        },
        end: {
          x,
          y,
          highlight: true,
          active: true,
        },
      },
    };
  }

  pointNearTool(element, data, coords) {
    const hasStartAndEndHandles =
      data && data.handles && data.handles.start && data.handles.end;
    const validParameters = hasStartAndEndHandles;

    if (!validParameters) {
      console.log(
        `invalid parameters supplied to tool ${this.name}'s pointNearTool`
      );

      return false;
    }

    if (data.visible === false) {
      return false;
    }

    return (
      lineSegDistance(element, data.handles.start, data.handles.end, coords) <
      25
    );
  }

  updateCachedStats(image, element, data) {
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
    const dx =
      (data.handles.end.x - data.handles.start.x) * (colPixelSpacing || 1);
    const dy =
      (data.handles.end.y - data.handles.start.y) * (rowPixelSpacing || 1);

    // Calculate the length, and create the text variable with the millimeters or pixels suffix
    const length = Math.sqrt(dx * dx + dy * dy);

    // Store the length inside the tool for outside access
    data.length = length;
    data.invalidated = false;
  }

  renderToolData(evt) {
    const eventData = evt.detail;

    const toolData = csTools.getToolState(evt.currentTarget, this.name);

    // make sure only one line appear
    toolData.data = castArray(last(toolData.data));

    if (!toolData) {
      return;
    }

    // We have tool data for this element - iterate over each one and draw it
    const context = getNewContext(eventData.canvasContext.canvas);
    const { image, element } = eventData;
    const { rowPixelSpacing, colPixelSpacing } = getPixelSpacing(image);

    for (let i = 0; i < toolData.data.length; i++) {
      const data = toolData.data[i];

      if (data.visible === false) {
        continue;
      }

      draw(context, (context) => {
        // Configurable shadow
        setShadow(context, this.configuration);

        const lineOptions = {
          color: 'red',
          lineWidth: 2,
        };

        drawLine(
          context,
          element,
          data.handles.start,
          data.handles.end,
          lineOptions
        );
      });
    }
  }
}
