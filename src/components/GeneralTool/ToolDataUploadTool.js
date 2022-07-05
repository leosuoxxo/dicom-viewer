import React, { useContext, useRef } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { ToolManageService } from '../../services/toolManageService';

export const ToolDataUploadTool = () => {
  const inputRef = useRef();
  const { toolDataUpload } = useContext(ToolManageService);

  const fileUploadHanlder = (event) => {
    const file = event.target.files[0];
    toolDataUpload(file);
  };

  const clickHandler = () => {
    inputRef.current.click();
  };

  return (
    <Tooltip title="標註上傳">
      <IconButton onClick={clickHandler}>
        <Publish />
        <input hidden ref={inputRef} type="file" onChange={fileUploadHanlder} />
      </IconButton>
    </Tooltip>
  );
};
