import React, { useContext, useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from '@material-ui/core';
import {
  Build,
  FormatClear,
  PanTool,
  FormatLineSpacing,
  BorderColor,
  AspectRatio,
  SquareFoot,
  DonutLarge,
  Colorize,
  TextFields,
} from '@material-ui/icons';
import { map } from 'lodash';

import { Box } from '../elements';
import { ToolManageService } from '../../services/toolManageService';

const annotationTools = [
  {
    name: 'Eraser',
    tip: '移除標註',
    icon: <FormatClear />,
  },
  {
    name: 'Pan',
    tip: 'Pan Tool',
    icon: <PanTool />,
  },
  {
    name: 'Length',
    tip: '長度測量',
    icon: <FormatLineSpacing />,
  },
  {
    name: 'FreeHandRoi',
    tip: '面積測量',
    icon: <BorderColor />,
  },
  {
    name: 'Angle',
    tip: '角度測量',
    icon: <SquareFoot />,
  },
  {
    name: 'RectangleRoi',
    tip: '面積測量(方形)',
    icon: <AspectRatio />,
  },
  {
    name: 'EllipticalRoi',
    tip: '面積測量(圓形)',
    icon: <DonutLarge />,
  },
  {
    name: 'Probe',
    tip: '顏色探測',
    icon: <Colorize />,
  },
  {
    name: 'ArrowAnnotate',
    tip: '文字標註',
    icon: <TextFields />,
  },
];

export const ToolMenu = () => {
  const { activateTool } = useContext(ToolManageService);
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
          {map(annotationTools, ({ name, tip, icon }) => (
            <ListItemIcon key={name}>
              <Tooltip title={tip}>
                <IconButton onClick={() => activateTool(name)}>
                  {icon}
                </IconButton>
              </Tooltip>
            </ListItemIcon>
          ))}
        </MenuItem>
      </Menu>
    </Box>
  );
};
