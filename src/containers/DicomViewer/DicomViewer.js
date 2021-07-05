import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useCornerstone } from '../../services/cornerstoneService';

export const DicomViewer = ({ imageIds }) => {
  const { cornerstone, cornerstoneTools } = useCornerstone();

  const elementRef = useRef();

  const hasImageIds = imageIds && imageIds.length > 0;

  const createTools = useCallback(() => {
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 1 });

    const PanTool = cornerstoneTools.PanTool;

    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
  },[cornerstoneTools]);

  useEffect(() => {
    const element = elementRef.current;
    if (!hasImageIds || !element) return;
    cornerstone.enable(element);

    const imageId = imageIds[0];
    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(element, image);
        createTools();
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [imageIds, cornerstone, createTools, hasImageIds]);

  return hasImageIds ? (
    <Box ref={elementRef} flex="1" width="100%" height="100%" />
  ) : (
    <Box flex="1">
      <Skeleton width="100%" height="100%" />
    </Box>
  );
};

DicomViewer.propTypes = {
  imageIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
