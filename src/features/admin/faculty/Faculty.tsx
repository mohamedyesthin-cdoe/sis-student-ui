import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import theme from '../../../styles/theme';
import CardComponent from '../../../components/card/Card';
import { useNavigate } from 'react-router-dom';
import ReusableTable from '../../../components/table/table';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../../components/tablepagination/tablepagination';
import { exportToExcel } from '../../../constants/excelExport';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import Customtext from '../../../components/customtext/Customtext';


export default function Faculty() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showSearch] = React.useState(true);



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
        filters={[
          {
            key: "search",
            label: "Search",
            type: "text",
            value: searchText,
            onChange: (val) => setSearchText(val),
            placeholder: "Search all fields",
            visible: showSearch,
          },
          // {
          // key: "gender",
          // label: "All Genders",
          // type: "select",
          // value: genderFilter,
          // onChange: (val) => {
          //   setGenderFilter(val);
          //   setPage(0);
          // },
          // options: [
          //   { value: 'Male', label: 'Male' },
          //   { value: 'Female', label: 'Female' },
          //   { value: 'Other', label: 'Other' },
          // ],
          // },
        ]}
        actions={[
          {
            label: 'Export Excel',
            color: 'secondary',
            startIcon: <FileDownloadIcon />,
            onClick: handleExportExcel,
          },
          {
            label: 'Add User',
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
          <Customtext variantName='h6' fieldName={'No records found'} />
          <Customtext variantName='body2' fieldName={'Please check your search or filters.'}
          sx={{color:theme.palette.secondary.main}} />

        </Box>
      ) : (
        <ReusableTable
          columns={[
            { key: "programe_code", label: "Employee ID" },
            { key: "programe", label: "Full Name" },
            { key: "duration", label: "Email" },
            { key: "duration", label: "Mobile" },
            { key: "duration", label: "Roll" },
          ]}
          data={filteredPrograms}
          page={page}
          rowsPerPage={rowsPerPage}
          renderExpanded={(program) => (
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
                    // <TableCell
                    //   key={h}
                    //   sx={{
                    //     fontWeight: 600,
                    //     color: theme.palette.secondary.main,
                    //   }}
                    // >
                    //   {h}
                    // </TableCell>
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.isArray(program.fee) &&
                  program.fee.map((fee: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.semester || `Semester ${idx + 1}`}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.application_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.admission_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.tuition_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.exam_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.lms_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1 }}>{fee.lab_fee || "-"}</TableCell>
                      <TableCell
                        align="left"
                        sx={{ py: 0.5, px: 1, fontWeight: 'bold' }}>{fee.total_fee || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}

          actions={[
            {
              label: "Edit", icon: <EditIcon fontSize="small" />, onClick: (row) => {
                navigate(`/programs/add/${row.id}`);
              }, color: "primary",
            },
            { label: "Delete", icon: <DeleteIcon fontSize="small" />, onClick: () => { }, color: "error", },
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