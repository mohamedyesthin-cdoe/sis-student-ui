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
import { useAlert } from '../../../context/AlertContext';
import UploadExcelDialog from '../../../components/alertcard/Excelcard';
import * as XLSX from "xlsx";
import { setValue } from '../../../utils/localStorageUtil';
import TableSkeleton from '../../../components/card/skeletonloader/Tableskeleton';
import { useLoader } from '../../../context/LoaderContext';
import { NoDataFoundUI } from '../../../components/card/errorUi/NoDataFoundUI';
import { useGlobalError } from '../../../context/ErrorContext';
import apiClient from '../../../services/ApiClient';

export default function StudentTable() {
  const [students, setStudents] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState('');
  const [programFilter, setProgramFilter] = React.useState('');
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [showSearch] = React.useState(true);
  const [openUploadDialog, setOpenUploadDialog] = React.useState(false);
  const { loading } = useLoader();
  const { clearError } = useGlobalError();
  const [programs, setPrograms] = React.useState<any[]>([]);

  const formatDOB = (dob?: string) => {
    if (!dob) return "-";
    const date = new Date(dob);
    if (isNaN(date.getTime())) return dob;

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };


  /* -------------------- Fetch Program List -------------------- */
  React.useEffect(() => {
    clearError();
    apiClient
      .get(ApiRoutes.GETPROGRAMLIST)
      .then((res) => setPrograms(res.data || []))
      .catch(() => setPrograms([]));
  }, []);

  /* -------------------- Convert Programs to Select Options -------------------- */
  const programOptions = React.useMemo(
    () =>
      programs.map((p) => ({
        label: p.programe,
        value: p.id,
      })),
    [programs]
  );
  // Fetch student list
  const fetchStudents = async () => {
    try {
      const data = await apiRequest({ url: ApiRoutes.GETSTUDENTSLIST, method: 'get' });
      setStudents(Array.isArray(data) ? data : data.data);
    } catch (error: any) {
      setStudents([]);
    }
  };

  React.useEffect(() => {
    fetchStudents();
  }, []);

  // Handle view details
  const handleView = (id: any) => {
    setValue('student_id', id);
    navigate('/students/detail');
  };

  /* -------------------- Filters -------------------- */
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.title} ${s.first_name} ${s.last_name}`.toLowerCase();
    const combinedText = `
      ${s.registration_no}
      ${fullName}
      ${s.email}
      ${s.mobile_number}
      ${s.gender}
      ${s.date_of_birth}
    `.toLowerCase();

    return (
      combinedText.includes(searchText.toLowerCase()) &&
      (programFilter === '' || s.program_id === programFilter)
    );
  });
  // Export to Excel
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
  //    const handleExportExcel = () => {
  //   // Flatten all fields including nested ones
  //   const formattedData = filteredStudents.map((s, index) => ({
  //     'S.No': index + 1,
  //     // 'Student ID': s.id,
  //     'Program ID': 'B.S.C (Hons) (Data Science)',
  //     'Registration No': s.registration_no,
  //     'Application No': s.application_no,
  //     'Title': s.title,
  //     'First Name': s.first_name,
  //     'Last Name': s.last_name,
  //     'Full Name': `${s.title} ${s.first_name} ${s.last_name}`,
  //     'Gender': s.gender,
  //     'Date of Birth': s.date_of_birth,
  //     'Blood Group': s.blood_group,
  //     'Email': s.email,
  //     'Mobile Number': s.mobile_number,
  //     'Alternative Phone': s.alternative_phone || "",
  //     'WhatsApp Number': s.whatsapp_number || "",
  //     'Marital Status': s.marital_status,
  //     'Religion': s.religion,
  //     'Nationality': 'INDIAN',
  //     'Category': s.category,
  //     'Caste': s.caste,
  //     'Aadhaar Number': s.aadhaar_number,
  //     'Parent/Guardian Name': s.parent_guardian_name,
  //     'Relationship With Student': s.relationship_with_student,
  //     'Locality': s.locality,
  //     'Created At': s.created_at,
  //     'Updated At': s.updated_at,

  //     // Address details
  //     'Corr Address Line 1': s.address_details?.corr_addr1 || "",
  //     'Corr Address Line 2': s.address_details?.corr_addr2 || "",
  //     'Corr City': s.address_details?.corr_city || "",
  //     'Corr State': s.address_details?.corr_state || "",
  //     'Corr District': s.address_details?.corr_district || "",
  //     'Corr Country': 'INDIA',
  //     'Corr Pin': s.address_details?.corr_pin || "",
  //     'Perm Address Line 1': s.address_details?.perm_addr1 || "",
  //     'Perm Address Line 2': s.address_details?.perm_addr2 || "",
  //     'Perm City': s.address_details?.perm_city || "",
  //     'Perm State': s.address_details?.perm_state || "",
  //     'Perm District': s.address_details?.perm_district || "",
  //     'Perm Country':  "INDIA",
  //     'Perm Pin': s.address_details?.perm_pin || "",

  //     // Academic details
  //     // 'SSC Board ID': s.academic_details?.ssc_board_id || "",
  //     'SSC School': s.academic_details?.ssc_school || "",
  //     'SSC Scheme': s.academic_details?.ssc_scheme || "",
  //     'SSC Score': s.academic_details?.ssc_score || "",
  //     'SSC Year': s.academic_details?.ssc_year || "",
  //     // 'HSC Board ID': s.academic_details?.hsc_board_id || "",
  //     'HSC School': s.academic_details?.hsc_school || "",
  //     'HSC Scheme': s.academic_details?.hsc_scheme || "",
  //     'HSC Score': s.academic_details?.hsc_score || "",
  //     'HSC Year': s.academic_details?.hsc_year || "",
  //     'Diploma Institute': s.academic_details?.diploma_institute || "",
  //     'Diploma Score': s.academic_details?.diploma_score || "",

  //     // Document details
  //     // 'Aadhar Doc': s.document_details?.aadhar || "",
  //     // 'Class 10th Marksheet': s.document_details?.class_10th_marksheet || "",
  //     // 'Class 12th Marksheet': s.document_details?.class_12th_marksheet || "",
  //     // 'Diploma Marksheet': s.document_details?.diploma_marksheet || "",
  //     // 'Signature': s.document_details?.signature || "",
  //     // 'Passport Doc': s.document_details?.passport || "",

  //     // Declaration
  //     // 'Declaration Agreed': s.declaration_details?.declaration_agreed ? "Yes" : "No",
  //     // 'Applicant Name (Declaration)': s.declaration_details?.applicant_name || "",
  //     // 'Parent Name (Declaration)': s.declaration_details?.parent_name || "",
  //     // 'Declaration Date': s.declaration_details?.declaration_date || "",
  //     // 'Declaration Place': s.declaration_details?.place || "",

  //     // DEB details
  //     'DEB ID': s.deb_details?.deb_id || "",
  //     'DEB Name': s.deb_details?.deb_name || "",
  //     'DEB Gender': s.deb_details?.deb_gender || "",
  //     'DEB DOB': s.deb_details?.deb_date_of_birth || "",
  //     'DEB ABC ID': s.deb_details?.deb_abcid || "",
  //     'DEB Status': s.deb_details?.deb_status || "",

  //     // Payment details (first payment if exists)
  //     // 'Payment Type': s.payments?.[0]?.payment_type || "",
  //     // 'Order ID': s.payments?.[0]?.order_id || "",
  //     // 'Transaction ID': s.payments?.[0]?.transaction_id || "",
  //     // 'Payment Date': s.payments?.[0]?.payment_date || "",
  //     // 'Payment Amount': s.payments?.[0]?.payment_amount || "",
  //     // 'Semester': s.payments?.[0]?.semester_fee?.semester || "",
  //     // 'Tuition Fee': s.payments?.[0]?.semester_fee?.tuition_fee || "",
  //     // 'Lab Fee': s.payments?.[0]?.semester_fee?.lab_fee || "",
  //     // 'LMS Fee': s.payments?.[0]?.semester_fee?.lms_fee || "",
  //     // 'Exam Fee': s.payments?.[0]?.semester_fee?.exam_fee || "",
  //     // 'Total Fee': s.payments?.[0]?.semester_fee?.total_fee || "",
  //   }));

  //   // Export to Excel
  //   const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  //   XLSX.writeFile(workbook, 'Students_Full_Details.xlsx');
  // };

  // const customhandleExportExcel = () => {
  //   exportToExcel(
  //     filteredStudents,
  //     [
  //       { header: 'group_id', key: 2 },
  //       { header: 'username', key: 'registration_no' },
  //       { header: 'first_name', key: 'first_name'},
  //       { header: 'last_name', key: 'last_name'},
  //       { header: 'email', key: '' },
  //       { header: 'phone', key: 'mobile_number' },
  //       { header: 'student_id', key: 'id' },
  //     ],
  //     'Students',
  //     'Students'
  //   );
  // };

  // Handle sync
  const handleSync = async () => {
    try {
      await apiRequest({ url: ApiRoutes.STUDENTSYNC, method: 'post' });
      await fetchStudents();
      setPage(0);
      showAlert("Sync completed successfully!", "success");
    } catch (error: any) {
      showAlert(error.response?.data?.message || "Sync failed. Try again.", "error");
    }
  };

  // Handle Excel Upload
  const handleExcelUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (!rows.length) throw new Error("Excel file is empty");

      const group_id = rows[0].group_id || 0;
      const users = rows.map(row => ({
        username: row.username,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone,
        student_id: row.student_id
      }));

      const payload = { group_id, users };
      await apiRequest({
        url: ApiRoutes.BULKADD,
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
    <>
      {
        loading ? (
          <TableSkeleton />
        )
          : (
            <CardComponent
              sx={{
                width: '100%',
                maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
                mx: 'auto',
                p: 3,
                mt: 3,
              }}
            >

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
                  {
                    key: "program",
                    label: "Select Course",
                    type: "select",
                    value: programFilter,
                    onChange: (val) => {
                      setProgramFilter(val);
                      setPage(0);
                    },
                    options: programOptions,

                    // ✅ 250px width
                    sx: {
                      width: 250,
                    },

                    // ✅ scrollable dropdown
                    menuProps: {
                      PaperProps: {
                        sx: {
                          maxHeight: 250,
                          overflowY: "auto",
                        },
                      },
                    },
                  }
                ]}
                actions={[
                  {
                    label: 'Bulk Upload',
                    color: 'secondary',
                    variant: 'outlined',
                    startIcon: <CloudUploadIcon />,
                    onClick: () => setOpenUploadDialog(true),
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
                ]}
              />
              {filteredStudents.length == 0 ? (
                <NoDataFoundUI />
              ) : (
                <ReusableTable
                  columns={[
                    { key: "registration_no", label: "Registration No" },
                    {
                      key: "full_name",
                      label: "Full Name",
                      render: (r) => `${r.title} ${r.first_name} ${r.last_name}`,
                    },
                    { key: "email", label: "Email" },
                    { key: "mobile_number", label: "Mobile" },
                    { key: "gender", label: "Gender" },
                    {
                      key: "date_of_birth",
                      label: "DOB",
                      render: (r) => formatDOB(r.date_of_birth),
                    },
                  ]}

                  data={filteredStudents}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  actions={[
                    {
                      label: "View",
                      icon: <VisibilityIcon fontSize="small" />,
                      onClick: (row) => handleView(row.id),
                      color: 'secondary',
                    },
                  ]}
                />
              )}
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
          )
      }
    </>
  )

}
