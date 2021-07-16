import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { TextFields } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const ArrowAnnotateTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
    cornerstoneTools.addTool(ArrowAnnotateTool);
    toolManageService.arrowAnnotateTool();
  };

  return (
    <Tooltip title="文字標註">
      <IconButton onClick={clickHandler}>
        <TextFields />
      </IconButton>
    </Tooltip>
  );
};
