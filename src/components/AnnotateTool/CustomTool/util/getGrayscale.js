import external from '../externalModules.js';

export default function (element, x, y, width, height) {
  if (!element) {
    throw new Error('getGrayscale: parameter element must not be undefined');
  }

  x = Math.round(x);
  y = Math.round(y);
  const enabledElement = external.cornerstone.getEnabledElement(element);
  const image = enabledElement.image;
  const luminance = [];
  let index = 0;
  const pixelData = image.getPixelData();
  let spIndex, row, column;

  for (row = 0; row < height; row++) {
    for (column = 0; column < width; column++) {
      spIndex = (row + y) * image.columns + (column + x);
      luminance[index++] = pixelData[spIndex] * image.slope + image.intercept;
    }
  }

  return luminance;
}
