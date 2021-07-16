import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const ProbeTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const ProbeTool = cornerstoneTools.ProbeTool;
    cornerstoneTools.addTool(ProbeTool);
    toolManageService.probeTool();
  };

  return (
    <Tooltip title="顏色探測">
      <IconButton onClick={clickHandler}>
        <Colorize />
      </IconButton>
    </Tooltip>
  );
};
