import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { CropDin } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const WwwcRegionTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    cornerstoneTools.init();
    const WwwcRegionTool = cornerstoneTools.WwwcRegionTool;
    cornerstoneTools.addTool(WwwcRegionTool);
    toolManageService.wwwcRegionTool();
  };

  return (
    <Tooltip title="區域平均灰階">
      <IconButton onClick={clickHandler}>
        <CropDin />
      </IconButton>
    </Tooltip>
  );
};
