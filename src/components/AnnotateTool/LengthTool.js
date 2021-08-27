import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatLineSpacing } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const LengthTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="長度測量">
      <IconButton onClick={() => activateTool('Length')}>
        <FormatLineSpacing />
      </IconButton>
    </Tooltip>
  );
};
