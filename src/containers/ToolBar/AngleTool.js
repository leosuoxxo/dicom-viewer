import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import {
    TextRotationAngleup,
} from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

const AngleTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
      cornerstoneTools.init();
      const AngleTool = cornerstoneTools.AngleTool;
      cornerstoneTools.addTool(AngleTool);
      toolManageService.angleTool();
  };

  return (
      <IconButton onClick={clickHandler}>
        <TextRotationAngleup />
      </IconButton>
  );
};

export default AngleTool;