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
import {  Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Customtext from "../../../../components/inputs/customtext/Customtext";
import { apiRequest } from "../../../../utils/ApiRequest";

export default function SchemesList() {
  const navigate = useNavigate();
  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const { showAlert } = useAlert();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [patterns, setPatterns] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedSchemes, setSelectedSchemes] = React.useState<any>(null);

  const handleCloseDelete = () => {
    setSelectedSchemes(null);
    setOpenDelete(false);
  };
  const handleOpenDelete = (row: any) => {
    setSelectedSchemes(row);
    setOpenDelete(true);
  };

  // ----------------------------------------------------------
  // API CALL
  // ----------------------------------------------------------
  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.SCHEMES)
      .then((res) => setPatterns(res.data))
      .catch(() => {
        showAlert("Failed to load program patterns", "error");
      });
  }, []);

  // ----------------------------------------------------------
  // DELETE WITH CONFIRM (useAlert)
  // ----------------------------------------------------------
  const handleConfirmDelete = async () => {
    if (!selectedSchemes?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.SCHEMES}/${selectedSchemes.id}`,
        method: "delete" as const,
      });

      // ✅ remove deleted item from UI immediately
      setPatterns((prev) =>
        prev.filter((item) => item.id !== selectedSchemes.id)
      );

      showAlert("Scheme deleted successfully!", "success");

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
  const filteredPatterns = patterns.filter((p) => {
    const combined = `
      ${p.regulation_year}
      ${p.program_pattern}
      ${p.program_pattern_no}
      ${p.programe_id}
    `.toLowerCase();

    return combined.includes(searchText.toLowerCase());
  });

  // ----------------------------------------------------------
  // EXPORT
  // ----------------------------------------------------------
  const handleExportExcel = () => {
    exportToExcel(
      filteredPatterns,
      [
        { header: "S.No", key: "sno" },
        { header: "Regulation Year", key: "regulation_year" },
        { header: "Program Pattern", key: "program_pattern" },
        { header: "Pattern No", key: "program_pattern_no" },
        { header: "Program ID", key: "programe_id" },
      ],
      "Program_Patterns",
      "Program_Patterns"
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
              label: "Add Scheme",
              color: "primary",
              onClick: () => navigate("/schemes/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredPatterns.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "regulation_year", label: "Regulation Year" },
              { key: "program_pattern", label: "Program Pattern" },
              { key: "program_pattern_no", label: "Pattern No" },
              { key: "programe_id", label: "Program ID" },
            ]}
            data={filteredPatterns}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) => navigate(`/schemes/edit/${row.id}`),
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
          totalCount={filteredPatterns.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Scheme</DialogTitle>
        <DialogContent dividers>
          <Customtext
            fieldName={
              <>
                Are you sure you want to delete this{" "}
                <strong>{selectedSchemes?.program_pattern}?</strong>
              </>
            }
            sx={{ fontWeight: "normal" }}
          />
        </DialogContent>


        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
