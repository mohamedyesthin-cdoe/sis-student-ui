

import * as React from 'react';
import { Typography, Box } from '@mui/material';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CardComponent from '../../../components/card/Card';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../../components/tablepagination/tablepagination';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';

export default function Onlinegrievances() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const navigate = useNavigate();
  const handleView = () => navigate(`/grievances/add`);


  // Placeholder export function
  const handleExportExcel = () => {
    console.log("Export clicked - no data");
  };

  return (
    <CardComponent
      sx={{
        width: '100%',
        maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
        mx: 'auto',
        p: 3,
        mt: 3,
      }}
    >
      {/* Filters & Export */}
      <TableToolbar
        searchText={searchText}
        onSearchChange={(val) => setSearchText(val)}
        searchPlaceholder="Search Grievances"
        actions={[
          {
            label: 'Export Excel',
            color: 'secondary',
            startIcon: <FileDownloadIcon />,
            onClick: handleExportExcel,
          },
          {
            label: 'Add Grievance',
            color: 'primary',
            onClick: handleView,
          },
        ]}
      />

      {/* No Data Found */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          color: "text.secondary",
        }}
      >
        <SearchOffIcon sx={{ fontSize: 50, mb: 1, color: "grey.500" }} />
        <Typography variant="h6">No records found</Typography>
        <Typography variant="body2" color="text.secondary">
          Please check your search or filters.
        </Typography>
      </Box>

      {/* Pagination */}
      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={0}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </CardComponent>
  );
}






