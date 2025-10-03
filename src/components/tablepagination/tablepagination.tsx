import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import theme from '../../styles/theme';

// interface TablePaginationProps {
//   page: number;
//   rowsPerPage: number;
//   totalCount: number;
//   onPageChange: (page: number) => void;
// }
interface TablePaginationProps {
  page: number;
  rowsPerPage: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void; // <--- add this
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 3,
        flexWrap: 'wrap',
      }}
    >
      {/* Showing Info */}
      <Typography sx={{ fontSize: '0.875rem', color: theme.palette.secondary.main, fontWeight: 'bold' }}>
        Showing {page * rowsPerPage + 1} to{' '}
        {Math.min((page + 1) * rowsPerPage, totalCount)} of {totalCount} entries
      </Typography>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* First Page */}
        <IconButton
          size="small"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>

        {/* Prev */}
        <IconButton
          size="small"
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={page === 0}
          sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
        >
          <KeyboardArrowLeft fontSize="small" />
        </IconButton>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            size="small"
            variant={page === index ? 'contained' : 'outlined'}
            onClick={() => onPageChange(index)}
            sx={{ minWidth: 36, height: 36, textTransform: 'none' }}
            color="secondary"
          >
            {index + 1}
          </Button>
        ))}

        {/* Next */}
        <IconButton
          size="small"
          onClick={() =>
            onPageChange(
              page + 1 < totalPages ? page + 1 : page
            )
          }
          disabled={page + 1 >= totalPages}
          sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
        >
          <KeyboardArrowRight fontSize="small" />
        </IconButton>

        {/* Last Page */}
        <IconButton
          size="small"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page + 1 >= totalPages}
          sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TablePagination;
