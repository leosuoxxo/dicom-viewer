import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatLineSpacing } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const LengthTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool);
    toolManageService.lengthTool();
  };

  return (
    <Tooltip title="長度測量">
      <IconButton onClick={clickHandler}>
        <FormatLineSpacing />
      </IconButton>
    </Tooltip>
  );
};
