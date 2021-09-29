import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { CropDin } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const WwwcTool = () => {
  const { activateWwwcTool } = useContext(ToolManageService);

  return (
    <Tooltip title="區域灰階（自定義）">
      <IconButton onClick={() => activateWwwcTool()}>
        <CropDin />
      </IconButton>
    </Tooltip>
  );
};
