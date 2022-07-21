import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  castArray,
  concat,
  filter,
  find,
  get,
  includes,
  isEmpty,
  isNil,
  map,
} from 'lodash';
import Tiff from 'tiff.js';

import { useCornerstone } from './cornerstoneService';
import { useCanvasToTiffService } from './canvasToTiffService';
import { getFileExtension, fileToBuffer, convertDiconde } from '../utils';
import { IMAGE_TYPE, TOOL_COLORS } from '../constants';
import CustomLengthTool from '../components/AnnotateTool/CustomTool/CustomLengthTool';
import CustomWwwcRegionTool from '../components/AnnotateTool/CustomTool/CustomWwwcRegionTool';
import CustomHistogramTool from '../components/AnnotateTool/CustomTool/CustomHistogramTool';

export const useToolManageService = () => {
  const {
    cornerstone,
    cornerstoneWADOImageLoader,
    cornerstoneTools,
    cornerstoneFileImageLoader,
  } = useCornerstone();
  const { toTiffUrl } = useCanvasToTiffService();

  const [selectedPosition, setSelectedPosition] = useState('1*1');
  const [imageInfos, setImageInfos] = useState([]);

  const [toolData, setToolData] = useState(null);

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
        case 'jpg': {
          const buffer = await fileToBuffer(file);
          const blob = new Blob([buffer], { type: 'image/jpg' });
          const canvasBuffer = await blob.arrayBuffer();
          const imageId =
            cornerstoneFileImageLoader.fileManager.addBuffer(canvasBuffer);

          setImageInfos((imageInfos) => {
            return imageInfoHandler(imageInfos, imageId);
          });
          break;
        }
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

  const activateLengthTool = useCallback(
    (pixelToMm) => {
      cornerstoneTools.init();
      cornerstoneTools.addTool(CustomLengthTool);
      cornerstoneTools.setToolActive('CustomLength', {
        mouseButtonMask: 1,
        pixelToMm,
      });
    },
    [cornerstoneTools]
  );

  const activateWwwcTool = useCallback(
    (targetImageIds) => {
      const elements = getValidElements();
      const targetElements = filter(elements, (ele) =>
        includes(targetImageIds, ele.image.imageId)
      );
      const selectedElement = document.getElementById(selectedImageId);
      cornerstoneTools.init();
      cornerstoneTools.addToolForElement(selectedElement, CustomWwwcRegionTool);
      cornerstoneTools.setToolActiveForElement(selectedElement, 'CustomWwwc', {
        mouseButtonMask: 1,
        targetElements,
      });
    },
    [cornerstoneTools, getValidElements, selectedImageId]
  );

  const [histogramData, setHistogramData] = useState(null);

  const activateHistogramTool = useCallback(
    ({ rotationAngle, targetImageId, sourceImageId }) => {
      const selectedElement = document.getElementById(targetImageId);
      cornerstoneTools.init();
      cornerstoneTools.addToolForElement(selectedElement, CustomHistogramTool);
      cornerstoneTools.setToolActiveForElement(
        selectedElement,
        'CustomHistogram',
        {
          mouseButtonMask: 1,
          setHistogramData,
          setToolData,
          toolData: get(toolData, sourceImageId),
          rotationAngle,
        }
      );
    },
    [cornerstoneTools, toolData, setToolData, setHistogramData]
  );

  const resetHistogramTool = useCallback(() => {
    cornerstoneTools.setToolDisabled('CustomHistogram');
    activateTool('Eraser');
  }, [cornerstoneTools, activateTool]);

  const [threshold, setThreshold] = useState(0);

  const toolDataUpload = useCallback(
    (file) => {
      if (isNil(file)) return;
      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF-8');

      const ele = getSelectedElement();
      const selectedElement = document.getElementById(ele.image.imageId);

      fileReader.onload = (e) => {
        const data = JSON.parse(e.target.result);

        cornerstoneTools.init();
        cornerstoneTools.addToolForElement(
          selectedElement,
          CustomHistogramTool
        );
        cornerstoneTools.setToolActiveForElement(
          selectedElement,
          'CustomHistogram',
          {
            mouseButtonMask: 1,
            setHistogramData,
            setToolData,
            toolData: castArray(data),
          }
        );
        setThreshold(data.threshold);
      };
    },
    [cornerstoneTools, setHistogramData, setToolData, getSelectedElement]
  );

  const exportToolData = useCallback(
    (threshold) => {
      if (isEmpty(cornerstone.getEnabledElements())) {
        alert('請先上傳圖檔');
        return;
      }
      const element = getSelectedElement();
      const [data] = toolData[element.image.imageId];

      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify({
          ...data,
          threshold,
        })
      )}`;
      const link = document.createElement('a');
      link.href = jsonString;
      link.download = `${element.image.imageId}.json`;

      link.click();
    },
    [cornerstone, getSelectedElement, toolData]
  );

  return {
    imageInfos,
    selectedPosition,
    setSelectedPosition,
    imageUpload,
    activateTool,
    activateLengthTool,
    activateWwwcTool,
    exportImage,
    getSelectedElement,
    getValidElements,
    activateHistogramTool,
    toolDataUpload,
    exportToolData,
    toolData,
    setToolData,
    histogramData,
    setHistogramData,
    resetHistogramTool,
    setThreshold,
    threshold,
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
