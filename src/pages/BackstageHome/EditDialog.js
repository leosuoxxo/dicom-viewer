import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  CircularProgress,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import DatePicker from '../../components/DatePicker';
import { Box } from '../../components/elements';
import {
  RepositoryName,
  RepositoryFactory,
} from '../../repository/RepositoryFactory';

const repository = RepositoryFactory[RepositoryName.Organization];

const StyledDialogTitle = styled(DialogTitle)`
  > h2 {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .updateTime {
      font-size: 12px;
      color: #ccc;
    }
  }
`;

export const StyledDialogContentText = styled(DialogContentText)`
  display: flex;
  flex-direction: column;
`;

export const OrganizationDialog = ({
  open,
  onClose,
  data,
  onSubmit,
  loading,
  success,
  successMessage,
  error,
  errorMessage,
}) => {
  const [formData, setFormData] = useState({});
  const updateFormData = useCallback(
    (key) => (event) => {
      let value;

      switch (key) {
        case 'isPublish':
          value = event.target.checked;
          break;
        case 'expiredAt':
          value = event;
          break;
        default:
          value = event.target.value;
      }

      setFormData((prev) => ({ ...prev, ...{ [key]: value } }));
    },
    []
  );

  const handleSubmit = () => {
    onSubmit({
      id: data?.id,
      ...formData,
    });
  };

  useEffect(() => {
    setFormData(data);
  }, [data]);

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={onClose}>
      {success && !error && (
        <Alert variant="filled" severity="success">
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert variant="filled" severity="error">
          {errorMessage}
        </Alert>
      )}
      <StyledDialogTitle>
        <div>編輯組織資料</div>
        {data?.updatedAt && (
          <div className="updateTime">
            上次更新時間： {dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm')}
          </div>
        )}
      </StyledDialogTitle>
      <DialogContent>
        <StyledDialogContentText>
          {data?.id && (
            <Box width="80%" my={3}>
              <TextField
                fullWidth
                required
                disabled
                label="id"
                defaultValue={data.id}
                onChange={updateFormData('id')}
              />
            </Box>
          )}
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              required
              label="名稱"
              defaultValue={data?.name}
              onChange={updateFormData('name')}
            />
          </Box>
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              label="聯絡人"
              defaultValue={data?.contactPerson}
              onChange={updateFormData('contactPerson')}
            />
          </Box>
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              label="統一編號"
              defaultValue={data?.taxIdNumber}
              onChange={updateFormData('taxIdNumber')}
            />
          </Box>
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              label="授權碼"
              defaultValue={data?.authenticationCode}
              onChange={updateFormData('authenticationCode')}
            />
          </Box>
          <Box width="80%" my={3}>
            <DatePicker
              fullWidth
              timestamp={
                data?.expiredAt || formData?.expiredAt || dayjs().valueOf()
              }
              onChange={updateFormData('expiredAt')}
            />
          </Box>
          <Box width="80%" my={3}>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={data?.isPublish}
                  name="isPublish"
                  color="primary"
                  onChange={updateFormData('isPublish')}
                />
              }
              label="啟用狀態"
            />
          </Box>
        </StyledDialogContentText>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Button onClick={onClose} variant="outlined">
              關閉
            </Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              loading={loading}
            >
              確認
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

OrganizationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  successMessage: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
};

export const EditDialog = ({ data, open, onClose }) => {
  const mutation = useMutation((organization) =>
    repository.update(organization)
  );

  const handleSubmit = (organization) => {
    mutation.mutate(organization);
  };

  return (
    <OrganizationDialog
      data={data}
      open={open}
      onClose={onClose}
      loading={mutation.isLoading}
      error={mutation.isError}
      errorMessage={mutation.error}
      success={mutation.isSuccess}
      successMessage="更新成功"
      onSubmit={handleSubmit}
    />
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
};

export const CreateDialog = ({ open, onClose }) => {
  const mutation = useMutation((organization) =>
    repository.create(organization)
  );

  const handleSubmit = (organization) => {
    mutation.mutate(organization);
  };

  useEffect(() => {
    if (open) mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <OrganizationDialog
      data={null}
      open={open}
      onClose={onClose}
      loading={mutation.isLoading}
      error={mutation.isError}
      errorMessage={mutation.error}
      success={mutation.isSuccess}
      successMessage="建立成功"
      onSubmit={handleSubmit}
    />
  );
};

CreateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
