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

export default function CourseList() {
  const navigate = useNavigate();
  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const { showAlert } = useAlert();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [courses, setCourses] = React.useState<any[]>([]);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedCourses, setSelectedCourses] = React.useState<any>(null);
  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.COURSES)
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setCourses(data);
      })
      .catch(() => showAlert("Failed to load courses", "error"));
  }, []);

  /* ----------------------- DELETE WITH CONFIRM ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedCourses?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.COURSES}/${selectedCourses.id}`,
        method: "delete" as const,
      });

      // ✅ remove deleted item from UI immediately
      setCourses((prev) =>
        prev.filter((item) => item.id !== selectedCourses.id)
      );

      showAlert("Course deleted successfully!", "success");

      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete course.",
        "error"
      );
    }
  };

  const handleCloseDelete = () => {
    setSelectedCourses(null);
    setOpenDelete(false);
  };
  const handleOpenDelete = (row: any) => {
    setSelectedCourses(row);
    setOpenDelete(true);
  };

  /* ------------------------------- FILTER --------------------------- */

  const filteredCourses = courses.filter((c) => {
    const combined = `
      ${c.dept_code}
      ${c.main_code}
      ${c.main_course}
      ${c.course_code}
      ${c.course_title}
      ${c.course_type}
      ${c.regulation_pattern}
    `.toLowerCase();

    return combined.includes(searchText.toLowerCase());
  });

  /* ------------------------------- EXPORT --------------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredCourses.map((c, index) => ({
        sno: index + 1,
        dept_code: c.dept_code,
        main_code: c.main_code,
        main_course: c.main_course,
        course_code: c.course_code,
        course_title: c.course_title,
        course_type: c.course_type,
        credits: c.credits,
        regulation_pattern: c.regulation_pattern,
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Dept Code", key: "dept_code" },
        { header: "Main Code", key: "main_code" },
        { header: "Main Course", key: "main_course" },
        { header: "Course Code", key: "course_code" },
        { header: "Course Title", key: "course_title" },
        { header: "Course Type", key: "course_type" },
        { header: "Credits", key: "credits" },
        { header: "Regulation Pattern", key: "regulation_pattern" },
      ],
      "Courses",
      "Courses"
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
              placeholder: "Search courses",
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
              label: "Add Course",
              color: "primary",
              onClick: () => navigate("/courses/add"),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredCourses.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              { key: "dept_code", label: "Dept Code" },
              { key: "main_code", label: "Main Code" },
              { key: "main_course", label: "Main Course" },
              { key: "course_code", label: "Course Code" },
              { key: "course_title", label: "Course Title" },
              { key: "course_type", label: "Course Type" },
              { key: "credits", label: "Credits" },
              { key: "regulation_pattern", label: "Regulation" },
            ]}
            data={filteredCourses}
            page={page}
            rowsPerPage={rowsPerPage}
            actions={[
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                color: "primary",
                onClick: (row) => navigate(`/courses/edit/${row.id}`),
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
          totalCount={filteredCourses.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </CardComponent>
      <Dialog open={openDelete} onClose={handleCloseDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Course</DialogTitle>
        <DialogContent dividers>
          <Customtext
            fieldName={
              <>
                Are you sure you want to delete this{" "}
                <strong>{selectedCourses?.course_title}?</strong>
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
