import React, { useContext, useRef } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import {
    CloudUpload,
} from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const FileUploadTool = () => {
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
      <Tooltip title="檔案上傳">
        <IconButton onClick={clickHandler}>
        <CloudUpload />
        <input hidden ref={inputRef} type="file" onChange={fileUploadHanlder} />
        </IconButton>
      </Tooltip>
  );
};