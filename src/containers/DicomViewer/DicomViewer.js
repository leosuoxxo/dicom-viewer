import React, {
  useEffect,
  useRef,
  useContext,
  useCallback,
  useState,
} from 'react';
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
  const { cornerstone } = useCornerstone();
  const { selectedPosition, setSelectedPosition, activateTool } =
    useContext(ToolManageService);

  const canvasRef = useRef();

  const onLoadImage = useCallback(
    (element, image) => {
      cornerstone.displayImage(element, image);
      cornerstone.reset(element);
      activateTool('ZoomMouseWheel');
      activateTool('Pan');
    },
    [cornerstone, activateTool]
  );

  const [zoom, setZoom] = useState(null);
  const [wwwc, setWwwc] = useState(null);
  const onImageRendered = useCallback(() => {
    const canvas = canvasRef.current;
    const viewport = cornerstone.getViewport(canvas);
    setZoom(Math.round(viewport.scale.toFixed(2) * 100));
    setWwwc([
      Math.round(viewport.voi.windowWidth),
      Math.round(viewport.voi.windowCenter),
    ]);
  }, [canvasRef, cornerstone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (isNil(imageId) || !canvas) return;
    cornerstone.enable(canvas);
    cornerstone
      .loadImage(imageId)
      .then((image) => {
        onLoadImage(canvas, image);
        canvas.addEventListener('cornerstoneimagerendered', onImageRendered);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [imageId, cornerstone, onLoadImage, onImageRendered]);

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
            id={imageId}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            {!isNil(zoom) && (
              <Box
                style={{
                  position: 'absolute',
                  color: 'white',
                  bottom: 4,
                  right: 4,
                  fontSize: 24,
                }}
              >
                {`Zoom: ${zoom}%`}
              </Box>
            )}
            {!isNil(wwwc) && (
              <Box
                style={{
                  position: 'absolute',
                  color: 'white',
                  bottom: 4,
                  left: 4,
                  fontSize: 24,
                }}
              >
                {`WW/WC: ${wwwc[0]}/${wwwc[1]}`}
              </Box>
            )}
          </span>
        )}
      </ButtonBase>
    </ImageContainer>
  );
};

DicomViewer.propTypes = {
  imageId: PropTypes.string,
  position: PropTypes.string.isRequired,
};
