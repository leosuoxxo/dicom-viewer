import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
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
  const [target, setTarget] = useState({});

  const handleEdit = useCallback(
    (target) => {
      open();
      setTarget(target);
    },
    [open]
  );

  return {
    isOpen,
    open,
    close,
    target,
    handleEdit,
  };
};

export function BackstageHomePage() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const { data, isLoading } = useQuery(['organizations', page, name], () =>
    repository.get({ page, name })
  );

  const {
    isOpen: isEditOpen,
    handleEdit,
    close: editClose,
    target,
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
        loading={isLoading}
        data={data?.organizations}
        count={data?.total}
        onCreate={handleCreate}
        onEdit={handleEdit}
        page={page}
        onPageChange={setPage}
      />
      <EditDialog open={isEditOpen} data={target} onClose={editClose} />
      <CreateDialog open={isCreateOpen} onClose={createClose} />
    </BackstageLayout>
  );
}
