import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { AspectRatio } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const RectangleRoiTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
    cornerstoneTools.addTool(RectangleRoiTool);
    toolManageService.rectangleRoiTool();
  };

  return (
    <Tooltip title="面積測量(方形)">
      <IconButton onClick={clickHandler}>
        <AspectRatio />
      </IconButton>
    </Tooltip>
  );
};
