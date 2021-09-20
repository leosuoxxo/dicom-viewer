import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Box } from '../../components/elements';
import { useOfflineAuthenticationCode } from '../../services/authenticationCode';

export const OfflineCodeInputDialog = ({ open }) => {
  const { code, setCode, loading, error, authenticationCode } =
    useOfflineAuthenticationCode();

  const handleChange = (event) => {
    const { value } = event.target;
    setCode(value);
  };

  const submit = () => {
    authenticationCode(code);
  };

  return (
    <Dialog maxWidth="lg" open={open}>
      <DialogContent>
        <DialogContentText>請輸入驗證碼</DialogContentText>
        {error && (
          <Alert variant="filled" severity="error">
            驗證失敗
          </Alert>
        )}
        <Box width="860px" my={2}>
          <TextField fullWidth value={code} onChange={handleChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={code.length < 1}
            onClick={submit}
          >
            確認
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

OfflineCodeInputDialog.propTypes = {
  open: PropTypes.bool,
  onChange: PropTypes.func,
};
