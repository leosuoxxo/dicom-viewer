export const useCanvasToTiffService = () => {
  const toTiffUrl = (canvas) => {
    return new Promise((resolve) => {
      window.CanvasToTIFF.toObjectURL(canvas, (url) => {
        resolve(url);
      });
    });
  };
  return { toTiffUrl };
};
