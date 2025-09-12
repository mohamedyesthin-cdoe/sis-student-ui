import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils/ApiRequest';
import { ApiRoutes } from '../../constants/ApiConstants';

// Pagination Actions with Icons
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) =>
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

// Fetch students from API
const fetchStudents = async () => {
  const data = await apiRequest({
    url: ApiRoutes.GETSTUDENTSLIST,
    method: 'get',
  });

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;

  return [];
};

export default function StudentListWithGlobalSearch() {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchStudents()
      .then((data) => setStudents(data))
      .catch((err) => {
        console.error('Error fetching students:', err);
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

 const handleView = (studentId) => navigate(`/studentsdetail/${studentId}`);


  const filteredStudents = students.filter((student) => {
    const fullName = `${student.title} ${student.first_name} ${student.last_name}`.toLowerCase();
    const combinedText = `${student.registration_no} ${fullName} ${student.email} ${student.mobile_number} ${student.gender} ${student.date_of_birth}`.toLowerCase();

    return (
      combinedText.includes(searchText.toLowerCase()) &&
      (genderFilter === '' || student.gender === genderFilter)
    );
  });

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredStudents.length);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 5 }} />;
  }

  return (
    <Paper sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          padding: '16px',
          backgroundColor: '#ffff',
          borderBottom: '1px solid #ddd',
          fontSize: '1.25rem',
          fontWeight: '500',
          color: '#555',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',  // Subtle shadow
          border: '1px solid rgba(224,224,224,1)',
        }}
      >
        Student List
      </Box>

      <Box sx={{ display: 'flex', gap: 2, padding: '16px' }}>
        <TextField
          size="small"
          placeholder="Search all fields"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(0);
          }}
          sx={{ width: '300px' }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
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
      </Box>

      <TableContainer
        className="table-scroll-container"
        sx={{
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        <Table stickyHeader aria-label="student table">
          <TableHead>
            <TableRow>
              {['Registration No', 'Full Name', 'Email', 'Mobile', 'Gender', 'DOB', 'Action'].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: '600',
                      fontSize: '0.95rem',
                      backgroundColor: '#f5f5f5',
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
              .map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.registration_no}</TableCell>
                  <TableCell>{`${student.title} ${student.first_name} ${student.last_name}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobile_number}</TableCell>
                  <TableCell>{student.gender == '12842' ? 'Male' : 'Female'}</TableCell>
                  <TableCell>{student.date_of_birth}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleView(student.id)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderTop: '1px solid rgba(224, 224, 224, 1)',
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
          padding: '16px',
        }}
      >
        <Box>
          Rows per page:&nbsp;
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            style={{ padding: '4px 8px' }}
          >
            {[5, 10, 25].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Box>

        <TablePaginationActions
          count={filteredStudents.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
        />
      </Box>
    </Paper>
  );
}
