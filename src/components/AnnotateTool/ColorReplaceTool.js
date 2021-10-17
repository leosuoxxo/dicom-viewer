import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  RadioGroup,
  Checkbox,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { FormatColorFill } from '@material-ui/icons';

import { ToolManageService } from '../../services/toolManageService';
import { concat, filter, find, get, isEmpty, isNil } from 'lodash';
import { VIEWER_LAYOUT } from '../../constants';

const StyledDialog = styled(Dialog)`
  && .MuiDialog-paperWidthSm {
    padding: 20px;
  }
`;

const StyledButton = styled(Button)`
  && .MuiButton-root {
    margin: 20px 0 0 0;
  }
`;

const ColorReplaceToolDialog = ({ open, onClose }) => {
  const { activateGrayscaleRegionTool, imageInfos } =
    useContext(ToolManageService);

  const [targetImages, setTargetImages] = useState([]);

  const getImageIdFromPosition = useCallback(
    (pos) => {
      return get(
        find(imageInfos, (info) => info.position === pos),
        'id'
      );
    },
    [imageInfos]
  );

  const checkboxHandler = useCallback(
    (checked, pos) => {
      setTargetImages((ids) => {
        if (checked) {
          return concat(ids, getImageIdFromPosition(pos));
        } else {
          return filter(ids, (id) => id !== getImageIdFromPosition(pos));
        }
      });
    },
    [setTargetImages, getImageIdFromPosition]
  );

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>選取變化圖片</DialogTitle>
      <RadioGroup
        defaultValue={VIEWER_LAYOUT[0]}
        name="radio-buttons-group"
        row
      >
        <FormControlLabel
          value={VIEWER_LAYOUT[0]}
          control={
            <Checkbox
              onChange={(event) =>
                checkboxHandler(event.target.checked, VIEWER_LAYOUT[0])
              }
            />
          }
          label={'左圖'}
          disabled={isNil(getImageIdFromPosition(VIEWER_LAYOUT[0]))}
        />
        <FormControlLabel
          value={VIEWER_LAYOUT[1]}
          control={
            <Checkbox
              onChange={(event) =>
                checkboxHandler(event.target.checked, VIEWER_LAYOUT[1])
              }
            />
          }
          label={'右圖'}
          disabled={isNil(getImageIdFromPosition(VIEWER_LAYOUT[1]))}
        />
      </RadioGroup>
      <StyledButton
        variant="contained"
        onClick={() => {
          activateGrayscaleRegionTool(targetImages);
          setTargetImages([]);
          onClose();
        }}
        disabled={isEmpty(targetImages)}
      >
        確認
      </StyledButton>
    </StyledDialog>
  );
};

ColorReplaceToolDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const ColorReplaceTool = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ColorReplaceToolDialog open={open} onClose={() => setOpen(false)} />
      <Tooltip title="區域灰階（自定義）">
        <IconButton onClick={() => setOpen(true)}>
          <FormatColorFill />
        </IconButton>
      </Tooltip>
    </>
  );
};
