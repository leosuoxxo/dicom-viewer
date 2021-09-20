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

export const CreateDialog = ({ open, onClose }) => {
  const [success, setSuccess] = useState(false);
  const [organization, setOrganization] = useState();
  const { loading, error, run } = useRequest(
    (organization) => repository.create(organization),
    {
      manual: true,
      throwOnError: true,
      onSuccess: () => {
        setSuccess(true);
      },
    }
  );

  const handleSubmit = () => {
    run(organization);
  };

  useEffect(() => {
    setSuccess(false);
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
      success={success}
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
