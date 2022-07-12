import { forEach } from 'lodash';
import external from '../externalModules.js';

export default function (element, startPoint, endPoint) {
  if (!element) {
    throw new Error('getLuminance: parameter element must not be undefined');
  }

  const coordinates = getCordintates(startPoint, endPoint);

  const enabledElement = external.cornerstone.getEnabledElement(element);
  const image = enabledElement.image;
  const luminance = [];
  const pixelData = image.getPixelData();
  let spIndex;

  if (image.color) {
    forEach(coordinates, (coordinate, index) => {
      spIndex = (coordinate.y * image.columns + coordinate.x) * 4;
      const red = pixelData[spIndex];
      const green = pixelData[spIndex + 1];
      const blue = pixelData[spIndex + 2];

      luminance[index++] = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    });
  } else {
    forEach(coordinates, (coordinate, index) => {
      spIndex = coordinate.y * image.columns + coordinate.x;
      luminance[index++] = pixelData[spIndex] * image.slope + image.intercept;
    });
  }

  return luminance;
}

function getCordintates(startPoint, endPoint) {
  var slope = getSlope(startPoint, endPoint);
  var intercept = getIntercept(startPoint, slope);

  var coordinates = [];
  for (var x = startPoint.x; x <= endPoint.x; x++) {
    var y = slope * x + intercept;

    coordinates.push({
      x: Math.round(x),
      y: Math.round(y),
    });
  }

  return coordinates;
}

function getSlope(startPoint, endPoint) {
  if (startPoint.x == endPoint.x) {
    return null;
  }
  return (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
}

function getIntercept(startPoint, slope) {
  if (slope === null) {
    // vertical line
    return startPoint.x;
  }

  return startPoint.y - slope * startPoint.x;
}
