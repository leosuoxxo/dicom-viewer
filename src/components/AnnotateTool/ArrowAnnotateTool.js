import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { TextFields } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const ArrowAnnotateTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="文字標註">
      <IconButton onClick={() => activateTool('ArrowAnnotate')}>
        <TextFields />
      </IconButton>
    </Tooltip>
  );
};
