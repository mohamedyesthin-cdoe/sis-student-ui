import { useEffect, useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate, useParams } from "react-router-dom";

import { ApiRoutes } from "../../../../constants/ApiConstants";
import CardComponent from "../../../../components/card/Card";
import ReusableTable from "../../../../components/table/table";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import { exportToExcel } from "../../../../constants/excelExport";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";

import { useGlobalError } from "../../../../context/ErrorContext";
import { useLoader } from "../../../../context/LoaderContext";
import { useAlert } from "../../../../context/AlertContext";
import { apiRequest } from "../../../../utils/ApiRequest";

/* ---------------------- Normalize Semester ---------------------- */
const normalizeSemester = (semester: string) => {
  const map: Record<string, string> = {
    "First Semester": "Semester 1",
    "Second Semester": "Semester 2",
    "Third Semester": "Semester 3",
    "Fourth Semester": "Semester 4",
    "Fifth Semester": "Semester 5",
    "Sixth Semester": "Semester 6",
    "Seventh Semester": "Semester 7",
    "Eighth Semester": "Semester 8",
  };
  return map[semester] || semester;
};

const SyllabusTabView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const { showAlert } = useAlert();

  const [syllabusList, setSyllabusList] = useState<any[]>([]);
  const [activeSemester, setActiveSemester] = useState<string>("");


  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const handleTabChange = (newValue: string) => {
    console.log(newValue);
    setActiveSemester(newValue);
  };

  /* ---------------------- Fetch API ---------------------- */
  useEffect(() => {
    clearError();
    if (!id) return;

    const fetchSyllabus = async () => {
      try {
        const res = await apiRequest({
          url: ApiRoutes.GETSYLLABUSLIST,
          method: "get",
        });

        const data = Array.isArray(res) ? res[0].data : res[0].data;

        setSyllabusList(data);
      } catch (err: any) {
        showAlert(
          err.response?.data?.message || "Failed to fetch syllabus",
          "error"
        );
      }
    };

    fetchSyllabus();
  }, [id]);

  /* ---------------------- Format Data ---------------------- */
  const formattedData = syllabusList.map((f, index) => ({
    ...f,
    sno: index + 1,
    semester: normalizeSemester(f.semester),
    course_code_id: f.course_code?.code,
    course_category_id: f.course_category?.name,
    course_title_id: f.course_title?.title,
    search_text: `
      ${f.course_code?.code}
      ${f.course_title?.title}
      ${f.course_category?.name}
      ${normalizeSemester(f.semester)}
    `.toLowerCase(),
  }));

  /* ---------------------- Semester Tabs ---------------------- */
  const semesters = Array.from(
    new Set(formattedData.map((i) => i.semester))
  ).sort(
    (a, b) =>
      Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""))
  );

  /* ---------------------- Force Semester 1 First ---------------------- */
  useEffect(() => {
    if (!activeSemester && semesters.length) {
      setActiveSemester(
        semesters.includes("Semester 1") ? "Semester 1" : semesters[0]
      );
    }
  }, [semesters, activeSemester]);



  /* ---------------------- Filter Data ---------------------- */
  const filteredSyllabuses = formattedData.filter(
    (f) =>
      f.semester === activeSemester &&
      f.search_text.includes(searchText.toLowerCase())
  );

  /* ---------------------- Actions ---------------------- */
  const handleAdd = () => navigate("/syllabus/add");

  const handleExportExcel = () => {
    exportToExcel(
      filteredSyllabuses,
      [
        { key: "course_code_id", header: "Course Code" },
        { key: "course_title_id", header: "Course Title" },
        { key: "course_category_id", header: "Category" },
        { key: "credits", header: "Credits" },
        { key: "lecture_hours", header: "Lecture Hours" },
        { key: "tutorial_hours", header: "Tutorial Hours" },
        { key: "practical_hours", header: "Practical Hours" },
        { key: "total_hours", header: "Total Hours" },
        { key: "cia", header: "CIA" },
        { key: "esa", header: "ESA" },
        { key: "total_marks", header: "Total Marks" },
        { key: "semester", header: "Semester" },
      ],
      "Syllabus",
      "Semester_Syllabus"
    );
  };

  /* ---------------------- UI ---------------------- */
  return (
    <CardComponent sx={{ p: 3, mt: 3 }}>
      {/* -------- Semester Tabs -------- */}
      <Box sx={{ mb: 2 }}>
        <Tabs
          value={activeSemester}
          onChange={(_, val) => {
            handleTabChange(val);
            setPage(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 1,
              mr: 1,
            },
            "& .Mui-selected": {
              bgcolor: "#105c8e",
              color: "#fff !important",
            },
          }}
        >
          {semesters.map((sem) => (
            <Tab key={sem} label={sem} value={sem} />
          ))}
        </Tabs>
      </Box>

      {/* -------- Toolbar -------- */}
      <TableToolbar
        filters={[
          {
            key: "search",
            label: "Search",
            type: "text",
            value: searchText,
            onChange: (val) => setSearchText(val),
            placeholder: "Search syllabus...",
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
            onClick: handleAdd,
          },
        ]}
      />

      {/* -------- Table -------- */}
      {loading ? (
        <TableSkeleton />
      ) : filteredSyllabuses.length === 0 ? (
        <NoDataFoundUI />
      ) : (
        <ReusableTable
          columns={[
            { key: "course_code_id", label: "Code" },
            { key: "course_category_id", label: "Category" },
            { key: "course_title_id", label: "Title" },
            { key: "credits", label: "Credits" },
            { key: "total_hours", label: "Total Hours" },
            { key: "lecture_hours", label: "Lecture" },
            { key: "tutorial_hours", label: "Tutorial" },
            { key: "practical_hours", label: "Practical" },
            { key: "cia", label: "CIA" },
            { key: "esa", label: "ESA" },
            { key: "total_marks", label: "Total Marks" },
          ]}
          data={filteredSyllabuses}
          page={page}
          rowsPerPage={rowsPerPage}
          // actions={[
          //   {
          //     label: "View",
          //     icon: <VisibilityIcon fontSize="small" />,
          //     onClick: handleView,
          //   },
          //   {
          //     label: "Edit",
          //     icon: <EditIcon fontSize="small" />,
          //     onClick: handleEdit,
          //   },
          //   {
          //     label: "Delete",
          //     icon: <DeleteIcon fontSize="small" />,
          //     color: "error",
          //     onClick: () => { },
          //   },
          // ]}
        />
      )}

      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredSyllabuses.length}
        onPageChange={setPage}
      />
    </CardComponent>
  );
};

export default SyllabusTabView;
