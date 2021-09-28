import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { PanTool } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import CustomLengthTool from './CustomTool/CustomLengthTool';

export const LengthTool = () => {
  const { activateLengthTool } = useContext(ToolManageService);

  return (
    <Tooltip title="長度測量">
      <IconButton
        onClick={() => activateLengthTool(CustomLengthTool, 'CustomLength')}
      >
        <PanTool />
      </IconButton>
    </Tooltip>
  );
};
