import React, { useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { isEqual, isNil } from 'lodash';
import styled from 'styled-components';

import { useCornerstone } from '../../services/cornerstoneService';
import { ToolManageService } from '../../services/toolManageService';

const ImageContainer = styled(Box)`
  border: 4px solid ${({ selected }) => (selected ? 'white' : 'transparent')};
`;

export const DicomViewer = ({ imageId, position }) => {
  const { cornerstone, cornerstoneTools } = useCornerstone();
  const {
    selectedPosition,
    setSelectedPosition,
    wwwcSynchronizer,
    activateTool,
  } = useContext(ToolManageService);

  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (isNil(imageId) || !canvas) return;
    cornerstone.enable(canvas);
    cornerstone
      .loadImage(imageId)
      .then((image) => {
        cornerstone.displayImage(canvas, image);
        cornerstone.reset(canvas);
        wwwcSynchronizer.add(canvas);
        activateTool('ZoomMouseWheel');
        activateTool('Pan');
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [imageId, cornerstone, cornerstoneTools, wwwcSynchronizer, activateTool]);

  return (
    <ImageContainer
      flex="1 1 50%"
      selected={isEqual(selectedPosition, position)}
    >
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
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        )}
      </ButtonBase>
    </ImageContainer>
  );
};

DicomViewer.propTypes = {
  imageId: PropTypes.string,
  position: PropTypes.string.isRequired,
};
