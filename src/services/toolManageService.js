import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Tiff from 'tiff.js';
import { useCornerstone } from './cornerstoneService';
import { useCanvasToTiffService } from './canvasToTiffService';
import { getFileExtension, fileToBuffer } from '../utils';

export const useToolManageService = () => {
  const {
    cornerstone,
    cornerstoneWADOImageLoader,
    cornerstoneTools,
    cornerstoneFileImageLoader,
  } = useCornerstone();
  const { toTiffUrl } = useCanvasToTiffService();
  const [imageIds, setImageIds] = useState([]);

  const imageUpload = useCallback(
    async (file) => {
      const extension = getFileExtension(file.name);

      switch (extension) {
        case 'tiff':
        case 'tif': {
          const buffer = await fileToBuffer(file);
          const tiff = new Tiff({ buffer });
          const canvas = tiff.toCanvas();
          canvas.toBlob(async function (blob) {
            const canvasBuffer = await blob.arrayBuffer();
            const imageId =
              cornerstoneFileImageLoader.fileManager.addBuffer(canvasBuffer);
            setImageIds([imageId]);
          });
          break;
        }
        case 'dcm':
        default: {
          const imageId =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
          setImageIds([imageId]);
        }
      }
    },
    [cornerstoneFileImageLoader, cornerstoneWADOImageLoader]
  );

  const exportImage = useCallback(
    async ({ imageType }) => {
      const [element] = cornerstone.getEnabledElements();

      const link = document.createElement('a');
      let url = '';

      switch (imageType) {
        case 'tiff':
          url = await toTiffUrl(element.canvas);
          console.log(url);
          break;
        case 'png':
        case 'jpeg':
        default: {
          url = element.canvas.toDataURL(`image/${imageType}`);
        }
      }

      link.href = url;
      link.download = `demo.${imageType}`;
      document.body.appendChild(link);
      link.click();
    },
    [cornerstone, toTiffUrl]
  );

  const lengthTool = useCallback(() => {
    cornerstoneTools.setToolActive('Length', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const angleTool = useCallback(() => {
    cornerstoneTools.setToolActive('Angle', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const freehandRoiTool = useCallback(() => {
    cornerstoneTools.setToolActive('FreehandRoi', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const rectangleRoiTool = useCallback(() => {
    cornerstoneTools.setToolActive('RectangleRoi', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const ellipticalRoiTool = useCallback(() => {
    cornerstoneTools.setToolActive('EllipticalRoi', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const probeTool = useCallback(() => {
    cornerstoneTools.setToolActive('Probe', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  const arrowAnnotateTool = useCallback(() => {
    cornerstoneTools.setToolActive('ArrowAnnotate', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  return {
    imageIds,
    imageUpload,
    lengthTool,
    angleTool,
    freehandRoiTool,
    rectangleRoiTool,
    ellipticalRoiTool,
    probeTool,
    arrowAnnotateTool,
    exportImage,
  };
};

export const ToolManageService = createContext({});
export const ToolManageServiceProvider = ({ children }) => {
  return (
    <ToolManageService.Provider value={useToolManageService()}>
      {children}
    </ToolManageService.Provider>
  );
};

export const useToolManage = () => useContext(ToolManageService);

ToolManageServiceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
