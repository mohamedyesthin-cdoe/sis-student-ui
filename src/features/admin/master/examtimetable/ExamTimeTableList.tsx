import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
    const [timetables, setTimetables] = React.useState<any[]>([]);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);

    // ----------------------------------------------------------
    // FETCH TIMETABLES
    // ----------------------------------------------------------
    React.useEffect(() => {
        clearError();

        apiClient
            .get(ApiRoutes.EXAMTIMETABLES) // ✅ update route
            .then((res) => setTimetables(res.data))
            .catch(() => {
                showAlert("Failed to load exam timetables", "error");
            });
    }, []);

    // ----------------------------------------------------------
    // DELETE
    // ----------------------------------------------------------
    const handleConfirmDelete = async () => {
        if (!selectedRow?.id) return;

        try {
            await apiRequest({
                url: `${ApiRoutes.EXAMTIMETABLES}/${selectedRow.id}`,
                method: "delete",
            });

            setTimetables((prev) =>
                prev.filter((item) => item.id !== selectedRow.id)
            );

            showAlert("Exam timetable deleted successfully!", "success");
            handleCloseDelete();
        } catch (err: any) {
            showAlert(
                err.response?.data?.message ||
                "Failed to delete exam timetable.",
                "error"
            );
        }
    };

    const handleOpenDelete = (row: any) => {
        setSelectedRow(row);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setSelectedRow(null);
        setOpenDelete(false);
    };

    // ----------------------------------------------------------
    // FILTER
    // ----------------------------------------------------------
    const filteredData = timetables.filter((p) => {
        const combined = `
            ${p.exam_id}
            ${p.course_id}
            ${p.component_id}
            ${p.exam_date}
            ${p.start_time}
            ${p.end_time}
        `.toLowerCase();

        return combined.includes(searchText.toLowerCase());
    });

    // ----------------------------------------------------------
    // EXPORT
    // ----------------------------------------------------------
    const handleExportExcel = () => {
        exportToExcel(
            filteredData.map((item, index) => ({
                sno: index + 1,
                exam_id: item.exam_id,
                course_id: item.course_id,
                component_id: item.component_id,
                exam_date: dayjs(item.exam_date).format("DD-MM-YYYY"),
                start_time: item.start_time,
                end_time: item.end_time,
            })),
            [
                { header: "S.No", key: "sno" },
                { header: "Exam ID", key: "exam_id" },
                { header: "Course ID", key: "course_id" },
                { header: "Component ID", key: "component_id" },
                { header: "Exam Date", key: "exam_date" },
                { header: "Start Time", key: "start_time" },
                { header: "End Time", key: "end_time" },
            ],
            "Exam_Timetable_List",
            "Exam_Timetable_List"
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
                            onClick: () =>
                                navigate("/exam-timetables/add"),
                        },
                    ]}
                />

                {loading ? (
                    <TableSkeleton />
                ) : filteredData.length === 0 ? (
                    <NoDataFoundUI />
                ) : (
                    <ReusableTable
                        columns={[
                            { key: "exam_id", label: "Exam ID" },
                            { key: "course_id", label: "Course ID" },
                            { key: "component_id", label: "Component ID" },
                            {
                                key: "exam_date",
                                label: "Exam Date",
                                render: (row: any) =>
                                    dayjs(row.exam_date).format("DD-MM-YYYY"),
                            },
                            { key: "start_time", label: "Start Time" },
                            { key: "end_time", label: "End Time" },
                        ]}
                        data={filteredData}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        actions={[
                            {
                                label: "Edit",
                                icon: <EditIcon fontSize="small" />,
                                color: "primary",
                                onClick: (row) =>
                                    navigate(
                                        `/exam-timetables/edit/${row.id}`
                                    ),
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
                    totalCount={filteredData.length}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </CardComponent>

            <CustomDialog
                open={openDelete}
                title="Delete Exam Timetable"
                description={
                    <>
                        Are you sure you want to delete timetable ID{" "}
                        <strong>{selectedRow?.id}</strong>?
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
