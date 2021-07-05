import React, { useContext, useRef } from 'react';
import { AppBar, IconButton } from '@material-ui/core';
import {
  InsertDriveFileOutlined,
  Remove,
} from '@material-ui/icons';
import Box from '../../components/Box';
import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';

const FileUploadTool = () => {
  const inputRef = useRef();
  const toolManageService = useContext(ToolManageService);

  const fileUploadHanlder = (event) => {
    const file = event.target.files[0];
    toolManageService.imageUpload(file);
  };

  const clickHandler = () => {
    inputRef.current.click();
  };

  return (
    <IconButton onClick={clickHandler}>
      <InsertDriveFileOutlined />
      <input hidden ref={inputRef} type="file" onChange={fileUploadHanlder} />
    </IconButton>
  );
};

const LengthTool = () => {
  const { cornerstoneTools } = useCornerstone();
  const toolManageService = useContext(ToolManageService);

  const clickHandler = () => {
    const LengthTool = cornerstoneTools.LengthTool;
    cornerstoneTools.addTool(LengthTool);
    toolManageService.lengthTool();
  };

  return (
    <IconButton onClick={clickHandler}>
      <Remove />
    </IconButton>
  );
};

export const ToolBar = () => {
  return (
    <AppBar>
      <Box display="flex" p={2}>
        <FileUploadTool />
        <LengthTool />
      </Box>
    </AppBar>
  );
};
