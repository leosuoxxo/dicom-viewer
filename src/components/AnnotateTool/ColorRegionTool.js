import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { FormatColorFill } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const ColorRegionTool = () => {
  const { activateTool } = useContext(ToolManageService);

  return (
    <Tooltip title="區域顏色(自定義)">
      <IconButton onClick={() => console.log('click')}>
        <FormatColorFill />
      </IconButton>
    </Tooltip>
  );
};
