import React, { createContext, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Tiff from 'tiff.js';
import { useCornerstone } from './cornerstoneService';
import { getFileExtension, fileToBuffer } from '../utils';

export const useToolManageService = () => {
  const {
    cornerstoneWADOImageLoader,
    cornerstoneTools,
    cornerstoneFileImageLoader,
  } = useCornerstone();
  const [imageIds, setImageIds] = useState([]);

  const imageUpload = useCallback(
    async (file) => {
      const extension = getFileExtension(file.name);

      switch (extension) {
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

  return {
    imageIds,
    imageUpload,
    lengthTool,
    angleTool,
    freehandRoiTool,
    rectangleRoiTool,
    ellipticalRoiTool,
    probeTool,
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

ToolManageServiceProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
