import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { SquareFoot } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const AngleTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
      cornerstoneTools.init();
      const AngleTool = cornerstoneTools.AngleTool;
      cornerstoneTools.addTool(AngleTool);
      toolManageService.angleTool();
  };

  return (
      <Tooltip title="角度測量">
        <IconButton onClick={clickHandler}>
          <SquareFoot />
        </IconButton>
      </Tooltip>
  );
};
