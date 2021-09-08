import React, { useContext, useState } from 'react';
import { IconButton, Tooltip, Drawer } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';
import { includes, isEmpty, map } from 'lodash';
import styled from 'styled-components';

import { ToolManageService } from '../../services/toolManageService';
import {
  DCM_TAGS,
  SPECIFIC_SERIAL,
  UIDS,
  PIXEL_DATA_SERIAL,
} from '../../constants';
import { Box } from '../elements';

const StyledSidebar = styled(Drawer)`
  && .MuiDrawer-paper {
    width: 40vw;
  }
`;

export const DicomTagsButton = () => {
  const { getSelectedElement } = useContext(ToolManageService);

  const [open, setOpen] = useState(false);
  const [tagList, setTagList] = useState([]);

  const clickHandler = () => {
    const element = getSelectedElement();
    if (isEmpty(element)) {
      alert('請先上傳圖檔');
      return;
    }

    const list = map(DCM_TAGS, ({ text, serial }) => {
      if (PIXEL_DATA_SERIAL === serial)
        return {
          name: text,
          value: `Array of ${element.image.getPixelData().length} elements`,
        };

      if (includes(SPECIFIC_SERIAL, serial))
        return {
          name: text,
          value: UIDS[element.image.data.string(serial)],
        };

      return {
        name: text,
        value: element.image.data.string(serial),
      };
    });
    setOpen(true);
    setTagList(list);
  };

  return (
    <>
      <Tooltip title="標籤">
        <IconButton onClick={clickHandler}>
          <LocalOffer />
        </IconButton>
      </Tooltip>
      <StyledSidebar
        anchor={'right'}
        open={open}
        onClose={() => setOpen(false)}
      >
        {map(tagList, ({ name, value }) => (
          <Box
            style={{
              margin: '3px 0',
            }}
          >{`${name}: ${value || ' ❌ '}`}</Box>
        ))}
      </StyledSidebar>
    </>
  );
};
