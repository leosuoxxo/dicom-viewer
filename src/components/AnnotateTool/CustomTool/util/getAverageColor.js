import external from '../externalModules.js';

export default function (element, x, y, width, height) {
  if (!element) {
    throw new Error('getLuminance: parameter element must not be undefined');
  }

  x = Math.round(x);
  y = Math.round(y);
  const enabledElement = external.cornerstone.getEnabledElement(element);
  const image = enabledElement.image;
  const luminance = [];
  let rgb = { r: 0, g: 0, b: 0 };
  let index = 0;
  console.log(image);
  const pixelData = image.getPixelData();
  let spIndex, row, column;

  if (image.color) {
    for (row = 0; row < height; row++) {
      for (column = 0; column < width; column++) {
        spIndex = ((row + y) * image.columns + (column + x)) * 4;
        rgb.r += pixelData[spIndex];
        rgb.g += pixelData[spIndex + 1];
        rgb.b += pixelData[spIndex + 2];
      }
    }
  } else {
    for (row = 0; row < height; row++) {
      for (column = 0; column < width; column++) {
        spIndex = (row + y) * image.columns + (column + x);
        luminance[index++] = pixelData[spIndex] * image.slope + image.intercept;
      }
    }
  }
  console.log(rgb);
  return luminance;
}
