import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Pagination } from '@material-ui/lab';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  colors,
} from '@material-ui/core';
import { CheckCircle, Edit } from '@material-ui/icons';
import { Box } from '../../components/elements';
import dayjs from 'dayjs';
import { map } from 'lodash';

const StyledPaper = styled(Paper)`
  /* display: flex; */
  align-items: center;
  justify-content: center;
  height: 90%;
`;

const StyledTableContainer = styled(TableContainer)`
  height: 90%;
  max-height: 100%;
`;

const columns = [
  { id: 'name', label: '名稱', minWidth: 150 },
  { id: 'contactPerson', label: '聯絡人', minWidth: 100 },
  { id: 'taxIdNumber', label: '統一編號', minWidth: 100 },
  {
    id: 'expiredAt',
    label: '使用期限',
    minWidth: 100,
    format(value) {
      return dayjs(value).format('YYYY-MM-DD');
    },
  },
  {
    id: 'isPublish',
    label: '啟用',
    minWidth: 80,
    format(value) {
      return value ? (
        <CheckCircle style={{ color: colors.green[500] }} />
      ) : (
        <CheckCircle color="disabled" />
      );
    },
  },
];

export const OrganizationTable = ({
  loading,
  data,
  count,
  onEdit,
  page,
  onPageChange,
}) => {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleEditClick = useCallback(
    (id) => () => {
      if (!id) return;
      onEdit(id);
    },
    [onEdit]
  );

  return (
    <StyledPaper>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <StyledTableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {map(columns, (column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map(data, (row) => (
                  <TableRow hover key={row.id}>
                    {map(columns, (column) => (
                      <TableCell key={column.id} align={column.align}>
                        {column?.format
                          ? column.format(row[column.id])
                          : row[column.id]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={handleEditClick(row?.id)}
                      >
                        <Edit size="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <Box width="100%" display="flex" justifyContent="end" py={3}>
            <Pagination
              count={Math.ceil(count / 25)}
              color="primary"
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </>
      )}
    </StyledPaper>
  );
};

OrganizationTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  count: PropTypes.number,
  onEdit: PropTypes.func,
  page: PropTypes.number,
  onPageChange: PropTypes.func,
};
