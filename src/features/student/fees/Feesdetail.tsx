import * as React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from "@mui/icons-material/SearchOff";
import * as XLSX from "xlsx";
import CardComponent from '../../../components/card/Card';
import { useAlert } from '../../../context/AlertContext';
import { apiRequest } from '../../../utils/ApiRequest';
import { ApiRoutes } from '../../../constants/ApiConstants';
import TableToolbar from '../../../components/tabletoolbar/tableToolbar';
import ReusableTable from '../../../components/table/table';
import TablePagination from '../../../components/tablepagination/tablepagination';
import UploadExcelDialog from '../../../components/alertcard/Excelcard';
import { exportToExcel } from '../../../constants/excelExport';

export default function FeesDetail() {
    const [students, setStudents] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [searchText, setSearchText] = React.useState('');
    const [genderFilter] = React.useState('');
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { id } = useParams();


    React.useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await apiRequest({
                    url: `${ApiRoutes.GETSTUDENTFEES}/${id}`,
                    method: 'get',
                });

                if (response) {
                    setStudents(response);
                } else {
                }
            } catch (error) {
                console.error("Failed to fetch student:", error);
                navigate('/students/list');
            }
        };

        if (id) fetchStudent();
    }, [id, navigate]);



    const handleView = () => navigate(`/fees/receipt`);

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
                { header: "Payment Date", key: "payment_date" },
                { header: "Payment Amount", key: "payment_amount" },
                { header: "Payment Type", key: "payment_type" }
            ],
            'Students',
            'Students'
        );
    };


    const [openUploadDialog, setOpenUploadDialog] = React.useState(false);

    // const handleOpenUploadDialog = () => setOpenUploadDialog(true);
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
            maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
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
                actions={
                    [
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
                        { key: "payment_date", label: "Payment Date" },
                        { key: "payment_amount", label: "Payment Amount" },
                        { key: "payment_type", label: "Payment Type" }
                    ]}
                    data={filteredStudents}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    actions={[
                        { label: "View", icon: <VisibilityIcon fontSize="small" />, onClick: () => handleView(), color: 'secondary' },
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
