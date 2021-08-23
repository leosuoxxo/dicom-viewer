import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { Build } from '@material-ui/icons';

import { Box } from '../elements';
import {
  EraserTool,
  HandTool,
  LengthTool,
  FreeHandRoiTool,
  AngleTool,
  RectangleRoiTool,
  EllipticalRoiTool,
  ProbeTool,
  ArrowAnnotateTool,
} from './';

export const ToolMenu = () => {
  const [anchorMenu, setAnchorMenu] = useState(null);

  const onOpenMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const onCloseMenu = () => {
    setAnchorMenu(null);
  };

  return (
    <Box>
      <IconButton onClick={onOpenMenu}>
        <Build />
      </IconButton>
      <Menu
        anchorEl={anchorMenu}
        keepMounted
        open={Boolean(anchorMenu)}
        onClose={onCloseMenu}
      >
        <MenuItem>
          <ListItemIcon>
            <EraserTool />
          </ListItemIcon>
          <ListItemIcon>
            <HandTool />
          </ListItemIcon>
          <ListItemIcon>
            <LengthTool />
          </ListItemIcon>
          <ListItemIcon>
            <AngleTool />
          </ListItemIcon>
          <ListItemIcon>
            <FreeHandRoiTool />
          </ListItemIcon>
          <ListItemIcon>
            <RectangleRoiTool />
          </ListItemIcon>
          <ListItemIcon>
            <EllipticalRoiTool />
          </ListItemIcon>
          <ListItemIcon>
            <ProbeTool />
          </ListItemIcon>
          <ListItemIcon>
            <ArrowAnnotateTool />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Box>
  );
};
