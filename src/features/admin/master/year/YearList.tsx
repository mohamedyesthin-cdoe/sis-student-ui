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

export default function YearList() {
  const navigate = useNavigate();

  const { clearError } = useGlobalError();
  const { showAlert } = useAlert();
  const { loading } = useLoader();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");

  const [years, setYears] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<any>(null);

  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.ACADEMICYEARLIST)
      .then((res) => setYears(res.data || []))
      .catch(() => showAlert("Failed to load year list", "error"));
  }, []);

  /* ----------------------- DELETE WITH CONFIRM ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedYear?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.ACADEMICDELETE}/${selectedYear.id}`,
        method: "delete" as const,
      });

      setYears((prev) =>
        prev.filter((item) => item.id !== selectedYear.id)
      );

      showAlert("Year deleted successfully!", "success");

      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete year.",
        "error"
      );
    }
  };

  const handleCloseDelete = () => {
    setSelectedYear(null);
    setOpenDelete(false);
  };

  const handleOpenDelete = (row: any) => {
    setSelectedYear(row);
    setOpenDelete(true);
  };

  /* ------------------------------- FILTER --------------------------- */

  const filteredYears = years.filter((y) => {
    const combined = `
      ${y.year_code}
      ${y.start_year}
      ${y.end_year}
      ${y.start_month}
      ${y.end_month}
      ${y.description}
    `.toLowerCase();

    return combined.includes(searchText.toLowerCase());
  });

  /* ------------------------------- EXPORT --------------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredYears.map((y, index) => ({
        sno: index + 1,
        year_code: y.year_code,
        start_year: y.start_year,
        end_year: y.end_year,
        start_month: y.start_month,
        end_month: y.end_month,
        is_active: y.is_active ? "Yes" : "No",
        description: y.description,
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Year Code", key: "year_code" },
        { header: "Start Year", key: "start_year" },
        { header: "End Year", key: "end_year" },
        { header: "Start Month", key: "start_month" },
        { header: "End Month", key: "end_month" },
        { header: "Status", key: "is_active" },
        { header: "Description", key: "description" },
      ],
      "YearList",
      "YearList"
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
              placeholder: "Search year",
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
              label: "Add Year",
              color: "primary",
              onClick: () => navigate("/year/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredYears.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "year_code", label: "Year Code" },
              { key: "start_year", label: "Start Year" },
              { key: "end_year", label: "End Year" },
              { key: "start_month", label: "Start Month" },
              { key: "end_month", label: "End Month" },
              { key: "is_active", label: "Status" },
              { key: "description", label: "Description" },
            ]}
            data={filteredYears.map((row) => ({
              ...row,
              is_active: row.is_active ? "Active" : "Inactive",
            }))}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) =>
                  navigate(`/year/edit/${row.id}`),
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
          totalCount={filteredYears.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>

      <CustomDialog
        open={openDelete}
        title="Delete Year"
        description={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {selectedYear?.year_code}
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