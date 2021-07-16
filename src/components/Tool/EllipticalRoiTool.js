import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { DonutLarge } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const EllipticalRoiTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
    cornerstoneTools.addTool(EllipticalRoiTool);
    toolManageService.ellipticalRoiTool();
  };

  return (
    <Tooltip title="面積測量(圓形)">
      <IconButton onClick={clickHandler}>
        <DonutLarge />
      </IconButton>
    </Tooltip>
  );
};
