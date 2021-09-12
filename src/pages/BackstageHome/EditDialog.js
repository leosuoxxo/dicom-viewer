import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRequest } from 'ahooks';
import {
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Autorenew } from '@material-ui/icons';
import dayjs from 'dayjs';
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
  type,
  open,
  onClose,
  onEdit,
  data,
  onSubmit,
  loading,
  success,
  successMessage,
  error,
  errorMessage,
  handleRenew = () => {},
}) => {
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

      onEdit((prev) => ({ ...prev, ...{ [key]: value } }));
    },
    [onEdit]
  );

  const handleSubmit = () => {
    onSubmit({
      id: data?.id,
      ...data,
    });
  };

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
                value={data.id}
                onChange={updateFormData('id')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          )}
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              required
              label="名稱"
              defaultValue={data?.name}
              value={data?.name}
              onChange={updateFormData('name')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              label="聯絡人"
              defaultValue={data?.contactPerson}
              value={data?.contactPerson}
              onChange={updateFormData('contactPerson')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box width="80%" my={3}>
            <TextField
              fullWidth
              label="統一編號"
              defaultValue={data?.taxIdNumber}
              value={data?.taxIdNumber}
              onChange={updateFormData('taxIdNumber')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          {type === 'edit' && (
            <Box width="80%" my={3}>
              <TextField
                fullWidth
                value={data?.authenticationCode}
                onChange={updateFormData('authenticationCode')}
                disabled
                InputProps={{
                  shrink: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleRenew(data?.id)}>
                        <Autorenew />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}
          <Box width="80%" my={3}>
            <DatePicker
              fullWidth
              timestamp={data?.expiredAt}
              onChange={updateFormData('expiredAt')}
            />
          </Box>
          <Box width="80%" my={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={data?.isPublish}
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
            {type === 'create' && success && !error ? null : (
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                loading={loading}
              >
                確認
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

OrganizationDialog.propTypes = {
  type: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  data: PropTypes.object,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  success: PropTypes.bool,
  successMessage: PropTypes.string,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  handleRenew: PropTypes.func,
};

export const EditDialog = ({ targetId, open, onClose }) => {
  const [success, setSuccess] = useState(false);

  const {
    data,
    loading,
    error,
    mutate,
    run: fetchById,
  } = useRequest(() => repository.getById(targetId), {
    manual: true,
    throwOnError: true,
  });

  useEffect(() => {
    if (!targetId) return;
    fetchById(targetId);
  }, [fetchById, targetId]);

  const {
    loading: updateLoading,
    run: runUpdate,
    error: updateError,
  } = useRequest((organization) => repository.update(organization), {
    manual: true,
    throwOnError: true,
    onSuccess: () => {
      setSuccess(true);
    },
  });

  const {
    loading: renewLoading,
    run,
    error: renewError,
  } = useRequest((organizationId) => repository.renewCode(organizationId), {
    manual: true,
    throwOnError: true,
    onSuccess: (response) => {
      mutate((data) => {
        return {
          ...data,
          authenticationCode: response.authenticationCode,
        };
      });
      setSuccess(true);
    },
  });

  const handleSubmit = (organization) => {
    runUpdate(organization);
  };

  const handleRenew = (organizationId) => {
    if (!organizationId) return;
    run(organizationId);
  };

  const isError = error || renewError || updateError;

  useEffect(() => {
    if (open) {
      setSuccess(false);
    }
  }, [open, setSuccess]);

  return (
    <OrganizationDialog
      type="edit"
      data={data}
      open={open}
      onClose={onClose}
      onEdit={mutate}
      loading={loading || renewLoading || updateLoading}
      error={isError}
      errorMessage={isError}
      success={!isError && success}
      successMessage="更新成功"
      onSubmit={handleSubmit}
      handleRenew={handleRenew}
    />
  );
};

EditDialog.propTypes = {
  targetId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
  data: PropTypes.object,
};

export const CreateDialog = ({ open, onClose }) => {
  const [organization, setOrganization] = useState();
  const { data, loading, error, run } = useRequest(
    (organization) => repository.create(organization),
    {
      manual: true,
      throwOnError: true,
    }
  );

  const handleSubmit = () => {
    run(organization);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <OrganizationDialog
      type="create"
      data={null}
      open={open}
      onClose={onClose}
      loading={loading}
      error={error}
      errorMessage={error}
      success={data}
      successMessage="建立成功"
      onEdit={setOrganization}
      onSubmit={handleSubmit}
    />
  );
};

CreateDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
