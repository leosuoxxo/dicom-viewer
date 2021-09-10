import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { CropDin } from '@material-ui/icons';

import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';
import { forEach, map } from 'lodash';

export const WwwcRegionTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    const ids = map(toolManageService.imageInfos, ({ id }) => id);
    if (ids.length === 2) {
      forEach(ids, (id) => {
        const imageCanvas = document.getElementById(id);
        toolManageService.wwwcSynchronizer.add(imageCanvas);
      });
    }
    cornerstoneTools.init();
    cornerstoneTools.addTool(cornerstoneTools.WwwcRegionTool);
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
