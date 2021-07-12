import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import {
    AspectRatio,
} from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

const AreaTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
      cornerstoneTools.init();
      const FreehandRoiTool = cornerstoneTools.FreehandRoiTool;
      cornerstoneTools.addTool(FreehandRoiTool);
      toolManageService.areaTool();
  };

  return (
      <IconButton onClick={clickHandler}>
        <AspectRatio />
      </IconButton>
  );
};

export default AreaTool;