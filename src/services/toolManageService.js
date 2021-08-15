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
          let bytes = new Uint8Array(buffer);
          let dicomData = dicomParser.parseDicom(bytes);
          let modified_bytes = new Uint8Array(bytes.length);
          let prefix_len = 0;
          while (bytes[prefix_len] == 0) {
            prefix_len++;
          }
          prefix_len += 4;
          modified_bytes.set(bytes.subarray(0, prefix_len), 0);

          let r_index = prefix_len;
          let w_index = prefix_len;
          while (r_index < bytes.length) {
            const tag = new Uint16Array(
              bytes.slice(r_index, r_index + 4).buffer
            );
            const tag_str =
              'x' +
              tag[0].toString(16).padStart(4, '0') +
              tag[1].toString(16).padStart(4, '0');

            const element = dicomData.elements[tag_str];
            const data_begin = element.dataOffset;
            const data_end = data_begin + element.length;
            const info_length = data_begin - r_index;

            switch (tag_str) {
              case 'x00281050':
              case 'x00281051': {
                console.log(`Ignore tag: ${tag_str}`);
                break;
              }
              case 'x00280008': {
                // write Tag and VR
                modified_bytes.set(bytes.subarray(r_index, r_index+6), w_index);
                w_index += 6;
                // write Value Length
                modified_bytes.set([1, 0], w_index);
                w_index += 2;
                // write data
                modified_bytes.set(['1'.charCodeAt()], w_index);
                w_index += 1;
                break;
              }
              case 'x00280002': {
                // write Tag and VR
                modified_bytes.set(bytes.subarray(r_index, r_index+6), w_index);
                w_index += 6;
                // write Value Length
                modified_bytes.set([2, 0], w_index);
                w_index += 2;
                // write data
                modified_bytes.set([1, 0], w_index);
                w_index += 2;
                break;
              }
              default: {
                // write Tag, VR, and Value Length
                modified_bytes.set(bytes.subarray(r_index, data_end), w_index);
                w_index += info_length;
                // write data
                modified_bytes.set(bytes.subarray(data_begin, data_end), w_index);
                w_index += element.length;
              }
            }

            r_index = data_end;
          }

          const actual_written_buffer = modified_bytes.slice(0, w_index).buffer;
          file = new File([actual_written_buffer], 'modified_file');
          const imageId =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
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
