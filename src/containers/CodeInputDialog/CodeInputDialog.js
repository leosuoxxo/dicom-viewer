import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import RemoveIcon from '@material-ui/icons/Remove';
import ReactCodeInput from 'react-code-input';
import { Box } from '../../components/elements';
import { useAuthenticationCodeService } from '../../services/authenticationCode';

export const CodeInputDialog = ({ open }) => {
  const { code, setCode, loading, run, error, authenticationCode } =
    useAuthenticationCodeService();

  const changeHandler = (index) => (value) => {
    setCode((prev) => {
      let newData = prev.concat();
      newData[index] = value;
      return [...newData];
    });
  };

  const submit = () => {
    run({ code: authenticationCode });
  };

  return (
    <Dialog maxWidth="lg" open={open}>
      <DialogContent>
        <DialogContentText>請輸入驗證碼</DialogContentText>
        {error && (
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        )}
        <Box my={2}>
          <ReactCodeInput
            fields={4}
            autoFocus
            onChange={changeHandler(0)}
            value={code[0]}
          />
          <RemoveIcon />
          <ReactCodeInput
            fields={4}
            autoFocus={false}
            onChange={changeHandler(1)}
            value={code[1]}
          />
          <RemoveIcon />
          <ReactCodeInput
            fields={4}
            autoFocus={false}
            onChange={changeHandler(2)}
            value={code[2]}
          />
          <RemoveIcon />
          <ReactCodeInput
            fields={4}
            autoFocus={false}
            onChange={changeHandler(3)}
            value={code[3]}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={authenticationCode.length < 15}
            onClick={submit}
          >
            確認
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

CodeInputDialog.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
};
