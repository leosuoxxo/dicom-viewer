import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatColorFill } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const ColorReplaceTool = () => {
  const { activateColorReplaceTool } = useContext(ToolManageService);

  return (
    <Tooltip title="顏色替換(自定義)">
      <IconButton onClick={() => activateColorReplaceTool()}>
        <FormatColorFill />
      </IconButton>
    </Tooltip>
  );
};
