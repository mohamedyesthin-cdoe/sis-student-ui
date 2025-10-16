import * as React from 'react';
import {
  Typography,
  Box
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CardComponent from '../../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../../components/table/table';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../../components/tablepagination/tablepagination';
import { exportToExcel } from '../../../constants/excelExport';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import SearchOffIcon from "@mui/icons-material/SearchOff";


export default function Onlinegrievances() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/grievances/add`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


  const [programs, setPrograms] = React.useState<any[]>([]);

  // Fetch programs from API on component mount
  React.useEffect(() => {
    apiRequest({ url: ApiRoutes.GETPROGRAMLIST, method: 'get' })
      .then((data) => setPrograms(Array.isArray(data) ? data : data.data))
      .catch(() => setPrograms([]));
  }, []);

  // Filtered programs based on search text
  const filteredPrograms = programs.filter((c) => {
    const combinedText = `${c.programe_code} ${c.programe} ${c.duration}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase());
  });



  // Excel export
  const handleExportExcel = () => {
    exportToExcel(
      filteredPrograms,
      [
        { header: 'S.No', key: 'sno' },
        { header: 'Program ID', key: 'programe_code' },
        { header: 'Program Name', key: 'programe' },
        { header: 'Duration', key: 'duration' },
      ],
      'Programs',
      'Programs'
    );
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
        onSearchChange={(val) => {
          setSearchText(val);
          setPage(0);
        }}
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

      {filteredPrograms.length === 0 ? (
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
      ) : (
        <ReusableTable
          columns={[
            { key: "programe_code", label: "Grievance Number" },
            { key: "programe", label: "Subject" },
            { key: "duration", label: "Grievance Details" },
            { key: "duration", label: "Date" },
            { key: "duration", label: "File" },
            { key: "duration", label: "Reply" },
            { key: "duration", label: "Status" },
          ]}
          data={filteredPrograms}
          page={page}
          rowsPerPage={rowsPerPage}
          actions={[
           
          ]}
        />
      )}

      {/* Pagination */}
      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredPrograms.length}
        onPageChange={(newPage) => setPage(newPage)}
      />

    </CardComponent >
  );
}