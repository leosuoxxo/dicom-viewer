import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { IconButton, Popover, Button } from '@material-ui/core';
import { Apps } from '@material-ui/icons';
import { isNull, map } from 'lodash';
import { VIEWER_LAYOUT } from '../../constants';
import ConfigContext from '../../ConfigContext';

const ViewerController = styled(Popover)`
  && .MuiPopover-paper {
    padding: 5px;
  }
`;

const ViewerButton = styled(Button)`
  min-width: 30px;
  height: 30px;
  margin: 3px;
  background: ${({ active }) => (active ? 'antiquewhite' : 'black')};
`;

export const MultipleViewerTool = () => {
  const { currentLayout, setCurrentLayout } = useContext(ConfigContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const onClickIcon = (event) => {
    setAnchorEl(event.target);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={onClickIcon}>
        <Apps />
      </IconButton>
      <ViewerController
        open={!isNull(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {map(VIEWER_LAYOUT, (layout) => (
          <ViewerButton
            active={currentLayout >= layout}
            onClick={() => setCurrentLayout(layout)}
          />
        ))}
      </ViewerController>
    </>
  );
};
