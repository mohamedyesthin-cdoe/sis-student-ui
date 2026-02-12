import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

import { useGlobalError } from "../../../../context/ErrorContext";
import { useLoader } from "../../../../context/LoaderContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import CardComponent from "../../../../components/card/Card";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";
import ReusableTable from "../../../../components/table/table";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import { exportToExcel } from "../../../../constants/excelExport";
import { useAlert } from "../../../../context/AlertContext";
import CustomDialog from "../../../../context/ConfirmDialog";
export default function RoleList() {
    const { clearError } = useGlobalError();
    const { loading } = useLoader();

    const [roles, setRoles] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage] = React.useState(10);
    const [searchText, setSearchText] = React.useState("");

    const [openAddRole, setOpenAddRole] = React.useState(false);
    const [roleName, setRoleName] = React.useState("");
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [editingRoleId, setEditingRoleId] = React.useState<number | null>(null);

    const [openDelete, setOpenDelete] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<any>(null);
    const { showAlert } = useAlert();


    React.useEffect(() => {
        clearError();
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        apiRequest({ url: ApiRoutes.GETROLES, method: "get" as const })
            .then((data) => setRoles(Array.isArray(data) ? data : data.data))
            .catch(() => setRoles([]));
    };

    const formattedData = roles.map((r, index) => ({
        ...r,
        sno: index + 1,
        name: r.name || "",
        search_text: `${r.id} ${r.name}`.toLowerCase(),
    }));

    const filteredRoles = formattedData.filter((r) =>
        r.search_text.includes(searchText.toLowerCase())
    );

    const handleExportExcel = () => {
        exportToExcel(
            filteredRoles,
            [
                { header: "S.No", key: "sno" },
                { header: "Role Name", key: "name" },
            ],
            "Role",
            "Role_List"
        );
    };

    const handleSaveRole = async () => {
        if (!roleName.trim()) {
            showAlert("Role name is required.", "error");
            return;
        }

        const apiConfig = isEditMode
            ? {
                url: `${ApiRoutes.ROLESUPDATE}/${editingRoleId}`,
                method: "put" as const,
                data: { name: roleName },
            }
            : {
                url: ApiRoutes.ROLESADD,
                method: "post" as const,
                data: { name: roleName },
            };

        try {
            await apiRequest(apiConfig);

            showAlert(
                isEditMode
                    ? "Role updated successfully!"
                    : "Role added successfully!",
                "success"
            );

            handleCloseRoleDialog();
            fetchRoles();
        } catch (err: any) {
            showAlert(
                err.response?.data?.message ||
                "Something went wrong. Please try again.",
                "error"
            );
        }
    };


    const handleEditRole = (row: any) => {
        setIsEditMode(true);
        setEditingRoleId(row.id);
        setRoleName(row.name);
        setOpenAddRole(true);
    };

    const handleOpenDelete = (row: any) => {
        setSelectedRole(row);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setSelectedRole(null);
        setOpenDelete(false);
    };


    const handleConfirmDelete = async () => {
        if (!selectedRole?.id) return;

        try {
            await apiRequest({
                url: `${ApiRoutes.DELETEROLE}/${selectedRole.id}`,
                method: "delete" as const,
            });

            showAlert("Role deleted successfully!", "success");

            handleCloseDelete();
            fetchRoles();
        } catch (err: any) {
            showAlert(
                err.response?.data?.message ||
                "Failed to delete role.",
                "error"
            );
        }
    };


    const handleCloseRoleDialog = () => {
        setOpenAddRole(false);
        setRoleName("");
        setIsEditMode(false);
        setEditingRoleId(null);
    };

    return (
        <>
            <CardComponent
                sx={{
                    width: "100%",
                    maxWidth: { xs: "350px", sm: "900px", md: "900px" },
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
                            placeholder: "Search by role name...",
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
                            label: "Add Role",
                            color: "primary",
                            onClick: () => setOpenAddRole(true),
                        },
                    ]}
                />

                {loading ? (
                    <TableSkeleton />
                ) : filteredRoles.length === 0 ? (
                    <NoDataFoundUI />
                ) : (
                    <ReusableTable
                        columns={[
                            { key: "name", label: "Role Name", width: 180 },
                        ]}
                        data={filteredRoles}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        actions={[
                            {
                                label: "Edit",
                                icon: <EditIcon fontSize="small" />,
                                onClick: handleEditRole,
                                color: "primary",
                            },
                            {
                                label: "Delete",
                                icon: <DeleteIcon fontSize="small" />,
                                onClick: handleOpenDelete,
                                color: "error",
                            },
                        ]}
                        actionDisplay="inline"
                    />
                )}

                <TablePagination
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={filteredRoles.length}
                    onPageChange={(newPage) => setPage(newPage)}
                />
            </CardComponent>

            <Dialog open={openAddRole} onClose={handleCloseRoleDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditMode ? "Edit Role" : "Add Role"}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        fullWidth
                        label="Role Name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRoleDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveRole} disabled={!roleName.trim()}>
                        {isEditMode ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
            <CustomDialog
                open={openDelete}
                title="Delete Role"
                description={
                    <>
                        Are you sure you want to delete{" "}
                        <strong>
                            {selectedRole?.name}
                        </strong>
                        ?
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
