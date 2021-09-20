import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useRequest } from 'ahooks';
import { DialogContentText } from '@material-ui/core';
import { OrganizationDialog } from './Dialog';
import {
  RepositoryName,
  RepositoryFactory,
} from '../../repository/RepositoryFactory';

const repository = RepositoryFactory[RepositoryName.Organization];

export const StyledDialogContentText = styled(DialogContentText)`
  display: flex;
  flex-direction: column;
`;

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
    setSuccess(false);
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
