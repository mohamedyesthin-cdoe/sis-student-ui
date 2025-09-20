import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import theme from '../../styles/theme';
import CardComponent from '../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import { ProgramData } from './ProgramData';
import ReusableTable from '../../components/table/table';
import TableToolbar from '../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../components/tablepagination/tablepagination';
import { exportToExcel } from '../../constants/excelExport';

export default function ProgramList() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const filteredCourses = ProgramData.courses.filter((c) =>
    `${c.course_id} ${c.course_name} ${c.duration}`.toLowerCase().includes(searchText.toLowerCase())
  );

  // Excel export
  const handleExportExcel = () => {
    exportToExcel(
      filteredCourses,
      [
        { header: 'S.No', key: 'sno' },
        { header: 'Course ID', key: 'course_id' },
        { header: 'Course Name', key: 'course_name' },
        { header: 'Duration', key: 'duration' },
      ],
      'Courses',
      'Courses'
    );
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
      <TableToolbar
        searchText={searchText}
        onSearchChange={(val) => {
          setSearchText(val);
          setPage(0);
        }}
        searchPlaceholder="Search courses"
        actions={[
          {
            label: 'Export Excel',
            color: 'secondary',
            startIcon: <FileDownloadIcon />,
            onClick: handleExportExcel,
          },
          {
            label: 'Add',
            color: 'primary',
            onClick: handleView,
          },
        ]}
      />


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
            }, color: "primary",
          },
          { label: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => { }, color: "error", },
        ]}
      />

      {/* Pagination */}
      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredCourses.length}
        onPageChange={(newPage) => setPage(newPage)}
      />

    </CardComponent >
  );
}