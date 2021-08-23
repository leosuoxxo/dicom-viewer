import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatClear } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const EraserTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const EraserTool = cornerstoneTools.EraserTool;
    cornerstoneTools.addTool(EraserTool);
    toolManageService.eraserTool();
  };

  return (
    <Tooltip title="移除標註">
      <IconButton onClick={clickHandler}>
        <FormatClear />
      </IconButton>
    </Tooltip>
  );
};
