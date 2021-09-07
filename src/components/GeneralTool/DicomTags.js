import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';

import { ToolManageService } from '../../services/toolManageService';

export const DicomTagsButton = () => {
  const { getDicomTags } = useContext(ToolManageService);

  const clickHandler = () => {
    getDicomTags();
  };

  return (
    <Tooltip title="標籤">
      <IconButton onClick={clickHandler}>
        <LocalOffer />
      </IconButton>
    </Tooltip>
  );
};
