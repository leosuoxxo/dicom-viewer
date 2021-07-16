import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { BorderColor } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const FreeHandRoiTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;
    cornerstoneTools.addTool(FreehandRoiTool);
    toolManageService.freehandRoiTool();
  };

  return (
    <Tooltip title="面積測量">
      <IconButton onClick={clickHandler}>
        <BorderColor />
      </IconButton>
    </Tooltip>
  );
};
