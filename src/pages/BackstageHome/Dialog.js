import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  FormControlLabel,
  Switch,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Autorenew } from '@material-ui/icons';
import dayjs from 'dayjs';
import TabPanel from '../../components/TabPanel';
import DatePicker from '../../components/DatePicker';
import { Box } from '../../components/elements';
import { MachineIdsForm } from './MachineIdsForm';

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
  const [tabIndex, setTabIndex] = useState(0);
  const updateFormData = useCallback(
    (key) => (event) => {
      let value;
      switch (key) {
        case 'isPublish':
          value = event.target.checked;
          break;
        case 'expiredAt':
        case 'machineIds':
          value = event;
          break;
        default:
          if (!event?.target?.value) return;
          value = event?.target?.value;
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

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Dialog fullWidth={true} maxWidth="md" open={open} onClose={onClose}>
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
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="線上版" />
            <Tab label="離線版" />
          </Tabs>
          <Box width="100%">
            <TabPanel currentIndex={tabIndex} index={0}>
              <Box>
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
              </Box>
            </TabPanel>
            <TabPanel currentIndex={tabIndex} index={1}>
              <MachineIdsForm
                machineIds={data?.machineIds || {}}
                updateFormData={updateFormData('machineIds')}
              />
            </TabPanel>
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
