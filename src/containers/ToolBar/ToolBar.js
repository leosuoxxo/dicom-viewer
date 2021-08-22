import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

import { Flex } from '../../components/elements';
import {
  AngleTool,
  FreeHandRoiTool,
  LengthTool,
  ToolMenu,
} from '../../components/AnnotateTool';
import {
  FileUploadTool,
  ExportImageTool,
  MultipleViewerTool,
} from '../../components/GeneralTool';

export const ToolBar = () => {
  return (
    <AppBar>
      <Toolbar>
        {/*Frequently used tools*/}
        <FileUploadTool />
        <LengthTool />
        <AngleTool />
        <FreeHandRoiTool />
        <Flex style={{ flexGrow: 1 }} />

        {/*Annotate Tool*/}
        <ToolMenu />
        {/*General function*/}
        <MultipleViewerTool />
        {/*TBD: list all of supported tools*/}
        <ExportImageTool />
        {/*TBD: licence related*/}
        <IconButton>
          <ExitToApp />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
