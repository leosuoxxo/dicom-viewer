import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';
import { includes, isEmpty, map } from 'lodash';

import { ToolManageService } from '../../services/toolManageService';
import { useCornerstone } from '../../services/cornerstoneService';
import { DCM_TAGS, SPECIFIC_SERIAL, UIDS } from '../../constants';

export const DicomTagsButton = () => {
  const { cornerstone } = useCornerstone();
  console.log(cornerstone);
  const { getSelectedElement } = useContext(ToolManageService);

  const clickHandler = () => {
    const element = getSelectedElement();
    if (isEmpty(element)) return;
    console.log(element);
    const tagList = map(DCM_TAGS, ({ text, serial }) => {
      if (includes(SPECIFIC_SERIAL, serial)) {
        const value =
          UIDS[element.image.data.string(serial)] ||
          element.image.data.string(serial);

        return {
          name: text,
          value: value,
        };
      }
      return {
        name: text,
        value: element.image.data.string(serial),
      };
    });
    console.log('list', tagList);
  };

  return (
    <Tooltip title="標籤">
      <IconButton onClick={clickHandler}>
        <LocalOffer />
      </IconButton>
    </Tooltip>
  );
};
