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
  Button,
  Typography,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import theme from '../../styles/theme';
import CardComponent from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import { ProgramData } from './ProgramData';
import * as XLSX from 'xlsx';
import ReusableTable from '../../components/table/table';

// Pagination Actions
function TablePaginationActions({ count, page, rowsPerPage, onPageChange }: any) {
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

export default function ProgramList() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [expandedRow, setExpandedRow] = React.useState<number | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChangePage = (event: any, newPage: any) => setPage(newPage);

  const filteredCourses = ProgramData.courses.filter((c) =>
    `${c.course_id} ${c.course_name} ${c.duration}`.toLowerCase().includes(searchText.toLowerCase())
  );

  // Excel export
  const handleExportExcel = () => {
    const dataToExport = filteredCourses.map((course) => ({
      'Course ID': course.course_id,
      'Course Name': course.course_name,
      Duration: course.duration,
      ...Object.entries(course.fees).reduce((acc, [semester, fee]) => {
        acc[`${semester} - Application Fee`] = fee.application_fee;
        acc[`${semester} - Admission Fee`] = fee.admission_fee;
        acc[`${semester} - Tuition Fee`] = fee.tuition_fee;
        acc[`${semester} - Exam Fee`] = fee.exam_fee;
        acc[`${semester} - LMS Fee`] = fee.lms_fee;
        acc[`${semester} - Lab Fee`] = fee.lab_fee;
        acc[`${semester} - Total Fee`] = fee.total_fee;
        return acc;
      }, {} as Record<string, any>),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Programs');
    XLSX.writeFile(workbook, 'ProgramList.xlsx');
  };

  return (
    <CardComponent
      sx={{
        width: '100%',
        maxWidth: { xs: '350px', sm: '900px', md: '1200px' },
        mx: 'auto',
        p: 3,
        mt: 3,
      }}
    >
      {/* Filters & Export */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search courses"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ width: { xs: '100%', sm: 280 } }}
        />

        <Button
          variant="contained"
          color="secondary"
          size="small"
          startIcon={<FileDownloadIcon />}
          sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
          onClick={handleExportExcel}
        >
          Export Excel
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ width: { xs: '100%', sm: 'auto' } }}
          onClick={handleView}
        >
          Add
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <ReusableTable
          columns={[
            { key: "course_id", label: "Course ID" },
            { key: "course_name", label: "Course Name" },
            { key: "duration", label: "Duration" },
          ]}
          data={filteredCourses}
          page={page}
          rowsPerPage={rowsPerPage}
          renderExpanded={(course) => (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Semester",
                    "Application Fee",
                    "Admission Fee",
                    "Tuition Fee",
                    "Exam Fee",
                    "LMS Fee",
                    "Lab Fee",
                    "Total Fee",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.secondary.main,
                      }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              
              <TableBody>
                {Object.entries(course.fees).map(([semester, fee]: any) => (
                  <TableRow key={semester}>
                    <TableCell>{semester}</TableCell>
                    <TableCell>{fee.application_fee || "-"}</TableCell>
                    <TableCell>{fee.admission_fee || "-"}</TableCell>
                    <TableCell>{fee.tuition_fee || "-"}</TableCell>
                    <TableCell>{fee.exam_fee || "-"}</TableCell>
                    <TableCell>{fee.lms_fee || "-"}</TableCell>
                    <TableCell>{fee.lab_fee || "-"}</TableCell>
                    <TableCell>{fee.total_fee || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          actions={[
            {
              label: "Edit", icon: <EditIcon fontSize="small" />, onClick: (row) => {
                navigate(`/programs/add/${row.course_id}`);
                setAnchorEl(null);
              }
            },
            { label: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => { } },
          ]}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap' }}>
        <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredCourses.length)} of {filteredCourses.length} entries
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
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <KeyboardArrowLeft fontSize="small" />
          </IconButton>

          {Array.from({ length: Math.ceil(filteredCourses.length / rowsPerPage) }, (_, index) => (
            <Button
              key={index}
              size="small"
              variant={page === index ? 'contained' : 'outlined'}
              onClick={() => setPage(index)}
              sx={{ minWidth: 36, height: 36, textTransform: 'none' }}
              color="secondary"
            >
              {index + 1}
            </Button>
          ))}

          <IconButton
            size="small"
            onClick={() => setPage(prev => prev + 1 < Math.ceil(filteredCourses.length / rowsPerPage) ? prev + 1 : prev)}
            disabled={(page + 1) * rowsPerPage >= filteredCourses.length}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <KeyboardArrowRight fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => setPage(Math.max(0, Math.ceil(filteredCourses.length / rowsPerPage) - 1))}
            disabled={(page + 1) * rowsPerPage >= filteredCourses.length}
            sx={{ borderRadius: '50%', border: '1px solid', minWidth: 0 }}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

    </CardComponent >
  );
}