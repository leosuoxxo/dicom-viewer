import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  CircularProgress,
  colors,
} from '@material-ui/core';
import { CheckCircle, Edit } from '@material-ui/icons';
import dayjs from 'dayjs';
import { map } from 'lodash';

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
`;

const StyledTableContainer = styled(TableContainer)`
  min-height: 600px;
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

  const handleEditClick = useCallback((value) => () => onEdit(value), [onEdit]);

  return (
    <StyledPaper>
      {loading ? (
        <CircularProgress />
      ) : (
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
                      onClick={handleEditClick(row)}
                    >
                      <Edit size="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            rowsPerPageOptions={[25]}
            rowsPerPage={25}
            count={count}
            page={page}
            onPageChange={handleChangePage}
            labelDisplayedRows={({ count, page }) =>
              `第${page}頁，共${count}筆`
            }
          />
        </StyledTableContainer>
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
