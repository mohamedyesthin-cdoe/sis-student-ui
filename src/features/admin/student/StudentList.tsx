import * as React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import CardComponent from '../../../components/card/Card';
import ReusableTable from '../../../components/table/table';
import SyncIcon from '@mui/icons-material/Sync';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import TablePagination from '../../../components/tablepagination/tablepagination';
import { exportToExcel } from '../../../constants/excelExport';
import { CloudUploadIcon } from 'lucide-react';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { useAlert } from '../../../context/AlertContext';
import UploadExcelDialog from '../../../components/alertcard/Excelcard';
import * as XLSX from "xlsx";

export default function StudentTable() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [genderFilter, setGenderFilter] = React.useState('');
  const navigate = useNavigate();
  const { showAlert } = useAlert();


  // Add this helper function
  const fetchStudents = async () => {
    try {
      const data = await apiRequest({ url: ApiRoutes.GETSTUDENTSLIST, method: 'get' });
      setStudents(Array.isArray(data) ? data : data.data);
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Failed to fetch students.",
        "error"
      );
      setStudents([]);
    }
  };


  // Replace your useEffect with fetchStudents call
  React.useEffect(() => {
    fetchStudents();
  }, []);

  const handleView = (id: any) => navigate(`/students/detail/${id}`);

  const filteredStudents = students.filter((s) => {
    const fullName = `${s.title} ${s.first_name} ${s.last_name}`.toLowerCase();
    const combinedText = `${s.registration_no} ${fullName} ${s.email} ${s.mobile_number} ${s.gender} ${s.date_of_birth}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase()) && (genderFilter === '' || s.gender === genderFilter);
  });

  // EXPORT TO EXCEL FUNCTION
  const handleExportExcel = () => {
    exportToExcel(
      filteredStudents,
      [
        { header: 'S.No', key: 'sno' },
        { header: 'Student ID', key: 'id' },
        { header: 'Registration No', key: 'registration_no' },
        { header: 'Full Name', key: 'full_name', render: (s) => `${s.title} ${s.first_name} ${s.last_name}` },
        { header: 'Email', key: 'email' },
        { header: 'Mobile', key: 'mobile_number' },
        { header: 'Gender', key: 'gender' },
        { header: 'DOB', key: 'date_of_birth' },
      ],
      'Students',
      'Students'
    );
  };

  // Update handleSync
  const handleSync = async () => {
    try {
      await apiRequest({ url: ApiRoutes.STUDENTSYNC, method: 'post' });
      // After successful sync, fetch updated student list
      await fetchStudents();
      setPage(0);
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Something went wrong. Please try again.",
        "error"
      );
    }
  };

  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);

  const handleOpenUploadDialog = () => setOpenUploadDialog(true);
  const handleExcelUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to JSON
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (!rows.length) throw new Error("Excel file is empty");

      // Extract group_id (take from first row or default 0)
      const group_id = rows[0].group_id || 0;

      // Map each row to user object
      const users = rows.map(row => ({
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone,
        student_id: row.student_id
      }));


      // Build final payload
      const payload = { group_id, users };
      console.log("Payload to send:", payload);

      // Call API
      await apiRequest({
        url: ApiRoutes.BULKADD, // your endpoint
        method: "post",
        data: payload,
      });

      showAlert("Excel uploaded successfully!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed to upload Excel. Please check the file and try again.", "error");
    }
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

      <TableToolbar
        searchText={searchText}
        onSearchChange={(val) => {
          setSearchText(val);
          setPage(0);
        }}
        searchPlaceholder="Search all fields"
        filters={[
          {
            key: 'gender',
            label: 'Gender',
            value: genderFilter,
            onChange: (val) => {
              setGenderFilter(val);
              setPage(0);
            },
            options: [
              { value: '', label: 'All Genders' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]
          },
          // {
          //   key: 'pushed',
          //   label: 'Pushed Status',
          //   value: pushedFilter,
          //   onChange: (val) => {
          //     setPushedFilter(val);
          //     setPage(0);
          //   },
          //   options: [
          //     { value: '', label: 'All' },
          //     { value: 'Pushed', label: 'Pushed' },
          //     { value: 'NotPushed', label: 'Not Pushed' },
          //   ],
          // },

        ]}
        actions={
          [
            {
              label: 'Bulk Upload',
              color: 'secondary',
              variant: 'outlined',
              startIcon: <CloudUploadIcon />,
              onClick: handleOpenUploadDialog
            },
            {
              label: 'Sync',
              color: 'primary',
              variant: 'outlined',
              startIcon: <SyncIcon />,
              onClick: handleSync,
            },
            {
              label: 'Push to Deb',
              color: 'success',
              variant: 'outlined',
              startIcon: <CloudUploadIcon />,
              onClick: async () => {
                try {
                  const data = await apiRequest({ url: ApiRoutes.PUSHTODEBL, method: 'post' });
                  console.log(data);
                } catch (error: any) {
                  showAlert(error?.detail || "Sync failed.", "error");
                }
              },
            },
            {
              label: 'Export Excel',
              color: 'secondary',
              startIcon: <FileDownloadIcon />,
              onClick: handleExportExcel,
            },
          ]
        }
      />

      {/* Table */}
      {filteredStudents.length === 0 ? (
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
            { key: 'id', label: 'Student ID' },
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
            { label: "View", icon: <VisibilityIcon fontSize="small" />, onClick: (row) => handleView(row.id), color: 'secondary' },
          ]}
        />
      )}

      {/* Pagination */}

      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredStudents.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
      />

      <UploadExcelDialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        onUpload={handleExcelUpload}
      />

    </CardComponent>
  );
}
