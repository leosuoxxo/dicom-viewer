import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { InvertColors } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

export const InvertTool = () => {
  const { getSelectedElement } = useContext(ToolManageService);
  const { cornerstone } = useCornerstone();

  const clickHandler = () => {
    const selectedElement = getSelectedElement();
    const viewport = selectedElement.viewport;
    viewport.invert = !viewport.invert;
    cornerstone.setViewport(selectedElement.element, viewport);
  };

  return (
    <Tooltip title="對比">
      <IconButton onClick={clickHandler}>
        <InvertColors />
      </IconButton>
    </Tooltip>
  );
};
