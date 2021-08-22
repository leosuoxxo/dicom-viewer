import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { PanTool } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const HandTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const HandTool = cornerstoneTools.PanTool;
    cornerstoneTools.addTool(HandTool);
    toolManageService.handTool();
  };

  return (
    <Tooltip title="Pan Tool">
      <IconButton onClick={clickHandler}>
        <PanTool />
      </IconButton>
    </Tooltip>
  );
};
