import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useLoader } from "../../../../context/LoaderContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import { exportToExcel } from "../../../../constants/excelExport";
import CardComponent from "../../../../components/card/Card";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";
import ReusableTable from "../../../../components/table/table";
import TablePagination from "../../../../components/tablepagination/tablepagination";



export default function PaymentControlList() {
    const navigate = useNavigate();
    const { loading } = useLoader();

    const [workflowList, setWorkflowList] = useState<any[]>([]);
    const [searchText, setSearchText] = useState("");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch list
    useEffect(() => {
        fetchWorkflowList();
    }, []);

    const fetchWorkflowList = async () => {
        try {
            const response = await apiRequest({
                url: ApiRoutes.PAYMENTCONTROLLIST,
                method: "get",
            });

            if (response) {
                // SAFE handling
                setWorkflowList(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch workflow list", error);
            setWorkflowList([]);
        }
    };

    // Search filter
    const filteredData = workflowList.filter((row) => {
        const text =
            `${row.program_id} ${row.batch} ${row.admission_year} ${row.semester} ${row.enabled}`
                .toLowerCase();

        return text.includes(searchText.toLowerCase());
    });

    // Export
    const handleExportExcel = () => {
        exportToExcel(
            filteredData,
            [
                { header: "Program ID", key: "program_id" },
                { header: "Batch", key: "batch" },
                { header: "Admission Year", key: "admission_year" },
                { header: "Semester", key: "semester" },
                { header: "Status", key: "enabled" },
            ],
            "Pending Payment Workflow",
            "Workflow"
        );
    };

    return (
        <CardComponent
            sx={{
                width: "100%",
                maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
                mx: "auto",
                p: 3,
                mt: 3,
            }}
        >
            <>
                <TableToolbar
                    filters={[
                        {
                            key: "search",
                            label: "Search Program",
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
                            label: "Add",
                            color: "primary",
                            //   startIcon: <AddIcon />,
                            onClick: () => {
                                navigate("/payment-control/add");
                            },
                        },
                    ]}
                />

                {
                    loading ? (
                        <TableSkeleton />
                    )
                        : filteredData.length === 0 ? (
                            <NoDataFoundUI />
                        )
                            : (
                                <ReusableTable
                                    columns={[
                                        { key: "program_id", label: "Program ID" },
                                        { key: "batch", label: "Batch" },
                                        { key: "admission_year", label: "Admission Year" },
                                        { key: "semester", label: "Semester" },
                                        { key: "enabled", label: "Status" },
                                    ]}
                                    data={filteredData.map((row) => ({
                                        ...row,
                                        enabled: row.enabled ? "Enabled" : "Disabled",
                                    }))}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    actions={[
                                        {
                                            label: "Edit",
                                            icon: <VisibilityIcon fontSize="small" />,
                                            color: "secondary",
                                            onClick: (row) => {
                                                navigate(
                                                    `/payment-control/edit/${row.id}`,
                                                    {
                                                        state: row,
                                                    }
                                                );
                                            }
                                        },
                                    ]}
                                />
                            )
                }

                <TablePagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredData.length}
                    onPageChange={(newPage) => setPage(newPage)}
                    onRowsPerPageChange={(rows) => {
                        setRowsPerPage(rows);
                        setPage(0);
                    }}
                />

            </>
        </CardComponent>
    );
}