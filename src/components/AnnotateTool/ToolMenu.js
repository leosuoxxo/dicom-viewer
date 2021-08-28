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
import { map } from 'lodash';

const annotationTools = [
  {
    name: 'EraserTool',
    comp: <EraserTool />,
  },
  {
    name: 'HandTool',
    comp: <HandTool />,
  },
  {
    name: 'LengthTool',
    comp: <LengthTool />,
  },
  {
    name: 'FreeHandRoiTool',
    comp: <FreeHandRoiTool />,
  },
  {
    name: 'AngleTool',
    comp: <AngleTool />,
  },
  {
    name: 'RectangleRoiTool',
    comp: <RectangleRoiTool />,
  },
  {
    name: 'EllipticalRoiTool',
    comp: <EllipticalRoiTool />,
  },
  {
    name: 'ProbeTool',
    comp: <ProbeTool />,
  },
  {
    name: 'ArrowAnnotateTool',
    comp: <ArrowAnnotateTool />,
  },
];

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
          {map(annotationTools, ({ name, comp }) => (
            <ListItemIcon key={name}>{comp}</ListItemIcon>
          ))}
        </MenuItem>
      </Menu>
    </Box>
  );
};
