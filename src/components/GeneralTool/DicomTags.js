import React, { useContext, useState } from 'react';
import { IconButton, Tooltip, Drawer } from '@material-ui/core';
import { LocalOffer } from '@material-ui/icons';
import { compact, includes, isEmpty, join, keys, map, slice } from 'lodash';
import styled from 'styled-components';

import { ToolManageService } from '../../services/toolManageService';
import {
  DCM_TAGS,
  SPECIFIC_SERIAL,
  UIDS,
  PIXEL_DATA_SERIAL,
  UINT_SERIAL,
} from '../../constants';
import { Box } from '../elements';

const StyledSidebar = styled(Drawer)`
  && .MuiDrawer-paper {
    width: 40vw;
  }
`;

const StyledHeader = styled(Box)`
  font-size: 20px;
  margin: 10px;
`;

export const DicomTagsButton = () => {
  const { getSelectedElement } = useContext(ToolManageService);

  const [open, setOpen] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [undefinedTagList, setUndefinedTagList] = useState([]);

  const clickHandler = () => {
    const element = getSelectedElement();
    if (isEmpty(element)) {
      alert('請先上傳圖檔');
      return;
    }

    const dcmHeader = map(DCM_TAGS, ({ text, serial }) => {
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

      if (includes(UINT_SERIAL, serial))
        return {
          name: text,
          value: element.image.data.uint16(serial),
        };

      return {
        name: text,
        value: element.image.data.string(serial),
      };
    });

    const undefinedDcmHeader = compact(
      map(keys(element.image.data.elements), (tags) => {
        if (
          !includes(
            map(DCM_TAGS, ({ serial }) => serial),
            tags
          )
        ) {
          return {
            name: `（${join(slice(tags, 1, 5), '')}，${join(
              slice(tags, 5),
              ''
            )}）`,
            value: element.image.data.string(tags),
          };
        }
      })
    );

    setOpen(true);
    setTagList(dcmHeader);
    setUndefinedTagList(undefinedDcmHeader);
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
        <StyledHeader>規範</StyledHeader>
        {map(tagList, ({ name, value }) => (
          <Box
            style={{
              margin: '3px 0',
            }}
          >{`${name}: ${value || ' ❌ '}`}</Box>
        ))}
        <StyledHeader>未規範</StyledHeader>
        {map(undefinedTagList, ({ name, value }) => (
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
