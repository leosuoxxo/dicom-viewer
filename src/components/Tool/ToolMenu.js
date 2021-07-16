import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { Build } from '@material-ui/icons';

import { Box } from '../elements';
import { LengthTool, AreaTool, AngleTool } from './';

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
            <LengthTool />
          </ListItemIcon>
          <ListItemIcon>
            <AngleTool />
          </ListItemIcon>
          <ListItemIcon>
            <AreaTool />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Box>
  );
};
