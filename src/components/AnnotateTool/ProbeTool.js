import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Colorize } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const ProbeTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="顏色探測">
      <IconButton onClick={() => activateTool('Probe')}>
        <Colorize />
      </IconButton>
    </Tooltip>
  );
};
