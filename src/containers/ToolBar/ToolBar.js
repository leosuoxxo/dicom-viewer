import React from 'react';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

import { Flex } from '../../components/elements';
import {
  HandTool,
  ToolMenu,
  LengthTool,
  WwwcTool,
  ColorReplaceTool,
} from '../../components/AnnotateTool';
import {
  FileUploadTool,
  ExportImageTool,
  MultipleViewerTool,
  DicomTagsButton,
} from '../../components/GeneralTool';

export const ToolBar = () => {
  return (
    <AppBar>
      <Toolbar>
        {/*Frequently used tools*/}
        <FileUploadTool />
        <HandTool />
        <LengthTool />
        <WwwcTool />
        <ColorReplaceTool />
        <Flex style={{ flexGrow: 1 }} />

        {/*Annotate Tool*/}
        <ToolMenu />
        {/*General function*/}
        <DicomTagsButton />
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
