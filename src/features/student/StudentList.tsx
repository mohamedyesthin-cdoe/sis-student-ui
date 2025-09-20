import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/ApiRequest';
import { ApiRoutes } from '../../constants/ApiConstants';
import CardComponent from '../../components/card/Card';
import * as XLSX from 'xlsx'; // <-- Excel library
import theme from '../../styles/theme';
import { sampleStudents } from './sampleData';
import ReusableTable from '../../components/table/table';

export default function ModernStudentTable() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState('');
  const navigate = useNavigate();

  // React.useEffect(() => {
  //   apiRequest({ url: ApiRoutes.GETSTUDENTSLIST, method: 'get' })
  //     .then((data) => setStudents(Array.isArray(data) ? data : data.data))
  //     .catch(() => setStudents([]));
  // }, []);

  React.useEffect(() => {
    // Instead of calling API, use local sample data
    setStudents(sampleStudents);
  }, []);

  const handleView = (id: any) => navigate(`/students/detail/${id}`);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.title} ${s.first_name} ${s.last_name}`.toLowerCase();
    const combinedText = `${s.registration_no} ${fullName} ${s.email} ${s.mobile_number} ${s.gender} ${s.date_of_birth}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase()) && (genderFilter === '' || s.gender === genderFilter);
  });

  // -----------------------------
  // EXPORT TO EXCEL FUNCTION
  // -----------------------------
  const handleExportExcel = () => {
    if (!filteredStudents.length) return;

    // Map data for Excel
    const dataForExcel = filteredStudents.map((s, index) => ({
      'S.No': index + 1,
      'Registration No': s.registration_no,
      'Full Name': `${s.title} ${s.first_name} ${s.last_name}`,
      Email: s.email,
      Mobile: s.mobile_number,
      Gender: s.gender,
      DOB: s.date_of_birth,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Export file
    XLSX.writeFile(workbook, 'Students.xlsx');
  };

  return (
    <CardComponent sx={{
      width: '100%',
      maxWidth: { xs: '350px', sm: '900px', md: '1200px' },
      mx: 'auto',
      p: 3,
      mt: 3,
    }}>
      {/* Filters & Export */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search all fields"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />

        <FormControl
          size="small"
          sx={{ minWidth: 150, width: { xs: '100%', sm: 150 } }}
        >
          <Select
            value={genderFilter}
            displayEmpty
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">All Genders</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
          onClick={handleExportExcel} // <-- new handler
        >
          Export Excel
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <ReusableTable
          columns={[
            { key: "registration_no", label: "Registration No" },
            { key: "full_name", label: "Full Name", render: (r) => `${r.title} ${r.first_name} ${r.last_name}` },
            { key: "email", label: "Email" },
            { key: "mobile_number", label: "Mobile" },
            { key: "gender", label: "Gender" },
            { key: "date_of_birth", label: "DOB" },
          ]}
          data={filteredStudents}
          page={page}
          rowsPerPage={rowsPerPage}
          actions={[
            { label: "View", icon: <VisibilityIcon fontSize="small" />, onClick: (row) => handleView(row.id) },
          ]}
        />

      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" onClick={() => setPage(0)} disabled={page === 0} sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}>
            <FirstPageIcon fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0} sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}>
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          {Array.from({ length: Math.ceil(filteredStudents.length / rowsPerPage) }, (_, index) => (
            <Button key={index} size="small" variant={page === index ? 'contained' : 'outlined'} onClick={() => setPage(index)} sx={{ minWidth: 36, height: 36, textTransform: 'none' }} color="secondary">
              {index + 1}
            </Button>
          ))}

          <IconButton size="small" onClick={() => setPage(prev => prev + 1 < Math.ceil(filteredStudents.length / rowsPerPage) ? prev + 1 : prev)} disabled={(page + 1) * rowsPerPage >= filteredStudents.length} sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}>
            <KeyboardArrowRight fontSize="small" />
          </IconButton>

          <IconButton size="small" onClick={() => setPage(Math.max(0, Math.ceil(filteredStudents.length / rowsPerPage) - 1))} disabled={(page + 1) * rowsPerPage >= filteredStudents.length} sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}>
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </CardComponent>
  );
}
