import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";
import { useGlobalError } from "../../../../context/ErrorContext";
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
import VisibilityIcon from '@mui/icons-material/Visibility';


export default function SyllabusList() {
    const navigate = useNavigate();
    const { clearError } = useGlobalError();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [searchText, setSearchText] = React.useState("");
    const [programs, setPrograms] = React.useState<any[]>([]);

    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------
    React.useEffect(() => {
        clearError();
        const fetchData = async () => {
            apiClient.get(ApiRoutes.GETPROGRAMLIST)
                .then(res => {
                    setPrograms(res.data);
                })
                .catch()

                .finally();
        };

        fetchData();
    }, []);
    const { loading } = useLoader()

    // ----------------------------------------------------------
    // FILTER
    // ----------------------------------------------------------
    const filteredPrograms = programs.filter((c) => {
        const combined = `${c.programe_code} ${c.programe} ${c.duration}`.toLowerCase();
        return combined.includes(searchText.toLowerCase());
    });

    // ----------------------------------------------------------
    // EXPORT FUNCTION
    // ----------------------------------------------------------
    const handleExportExcel = () => {
        exportToExcel(
            filteredPrograms,
            [
                { header: "S.No", key: "sno" },
                { header: "Program ID", key: "programe_code" },
                { header: "Program Name", key: "programe" },
                { header: "Duration", key: "duration" },
            ],
            "Programs",
            "Programs"
        );
    };
    // ----------------------------------------------------------
    // 🎯 MAIN UI – only when data exists
    // ----------------------------------------------------------
    return (
        <>
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
                            label: "Add Syllabus",
                            color: "primary",
                            onClick: () => navigate("/syllabus/add"),
                        },
                    ]}
                />
                {
                    loading ? (
                        <TableSkeleton />
                    )
                        : (
                            <>

                                {filteredPrograms.length == 0 ? (
                                    <NoDataFoundUI />
                                ) : (
                                    <ReusableTable
                                        columns={[
                                            { key: "programe_code", label: "Program ID" },
                                            { key: "programe", label: "Program Name" },
                                            { key: "duration", label: "Duration" },
                                        ]}
                                        data={filteredPrograms}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        isRowExpandable={(row) => Array.isArray(row.fee) && row.fee.length > 0}
                                        actions={[
                                            {
                                                label: "View",
                                                icon: <VisibilityIcon fontSize="small" />,
                                                onClick: (row) => navigate(`/syllabus/view/${row.id}`),
                                            },
                                            {
                                                label: "Edit",
                                                icon: <EditIcon fontSize="small" />,
                                                onClick: (row) => navigate(`/syllabus/add/${row.id}`),
                                                color: "primary",
                                            },
                                            {
                                                label: "Delete",
                                                icon: <DeleteIcon fontSize="small" />,
                                                onClick: (row) => navigate(`/syllabus/add/${row.id}`),
                                                color: "error",
                                            },
                                        ]}
                                    />
                                )
                                }
                            </>
                        )
                }
                <TablePagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredPrograms.length}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </CardComponent>
        </>
    );
}
