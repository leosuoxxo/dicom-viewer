import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { DonutLarge } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const EllipticalRoiTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="面積測量(圓形)">
      <IconButton onClick={() => activateTool('EllipticalRoi')}>
        <DonutLarge />
      </IconButton>
    </Tooltip>
  );
};
