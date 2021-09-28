import React, { useCallback, useContext, useState } from 'react';
import {
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Button,
} from '@material-ui/core';
import { FormatLineSpacing } from '@material-ui/icons';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ToolManageService } from '../../services/toolManageService';
import { PIXEL_TO_MM_MODE } from '../../constants';

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

const LengthToolDialog = ({ open, onClose }) => {
  const { activateLengthTool } = useContext(ToolManageService);

  const [ratio, setRatio] = useState('');
  const [mode, setMode] = useState(PIXEL_TO_MM_MODE[0]);

  const onConfirm = useCallback(() => {
    if (mode === PIXEL_TO_MM_MODE[0]) {
      activateLengthTool({ mode });
    }

    if (mode === PIXEL_TO_MM_MODE[1]) {
      activateLengthTool({
        mode,
        ratio,
      });
    }
    onClose();
  }, [activateLengthTool, ratio, mode, onClose]);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>Pixel To MM</DialogTitle>
      <RadioGroup
        defaultValue={PIXEL_TO_MM_MODE[0]}
        name="radio-buttons-group"
        row
      >
        <FormControlLabel
          value={PIXEL_TO_MM_MODE[0]}
          control={<Radio onChange={() => setMode(PIXEL_TO_MM_MODE[0])} />}
          label={PIXEL_TO_MM_MODE[0]}
        />
        <FormControlLabel
          value={PIXEL_TO_MM_MODE[1]}
          control={<Radio onChange={() => setMode(PIXEL_TO_MM_MODE[1])} />}
          label={PIXEL_TO_MM_MODE[1]}
        />
      </RadioGroup>
      <TextField
        label="1 Pixel ="
        value={ratio}
        onChange={(event) => setRatio(event.target.value)}
        sx={{ m: 1, width: '25ch' }}
        InputProps={{
          endAdornment: <InputAdornment position="start">mm</InputAdornment>,
        }}
        type="number"
        disabled={mode !== 'custom'}
      />
      <StyledButton variant="contained" onClick={onConfirm}>
        確認
      </StyledButton>
    </StyledDialog>
  );
};

LengthToolDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export const LengthTool = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <LengthToolDialog open={open} onClose={() => setOpen(false)} />
      <Tooltip title="長度測量(自定義)">
        <IconButton onClick={() => setOpen(true)}>
          <FormatLineSpacing />
        </IconButton>
      </Tooltip>
    </>
  );
};
