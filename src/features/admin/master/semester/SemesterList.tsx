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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Customtext from "../../../../components/inputs/customtext/Customtext";
import { apiRequest } from "../../../../utils/ApiRequest";

export default function SemestersList() {
  const navigate = useNavigate();
  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const { showAlert } = useAlert();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [semesters, setSemesters] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedSemesters, setSelectedSemesters] = React.useState<any>(null);
  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.SEMESTERS)
      .then((res) => setSemesters(res.data || []))
      .catch(() => showAlert("Failed to load semesters", "error"));
  }, []);

  /* ----------------------- DELETE WITH CONFIRM ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedSemesters?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.SEMESTERS}/${selectedSemesters.id}`,
        method: "delete" as const,
      });

      // ✅ remove deleted item from UI immediately
      setSemesters((prev) =>
        prev.filter((item) => item.id !== selectedSemesters.id)
      );

      showAlert("Semester deleted successfully!", "success");

      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete semester.",
        "error"
      );
    }
  };


  const handleCloseDelete = () => {
    setSelectedSemesters(null);
    setOpenDelete(false);
  };
  const handleOpenDelete = (row: any) => {
    setSelectedSemesters(row);
    setOpenDelete(true);
  };

  /* ------------------------------- FILTER --------------------------- */

  const filteredSemesters = semesters.filter((s) => {
    const combined = `
      ${s.semester_name}
      ${s.semester_no}
      ${s.scheme_id}
    `.toLowerCase();

    return combined.includes(searchText.toLowerCase());
  });

  /* ------------------------------- EXPORT --------------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredSemesters.map((s, index) => ({
        sno: index + 1,
        semester_name: s.semester_name,
        semester_no: s.semester_no,
        scheme_id: s.scheme_id,
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Semester Name", key: "semester_name" },
        { header: "Semester No", key: "semester_no" },
        { header: "Scheme ID", key: "scheme_id" },
      ],
      "Semesters",
      "Semesters"
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
              placeholder: "Search semesters",
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
              label: "Add Semester",
              color: "primary",
              onClick: () => navigate("/semesters/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredSemesters.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "semester_name", label: "Semester Name" },
              { key: "semester_no", label: "Semester No" },
              { key: "scheme_id", label: "Scheme ID" },
            ]}
            data={filteredSemesters}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) => navigate(`/semesters/edit/${row.id}`),
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
          totalCount={filteredSemesters.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Semester</DialogTitle>
        <DialogContent dividers>
          <Customtext
            fieldName={
              <>
                Are you sure you want to delete this{" "}
                <strong>{selectedSemesters?.semester_name}?</strong>
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
