import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  Paper,
  Card,
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
import theme from '../../styles/theme';
import CardComponent from '../../components/card/Card';

// Pagination Actions
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <IconButton onClick={(e) => onPageChange(e, 0)} disabled={page === 0}>
        <FirstPageIcon fontSize="small" />
      </IconButton>
      <IconButton onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft fontSize="small" />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight fontSize="small" />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default function ModernStudentTable() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    apiRequest({ url: ApiRoutes.GETSTUDENTSLIST, method: 'get' })
      .then((data) => setStudents(Array.isArray(data) ? data : data.data))
      .catch(() => setStudents([]));
  }, []);

  const handleChangePage = (event: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleView = (id: any) => navigate(`/students/detail/${id}`);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.title} ${s.first_name} ${s.last_name}`.toLowerCase();
    const combinedText = `${s.registration_no} ${fullName} ${s.email} ${s.mobile_number} ${s.gender} ${s.date_of_birth}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase()) && (genderFilter === '' || s.gender === genderFilter);
  });

  return (
    <Card sx={{
      width: '100%',
      maxWidth: { xs: '350px', sm: '900px', md: '1200px' }, // Responsive max-width
      mx: 'auto', p: 2,mt:3
    }}>
      {/* Filters & Export */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        {/* Your filters and export button */}
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
          onClick={() => console.log('Export Excel')}
        >
          Export Excel
        </Button>
      </Box>

      {/* Table Container with fixed width */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 900 }} stickyHeader aria-label="student table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  backgroundColor: theme.palette.background.default,
                  py: 1,
                  px: 1,
                  whiteSpace: 'nowrap',
                }}
              >
                S.No
              </TableCell>

              {['Registration No', 'Full Name', 'Email', 'Mobile', 'Gender', 'DOB', 'Action'].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      backgroundColor: theme.palette.background.default,
                      py: 1,
                      px: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>


          <TableBody>
            {filteredStudents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell sx={{ py: 0.5, px: 1, whiteSpace: 'nowrap' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ py: 0.5, px: 1, whiteSpace: 'nowrap' }}>
                    {student.registration_no}
                  </TableCell>
                  <TableCell sx={{ py: 0.5, px: 1 }}>
                    {`${student.title} ${student.first_name} ${student.last_name}`}
                  </TableCell>
                  <TableCell sx={{ py: 0.5, px: 1, whiteSpace: 'nowrap' }}>
                    {student.email}
                  </TableCell>
                  <TableCell sx={{ py: 0.5, px: 1 }}>{student.mobile_number}</TableCell>
                  <TableCell sx={{ py: 0.5, px: 1 }}>
                    {student.gender === '12842' ? 'Male' : 'Female'}
                  </TableCell>
                  <TableCell sx={{ py: 0.5, px: 1 }}>{student.date_of_birth}</TableCell>
                  <TableCell align="center" sx={{ py: 0.5, px: 1 }}>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleView(student.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </Box>

      {/* Pagination (Fixed below) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Showing {page * rowsPerPage + 1} to{' '}
          {Math.min((page + 1) * rowsPerPage, filteredStudents.length)} of{' '}
          {filteredStudents.length} entries
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => setPage(0)}
            disabled={page === 0}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          {Array.from(
            { length: Math.ceil(filteredStudents.length / rowsPerPage) },
            (_, index) => (
              <Button
                key={index}
                size="small"
                variant={page === index ? 'contained' : 'outlined'}
                onClick={() => setPage(index)}
                sx={{ minWidth: 36, height: 36, textTransform: 'none' }}
                color='secondary'
              >
                {index + 1}
              </Button>
            )
          )}

          <IconButton
            size="small"
            onClick={() =>
              setPage((prev) =>
                prev + 1 < Math.ceil(filteredStudents.length / rowsPerPage)
                  ? prev + 1
                  : prev
              )
            }
            disabled={(page + 1) * rowsPerPage >= filteredStudents.length}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() =>
              setPage(Math.max(0, Math.ceil(filteredStudents.length / rowsPerPage) - 1))
            }
            disabled={(page + 1) * rowsPerPage >= filteredStudents.length}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>



  );
}


