import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";

import { useGlobalError } from "../../../../context/ErrorContext";
import { useAlert } from "../../../../context/AlertContext";
import apiClient from "../../../../services/ApiClient";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import { useLoader } from "../../../../context/LoaderContext";

import { exportToExcel } from "../../../../constants/excelExport";
import CardComponent from "../../../../components/card/Card";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";
import ReusableTable from "../../../../components/table/table";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import { apiRequest } from "../../../../utils/ApiRequest";
import CustomDialog from "../../../../context/ConfirmDialog";

export default function ExamTimeTableList() {
    const navigate = useNavigate();
    const { clearError } = useGlobalError();
    const { loading } = useLoader();
    const { showAlert } = useAlert();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [searchText, setSearchText] = React.useState("");
    const [exams, setExams] = React.useState<any[]>([]);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedExams, setSelectedExams] = React.useState<any>(null);

    const handleCloseDelete = () => {
        setSelectedExams(null);
        setOpenDelete(false);
    };
    const handleOpenDelete = (row: any) => {
        setSelectedExams(row);
        setOpenDelete(true);
    };

    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------
    React.useEffect(() => {
        clearError();

        apiClient
            .get(ApiRoutes.EXAMS)
            .then((res) => setExams(res.data))
            .catch(() => {
                showAlert("Failed to load exams", "error");
            });
    }, []);

    // ----------------------------------------------------------
    // DELETE WITH CONFIRM (useAlert)
    // ----------------------------------------------------------
    const handleConfirmDelete = async () => {
        if (!selectedExams?.id) return;

        try {
            await apiRequest({
                url: `${ApiRoutes.EXAMS}/${selectedExams.id}`,
                method: "delete" as const,
            });

            // ✅ remove deleted item from UI immediately
            setExams((prev) =>
                prev.filter((item) => item.id !== selectedExams.id)
            );

            showAlert("Exam deleted successfully!", "success");

            handleCloseDelete();
        } catch (err: any) {
            showAlert(
                err.response?.data?.message ||
                "Failed to delete scheme.",
                "error"
            );
        }
    };


    // ----------------------------------------------------------
    // FILTER
    // ----------------------------------------------------------
    const filteredExams = exams.filter((p) => {
        const combined = `
    ${p.exam_name}
    ${p.exam_type}
    ${p.month_year}
    ${p.scheme_id}
    ${p.semester_id}
  `.toLowerCase();

        return combined.includes(searchText.toLowerCase());
    });


    // ----------------------------------------------------------
    // EXPORT
    // ----------------------------------------------------------
    const handleExportExcel = () => {
        exportToExcel(
            filteredExams.map((item, index) => ({
                sno: index + 1,
                ...item,
                is_published: item.is_published ? "Yes" : "No",
            })),
            [
                { header: "S.No", key: "sno" },
                { header: "Exam Name", key: "exam_name" },
                { header: "Exam Type", key: "exam_type" },
                { header: "Month & Year", key: "month_year" },
                { header: "Scheme ID", key: "scheme_id" },
                { header: "Semester ID", key: "semester_id" },
                { header: "Published", key: "is_published" },
            ],
            "Exam_List",
            "Exam_List"
        );
    };


    // ----------------------------------------------------------
    // UI
    // ----------------------------------------------------------
    return (
        <>
            <CardComponent
                sx={{
                    width: "100%",
                    maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
                    mx: "auto",
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
                            visible: true,
                        },
                    ]}
                    actions={[
                        {
                            label: "Export Excel",
                            color: "secondary",
                            startIcon: <FileDownloadIcon />,
                            onClick: handleExportExcel,
                        },
                        {
                            label: "Add Exam Timetable",
                            color: "primary",
                            onClick: () => navigate("/exam-timetables/add"),
                        },
                    ]}
                />

                {loading ? (
                    <TableSkeleton />
                ) : filteredExams.length === 0 ? (
                    <NoDataFoundUI />
                ) : (
                    <ReusableTable
                        columns={[
                            { key: "exam_name", label: "Exam Name" },
                            { key: "exam_type", label: "Exam Type" },
                            { key: "month_year", label: "Month & Year" },
                            { key: "scheme_id", label: "Scheme ID" },
                            { key: "semester_id", label: "Semester ID" },
                            {
                                key: "is_published",
                                label: "Published",
                                render: (row: any) =>
                                    row.is_published ? "Yes" : "No",
                            },
                        ]}
                        data={filteredExams}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        actions={[
                            {
                                label: "Edit",
                                icon: <EditIcon fontSize="small" />,
                                color: "primary",
                                onClick: (row) => navigate(`/exam/edit/${row.id}`),
                            },
                            {
                                label: "Delete",
                                icon: <DeleteIcon fontSize="small" />,
                                color: "error",
                                onClick: handleOpenDelete,
                            },
                        ]}
                    />

                )}

                <TablePagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredExams.length}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </CardComponent>
            <CustomDialog
                open={openDelete}
                title="Delete Exam"
                description={
                    <>
                        Are you sure you want to delete{" "}
                        <strong>{selectedExams?.exam_name}</strong>?
                    </>
                }
                confirmText="Delete"
                cancelText="Cancel"
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
            />

        </>
    );
}
