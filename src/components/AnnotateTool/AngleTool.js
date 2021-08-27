import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { SquareFoot } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const AngleTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="角度測量">
      <IconButton onClick={() => activateTool('Angle')}>
        <SquareFoot />
      </IconButton>
    </Tooltip>
  );
};
