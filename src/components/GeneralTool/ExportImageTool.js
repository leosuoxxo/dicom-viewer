import React, { useState } from 'react';
import styled from 'styled-components';
import { IconButton, Popover, Tooltip } from '@material-ui/core';
import { SaveAlt } from '@material-ui/icons';
import { Box } from '../../components/elements';
import { useToolManage } from '../../services/toolManageService';
import { IMAGE_TYPE } from '../../constants';

const PopoverItem = styled(Box)`
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.palette.action.hover};
  }
`;

export const ExportImageTool = () => {
  const { exportImage } = useToolManage();

  const [anchorEl, setAnchorEl] = useState(null);

  const clickHandler = (event) => {
    setAnchorEl(event.target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const exportImageHandler = (imageType) => () => exportImage({ imageType });

  return (
    <>
      <Tooltip title="匯出圖片">
        <IconButton onClick={clickHandler}>
          <SaveAlt />
        </IconButton>
      </Tooltip>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <PopoverItem p={3} onClick={exportImageHandler(IMAGE_TYPE.JPG)}>
          JPEG
        </PopoverItem>
        <PopoverItem p={3} onClick={exportImageHandler(IMAGE_TYPE.PNG)}>
          PNG
        </PopoverItem>
        <PopoverItem p={3} onClick={exportImageHandler(IMAGE_TYPE.TIFF)}>
          TIFF
        </PopoverItem>
      </Popover>
    </>
  );
};
