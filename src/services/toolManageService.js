import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { concat, filter, find, get, isEmpty, isNil, map } from 'lodash';
import Tiff from 'tiff.js';

import { useCornerstone } from './cornerstoneService';
import { useCanvasToTiffService } from './canvasToTiffService';
import { getFileExtension, fileToBuffer, convertDiconde } from '../utils';
import { IMAGE_TYPE, TOOL_COLORS } from '../constants';

export const useToolManageService = () => {
  const {
    cornerstone,
    cornerstoneWADOImageLoader,
    cornerstoneTools,
    cornerstoneFileImageLoader,
  } = useCornerstone();
  const { toTiffUrl } = useCanvasToTiffService();

  console.log('s', cornerstone);
  console.log('t', cornerstoneTools);

  const [selectedPosition, setSelectedPosition] = useState('1*1');
  const [imageInfos, setImageInfos] = useState([]);

  const selectedImageId = useMemo(() => {
    const imageInfo = find(imageInfos, { position: selectedPosition });
    return isNil(imageInfo) ? null : imageInfo.id;
  }, [selectedPosition, imageInfos]);

  const imageInfoHandler = useCallback(
    (imageInfos, uploadedImageId) => {
      if (isNil(find(imageInfos, { position: selectedPosition })))
        return concat(imageInfos, {
          position: selectedPosition,
          id: uploadedImageId,
        });

      return map(imageInfos, (imageInfo) => {
        if (get(imageInfo, 'position') === selectedPosition)
          return {
            position: selectedPosition,
            id: uploadedImageId,
          };
        return imageInfo;
      });
    },
    [selectedPosition]
  );

  const imageUpload = useCallback(
    async (file) => {
      if (isNil(file)) return;
      const extension = getFileExtension(file.name);

      switch (extension) {
        case IMAGE_TYPE.TIFF:
        case IMAGE_TYPE.TIF: {
          const buffer = await fileToBuffer(file);
          const tiff = new Tiff({ buffer });
          const canvas = tiff.toCanvas();
          canvas.toBlob(async function (blob) {
            const canvasBuffer = await blob.arrayBuffer();
            const imageId =
              cornerstoneFileImageLoader.fileManager.addBuffer(canvasBuffer);

            setImageInfos((imageInfos) => {
              return imageInfoHandler(imageInfos, imageId);
            });
          });
          break;
        }
        case 'diconde': {
          const buffer = await fileToBuffer(file);
          const bytes = new Uint8Array(buffer);
          const convertedBytes = convertDiconde(bytes);
          const convertedFile = new File(
            [convertedBytes.buffer],
            `converted_${file.name}`
          );
          const imageId =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(convertedFile);
          setImageInfos((imageInfos) => {
            return imageInfoHandler(imageInfos, imageId);
          });
          break;
        }
        case 'dcm':
        default: {
          const imageId =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
          setImageInfos((imageInfos) => {
            return imageInfoHandler(imageInfos, imageId);
          });
        }
      }
    },
    [cornerstoneFileImageLoader, cornerstoneWADOImageLoader, imageInfoHandler]
  );

  const exportImage = useCallback(
    async ({ imageType }) => {
      if (isEmpty(cornerstone.getEnabledElements())) {
        alert('請先上傳圖檔');
        return;
      }
      const [element] = filter(
        cornerstone.getEnabledElements(),
        (e) => e.image.imageId === selectedImageId
      );

      const link = document.createElement('a');
      let url = '';

      switch (imageType) {
        case IMAGE_TYPE.TIFF:
          url = await toTiffUrl(element.canvas);
          break;
        case IMAGE_TYPE.PNG:
        case IMAGE_TYPE.JPG:
        default: {
          url = element.canvas.toDataURL(`image/${imageType}`);
        }
      }

      link.href = url;
      link.download = `demo.${imageType}`;
      document.body.appendChild(link);
      link.click();
    },
    [cornerstone, toTiffUrl, selectedImageId]
  );

  const getValidElements = useCallback(() => {
    if (isEmpty(cornerstone.getEnabledElements())) return;
    const elements = filter(
      cornerstone.getEnabledElements(),
      (e) => !isNil(e.image)
    );
    return elements;
  }, [cornerstone]);

  const getSelectedElement = useCallback(() => {
    if (isEmpty(getValidElements())) return;
    const [element] = filter(
      getValidElements(),
      (e) => e.image.imageId === selectedImageId
    );
    return element;
  }, [selectedImageId, getValidElements]);

  useEffect(() => {
    cornerstoneTools.toolColors.setToolColor(TOOL_COLORS[0]);
  }, [cornerstoneTools]);

  const activateTool = useCallback(
    (toolName) => {
      cornerstoneTools.init();
      cornerstoneTools.addTool(get(cornerstoneTools, `${toolName}Tool`));
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    },
    [cornerstoneTools]
  );

  const activateCustomTool = useCallback(
    (tool, toolName) => {
      cornerstoneTools.init();
      cornerstoneTools.addTool(tool);
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
    },
    [cornerstoneTools]
  );

  const wwwcSynchronizer = useMemo(
    () =>
      new cornerstoneTools.Synchronizer(
        // Cornerstone event that should trigger synchronizer
        'cornerstoneimagerendered',
        // Logic that should run on target elements when event is observed on source elements
        cornerstoneTools.wwwcSynchronizer
      ),
    [cornerstoneTools]
  );

  const wwwcRegionTool = useCallback(() => {
    cornerstoneTools.setToolActive('WwwcRegion', {
      mouseButtonMask: 1,
      synchronizationContext: wwwcSynchronizer,
    });
  }, [cornerstoneTools, wwwcSynchronizer]);

  return {
    imageInfos,
    selectedPosition,
    setSelectedPosition,
    imageUpload,
    activateTool,
    activateCustomTool,
    wwwcRegionTool,
    exportImage,
    wwwcSynchronizer,
    getSelectedElement,
    getValidElements,
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
