import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';
import {
    FormatLineSpacing,
} from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

const LengthTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
      const LengthTool = cornerstoneTools.LengthTool;
      cornerstoneTools.addTool(LengthTool);
      toolManageService.lengthTool();
  };

  return (
      <IconButton onClick={clickHandler}>
        <FormatLineSpacing />
      </IconButton>
  );
};

export default LengthTool;