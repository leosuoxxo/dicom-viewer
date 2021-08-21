import React, { useEffect, useRef, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isNil } from 'lodash';

import { useCornerstone } from '../../services/cornerstoneService';
import { ToolManageService } from '../../services/toolManageService';

export const DicomViewer = ({ imageId, position }) => {
  const { cornerstone, cornerstoneTools } = useCornerstone();
  const { setSelectedPosition } = useContext(ToolManageService);

  const elementRef = useRef();

  const createTools = useCallback(() => {
    const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

    cornerstoneTools.addTool(ZoomMouseWheelTool);
    cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 1 });

    const PanTool = cornerstoneTools.PanTool;

    cornerstoneTools.addTool(PanTool);
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
  }, [cornerstoneTools]);

  useEffect(() => {
    const element = elementRef.current;
    if (isNil(imageId) || !element) return;
    cornerstone.enable(element);

    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(element, image);
        createTools();
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [imageId, cornerstone, createTools]);

  return (
    <Box flex="1 1 50%">
      <ButtonBase
        onClick={() => {
          setSelectedPosition(position);
        }}
        disableRipple
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {isNil(imageId) ? (
          <Skeleton width="100%" height="100%" />
        ) : (
          <span
            ref={elementRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </ButtonBase>
    </Box>
  );
};

DicomViewer.propTypes = {
  imageId: PropTypes.string.isRequired,
  position: PropTypes.string.isRequired,
};
