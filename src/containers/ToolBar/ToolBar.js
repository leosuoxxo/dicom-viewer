import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';

import FileUploadTool from './FileUploadTool';
import LengthTool from './LengthTool';

export const ToolBar = () => {
  return (
    <AppBar>
      <Toolbar>
        <FileUploadTool />
        <LengthTool />
      </Toolbar>
    </AppBar>
  );
};
