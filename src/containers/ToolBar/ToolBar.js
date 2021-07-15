import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import {
    Build,
    ExitToApp,
} from '@material-ui/icons';

import { Flex } from '../../components/elements';
import { AngleTool, AreaTool, LengthTool, FileUploadTool } from '../../components/Tool';

export const ToolBar = () => {
  return (
    <AppBar>
      <Toolbar>
        {/*Frequently used tools*/}
        <FileUploadTool />
        <LengthTool />
        <AngleTool />
        <AreaTool />
        <Flex style={{ flexGrow: 1 }} />

        {/*General function*/}
        {/*TBD: list all of supported tools*/}
        <IconButton>
          <Build />
        </IconButton>
        {/*TBD: licence related*/}
        <IconButton>
          <ExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
