import React, { useCallback, useState } from 'react';
import { useRequest, useUpdateEffect } from 'ahooks';
import { Button, TextField, Select, MenuItem } from '@material-ui/core';
import { Box } from '../../components/elements';
import BackstageLayout from '../../layouts/BackstageLayout';
import OrganizationTable from '../../containers/OrganizationTable';
import {
  RepositoryName,
  RepositoryFactory,
} from '../../repository/RepositoryFactory';
import { EditDialog, CreateDialog } from './EditDialog';

const repository = RepositoryFactory[RepositoryName.Organization];

const useDialog = () => {
  const [isOpen, setOpen] = useState(false);

  const open = useCallback(() => {
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
  };
};

const useEdit = () => {
  const { isOpen, open, close } = useDialog();
  const [targetId, setTarget] = useState('');

  const handleEdit = useCallback(
    (targetId) => {
      open();
      setTarget(targetId);
    },
    [open, setTarget]
  );

  return {
    isOpen,
    open,
    close,
    targetId,
    handleEdit,
  };
};

export function BackstageHomePage() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');

  const { data, loading, refresh } = useRequest(
    () => repository.get({ page, name }),
    {
      refreshDeps: [page, name],
      tthrottleInterval: 300,
    }
  );

  const {
    isOpen: isEditOpen,
    handleEdit,
    close: editClose,
    targetId,
  } = useEdit();

  const {
    isOpen: isCreateOpen,
    close: createClose,
    open: handleCreate,
  } = useDialog();

  const [searchField, setSearchField] = useState();
  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  useUpdateEffect(() => {
    if (!isCreateOpen || !isCreateOpen) {
      refresh();
    }
  }, [isEditOpen, isCreateOpen]);

  return (
    <BackstageLayout>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Select
            defaultValue="name"
            value={searchField}
            onChange={handleChange}
          >
            <MenuItem value="name">公司名稱</MenuItem>
          </Select>
          <TextField onChange={(e) => setName(e.target.value)} />
        </Box>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          新增組織
        </Button>
      </Box>
      <OrganizationTable
        loading={loading}
        data={data?.organizations}
        count={data?.total}
        onCreate={handleCreate}
        onEdit={handleEdit}
        page={page}
        onPageChange={setPage}
      />
      <EditDialog open={isEditOpen} targetId={targetId} onClose={editClose} />
      <CreateDialog open={isCreateOpen} onClose={createClose} />
    </BackstageLayout>
  );
}
