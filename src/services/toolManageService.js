import React, { createContext, useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Tiff from 'tiff.js';
import { useCornerstone } from './cornerstoneService';
import { useCanvasToTiffService } from './canvasToTiffService';
import { getFileExtension, fileToBuffer } from '../utils';
import { IMAGE_TYPE } from '../constants';
import dicomParser from 'dicom-parser';

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
        case IMAGE_TYPE.TIFF:
        case IMAGE_TYPE.TIF: {
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
        case 'diconde': {
          const buffer = await fileToBuffer(file);
          const bytes = new Uint8Array(buffer);
          const dicomData = dicomParser.parseDicom(bytes);
          const modifiedBytes = new Uint8Array(bytes.length);

          // preamble and prefixing 'DICM'
          const preableLength = 128;
          const dicomPrefix = 'DICM';
          let totalPrefixLength = preableLength + dicomPrefix.length;
          modifiedBytes.set(bytes.subarray(0, totalPrefixLength), 0);

          // data elements
          let rIndex = totalPrefixLength;
          let wIndex = totalPrefixLength;
          while (rIndex < bytes.length) {
            const tag = new Uint16Array(bytes.slice(rIndex, rIndex + 4).buffer);
            const tagStr =
              'x' +
              tag[0].toString(16).padStart(4, '0') +
              tag[1].toString(16).padStart(4, '0');

            const element = dicomData.elements[tagStr];
            const dataBegin = element.dataOffset;
            const dataEnd = dataBegin + element.length;
            const infoLength = dataBegin - rIndex;

            switch (tagStr) {
              case 'x00281050':
              case 'x00281051': {
                console.log(`Ignore tag: ${tagStr}`);
                break;
              }
              case 'x00280008': {
                // write Tag and VR
                modifiedBytes.set(bytes.subarray(rIndex, rIndex + 6), wIndex);
                wIndex += 6;
                // write Value Length
                modifiedBytes.set([1, 0], wIndex);
                wIndex += 2;
                // write Value Field
                modifiedBytes.set(['1'.charCodeAt()], wIndex);
                wIndex += 1;
                break;
              }
              case 'x00280002': {
                // write Tag and VR
                modifiedBytes.set(bytes.subarray(rIndex, rIndex + 6), wIndex);
                wIndex += 6;
                // write Value Length
                modifiedBytes.set([2, 0], wIndex);
                wIndex += 2;
                // write Value Field
                modifiedBytes.set([1, 0], wIndex);
                wIndex += 2;
                break;
              }
              default: {
                // write Tag, VR, and Value Length
                modifiedBytes.set(bytes.subarray(rIndex, dataEnd), wIndex);
                wIndex += infoLength;
                // write Value Field
                modifiedBytes.set(bytes.subarray(dataBegin, dataEnd), wIndex);
                wIndex += element.length;
              }
            }

            rIndex = dataEnd;
          }

          const actualWrittenBuffer = modifiedBytes.slice(0, wIndex).buffer;
          const convertedFile = new File(
            [actualWrittenBuffer],
            `converted_${file.name}`
          );
          const imageId =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(convertedFile);
          setImageIds([imageId]);
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
