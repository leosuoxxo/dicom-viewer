import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatClear } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const EraserTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="移除標註">
      <IconButton onClick={() => activateTool('Eraser')}>
        <FormatClear />
      </IconButton>
    </Tooltip>
  );
};
