import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { PanTool } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const HandTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="無工具">
      <IconButton onClick={() => activateTool('Pan')}>
        <PanTool />
      </IconButton>
    </Tooltip>
  );
};
