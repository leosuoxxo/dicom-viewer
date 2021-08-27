import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { BorderColor } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const FreeHandRoiTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="面積測量">
      <IconButton onClick={() => activateTool('FreeHandRoi')}>
        <BorderColor />
      </IconButton>
    </Tooltip>
  );
};
