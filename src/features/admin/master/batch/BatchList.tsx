import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";

import { useGlobalError } from "../../../../context/ErrorContext";
import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";

import apiClient from "../../../../services/ApiClient";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import { exportToExcel } from "../../../../constants/excelExport";

import CardComponent from "../../../../components/card/Card";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";
import ReusableTable from "../../../../components/table/table";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import CustomDialog from "../../../../context/ConfirmDialog";

export default function BatchList() {
  const navigate = useNavigate();

  const { clearError } = useGlobalError();
  const { showAlert } = useAlert();
  const { loading } = useLoader();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");

  const [batches, setBatches] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedBatch, setSelectedBatch] = React.useState<any>(null);

  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.BATCHLIST)
      .then((res) => setBatches(res.data || []))
      .catch(() => showAlert("Failed to load batch list", "error"));
  }, []);

  /* ----------------------- DELETE WITH CONFIRM ---------------------- */

  /* ----------------------- DELETE WITH CONFIRM ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedBatch?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.BATCHDELETE}/${selectedBatch.id}`,
        method: "delete",
      });

      setBatches((prev) =>
        prev.filter(
          (item) => item.id !== selectedBatch.id
        )
      );

      showAlert(
        "Batch deleted successfully!",
        "success"
      );

      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete batch.",
        "error"
      );
    }
  };

  const handleCloseDelete = () => {
    setSelectedBatch(null);
    setOpenDelete(false);
  };

  const handleOpenDelete = (row: any) => {
    setSelectedBatch(row);
    setOpenDelete(true);
  };

  /* ------------------------------- FILTER --------------------------- */

  const filteredBatches = batches.filter((b) => {
    const combined = `
    ${b.batch_number}
    ${b.batch_name}
    ${b.start_month}
    ${b.end_month}
    ${b.description}
  `.toLowerCase();

    return combined.includes(
      searchText.toLowerCase()
    );
  });

  /* ------------------------------- EXPORT --------------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredBatches.map((b, index) => ({
        sno: index + 1,
        batch_number: b.batch_number,
        batch_name: b.batch_name,
        start_month: b.start_month,
        end_month: b.end_month,
        description: b.description,
        is_active: b.is_active
          ? "Yes"
          : "No",
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Batch Name", key: "batch_name" },
        { header: "Start Month", key: "start_month" },
        { header: "End Month", key: "end_month" },
        { header: "Description", key: "description" },
        { header: "Status", key: "is_active" },
      ],
      "BatchList",
      "BatchList"
    );
  };

  /* ------------------------------- UI ------------------------------- */

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
              placeholder: "Search batch",
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
              label: "Add Batch",
              color: "primary",
              onClick: () => navigate("/batch/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredBatches.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "batch_name", label: "Batch Name" },
              { key: "start_month", label: "Start Month" },
              { key: "end_month", label: "End Month" },
              { key: "description", label: "Description" },
              {
                key: "is_active",
                label: "Status",
                render: (row: any) =>
                  row.is_active ? "Active" : "Inactive",
              },
            ]}
            data={filteredBatches}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) =>
                  navigate(`/batch/edit/${row.id}`)
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
          totalCount={filteredBatches.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>

      <CustomDialog
        open={openDelete}
        title="Delete Batch"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {selectedBatch?.batch_name}
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