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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Customtext from "../../../../components/inputs/customtext/Customtext";
import { apiRequest } from "../../../../utils/ApiRequest";

export default function CourseComponentsList() {
  const navigate = useNavigate();
  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const { showAlert } = useAlert();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [components, setComponents] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedComponent, setSelectedComponent] = React.useState<any>(null);

  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.COURSE_COMPONENTS)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setComponents(data);
      })
      .catch(() =>
        showAlert("Failed to load course components", "error")
      );
  }, []);

  /* ----------------------- DELETE ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedComponent?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.COURSE_COMPONENTS}/${selectedComponent.id}`,
        method: "delete" as const,
      });

      setComponents((prev) =>
        prev.filter((item) => item.id !== selectedComponent.id)
      );

      showAlert("Course Component deleted successfully!", "success");
      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete course component.",
        "error"
      );
    }
  };

  const handleCloseDelete = () => {
    setSelectedComponent(null);
    setOpenDelete(false);
  };

  const handleOpenDelete = (row: any) => {
    setSelectedComponent(row);
    setOpenDelete(true);
  };

  /* ----------------------- FILTER ---------------------- */

  const filteredComponents = components.filter((c) => {
    const combined = `
    ${c.component_code}
    ${c.component_description}
    ${c.component_type}
    ${c.core_or_elective}
    ${c.component_no}
  `.toLowerCase();

    return combined.includes(searchText.toLowerCase());
  });


  /* ----------------------- EXPORT ---------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredComponents.map((c, index) => ({
        sno: index + 1,
        component_code: c.component_code,
        component_description: c.component_description,
        component_no: c.component_no,
        component_type: c.component_type,
        max_marks: c.max_marks,
        min_marks: c.min_marks,
        exam_mark: c.exam_mark,
        core_or_elective: c.core_or_elective,
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Component Code", key: "component_code" },
        { header: "Description", key: "component_description" },
        { header: "Component No", key: "component_no" },
        { header: "Component Type", key: "component_type" },
        { header: "Max Marks", key: "max_marks" },
        { header: "Min Marks", key: "min_marks" },
        { header: "Exam Mark", key: "exam_mark" },
        { header: "Core / Elective", key: "core_or_elective" },
      ],
      "Course_Components",
      "Course_Components"
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
              placeholder: "Search components",
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
              label: "Add Course Component",
              color: "primary",
              onClick: () => navigate("/course-components/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredComponents.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "component_code", label: "Component Code" },
              { key: "component_description", label: "Description" },
              { key: "component_no", label: "Component No" },
              { key: "component_type", label: "Type" },
              { key: "max_marks", label: "Max Marks" },
              { key: "min_marks", label: "Min Marks" },
              { key: "exam_mark", label: "Exam Mark" },
              { key: "core_or_elective", label: "Core / Elective" },
            ]}
            data={filteredComponents}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) =>
                  navigate(`/course-components/edit/${row.id}`),
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
          totalCount={filteredComponents.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>

      {/* ---------------- DELETE DIALOG ---------------- */}

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Course Component</DialogTitle>

        <DialogContent dividers>
          <Customtext
            fieldName={
              <>
                Are you sure you want to delete{" "}
                <strong>
                  {selectedComponent?.component_description}
                </strong>
                ?
              </>
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
