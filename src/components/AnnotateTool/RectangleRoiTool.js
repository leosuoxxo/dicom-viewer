import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { AspectRatio } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const RectangleRoiTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="面積測量(方形)">
      <IconButton onClick={() => activateTool('RectangleRoi')}>
        <AspectRatio />
      </IconButton>
    </Tooltip>
  );
};
