import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Delete } from '@material-ui/icons';
import { Box } from '../../components/elements';
import { encryptMachineId } from '../../utils/crypto';

const MachineForm = ({ onChange = () => {} }) => {
  const [id, setId] = useState('');
  const [error, setError] = useState(false);

  const handleUpdate = (event) => {
    setError(false);
    const { value } = event.target;
    setId(value);
  };

  const generateCode = () => {
    if (!id) {
      setError(true);
      return;
    }
    setId('');
    onChange({
      [id]: encryptMachineId(id),
    });
  };

  return (
    <Box width="100%" my={3}>
      {error && (
        <Alert variant="filled" severity="error">
          machine id 為必填
        </Alert>
      )}
      <Box display="flex" alignItems="center">
        <Box width="45%">
          <TextField
            label="machine id"
            fullWidth
            value={id}
            onChange={handleUpdate}
          />
        </Box>
        <Box width="45%">
          <Button
            disabled={!id}
            color="primary"
            variant="contained"
            onClick={generateCode}
          >
            產生
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

MachineForm.propTypes = {
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export const MachineIdsForm = ({ updateFormData, machineIds }) => {
  const deleteTargetId = useRef();
  // const [machineIds, setMachineIds] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);

  const updateMachineIds = (value) => {
    updateFormData({
      ...machineIds,
      ...value,
    });
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpen = (id) => () => {
    deleteTargetId.current = id;
    setDialogOpen(true);
  };

  const handleDelete = () => {
    const id = deleteTargetId.current;
    delete machineIds[id];
    updateFormData({ ...machineIds });
    handleClose();
  };

  return (
    <Box>
      {Object.entries(machineIds).map(([id, code]) => {
        return (
          <Box key={id} display="flex" alignItems="center">
            <Box width="45%">
              <TextField label="machine id" fullWidth value={id} disabled />
            </Box>
            <Box width="50%" ml={3}>
              <TextField fullWidth label="認證碼" value={code} disabled />
            </Box>
            {code && (
              <IconButton onClick={handleOpen(id)}>
                <Delete />
              </IconButton>
            )}
          </Box>
        );
      })}
      <MachineForm onChange={updateMachineIds} />
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>確定要刪除？</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} autoFocus>
            取消
          </Button>
          <Button onClick={handleDelete}>確定</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

MachineIdsForm.propTypes = {
  machineIds: PropTypes.object,
  updateFormData: PropTypes.func,
};
