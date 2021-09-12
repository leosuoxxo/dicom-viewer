import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useRequest } from 'ahooks';
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
import {
  RepositoryName,
  RepositoryFactory,
} from '../../repository/RepositoryFactory';
const repository = RepositoryFactory[RepositoryName.Organization];

export const CodeInputDialog = ({ open }) => {
  const history = useHistory();
  const [code, setCode] = useState(['', '', '', '']);
  const authenticationCode = code.join('-');

  const { loading, run, error } = useRequest(
    ({ code }) => repository.authenticateCode({ code }),
    {
      manual: true,
      throwOnError: true,
      onSuccess: () => {
        localStorage.setItem('code', authenticationCode);
        history.push('/');
      },
      onError: () => {
        localStorage.removeItem('code');
      },
    }
  );

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

  useEffect(() => {
    const code = localStorage.getItem('code');
    if (!code) return;
    run({ code });
  }, [run]);

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
