import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CardComponent from "../../../components/card/Card";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/table/table";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../components/tablepagination/tablepagination";
import { exportToExcel } from "../../../constants/excelExport";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import TableSkeleton from "../../../components/card/skeletonloader/Tableskeleton";
import { useLoader } from "../../../context/LoaderContext";
import { useGlobalError } from "../../../context/ErrorContext";
import { NoDataFoundUI } from "../../../components/card/errorUi/NoDataFoundUI";

export default function FacultyList() {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [showSearch] = React.useState(true);
  const { clearError } = useGlobalError();


  const [faculties, setFaculties] = React.useState<any[]>([]);
  const { loading } = useLoader();

  // Fetch Faculty List
  React.useEffect(() => {
    clearError();
    apiRequest({ url: ApiRoutes.GETFACULTYLIST, method: "get" })
      .then((data) => setFaculties(Array.isArray(data) ? data : data.data))
      .catch(() => setFaculties([]));
  }, []);

  // Create full name and searchable text
  const formattedData = faculties.map((f, index) => ({
    ...f,
    sno: index + 1,
    full_name: `${f.first_name || ""} ${f.last_name || ""}`.trim(),
    search_text: `${f.employee_id} ${f.first_name} ${f.last_name} ${f.email} ${f.phone} ${f.department} ${f.designation}`.toLowerCase(),
  }));

  // Search
  const filteredFaculties = formattedData.filter((f) =>
    f.search_text.includes(searchText.toLowerCase())
  );

  // Excel Export
  const handleExportExcel = () => {
    exportToExcel(
      filteredFaculties,
      [
        { header: "S.No", key: "sno" },
        { header: "Employee ID", key: "employee_id" },
        { header: "Full Name", key: "full_name" },
        { header: "Email", key: "email" },
        { header: "Mobile", key: "phone" },
        { header: "Department", key: "department" },
        { header: "Designation", key: "designation" },
        { header: "Employment Type", key: "employment_type" },
      ],
      "Faculty",
      "Faculty_List"
    );
  };

  // Navigate to Add/Edit
  const handleAdd = () => navigate("/faculty/add");
  const handleEdit = (row: any) => navigate(`/faculty/add?id=${row.employee_id}`);

  return (
    <>
      {
        loading ? (
          <TableSkeleton />
        )
          : (
            <CardComponent
              sx={{
                width: "100%",
                maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
                mx: "auto",
                p: 3,
                mt: 3,
              }}
            >
              {/* Toolbar */}
              <TableToolbar
                filters={[
                  {
                    key: "search",
                    label: "Search",
                    type: "text",
                    value: searchText,
                    onChange: (val) => setSearchText(val),
                    placeholder: "Search by name, email, phone...",
                    visible: showSearch,
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
                    label: "Add Faculty",
                    color: "primary",
                    onClick: handleAdd,
                  },
                ]}
              />
              {filteredFaculties.length === 0 ? (
                <NoDataFoundUI />
              ) : (
                < ReusableTable
                  columns={[
                    { key: "employee_id", label: "Employee ID" },
                    { key: "full_name", label: "Full Name" },
                    { key: "email", label: "Email" },
                    { key: "phone", label: "Mobile" },
                    { key: "department", label: "Department" },
                    { key: "designation", label: "Designation" },
                  ]}
                  data={filteredFaculties}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  actions={[
                    {
                      label: "Edit",
                      icon: <EditIcon fontSize="small" />,
                      onClick: (row) => handleEdit(row),
                      color: "primary",
                    },
                    {
                      label: "Delete",
                      icon: <DeleteIcon fontSize="small" />,
                      onClick: () => { },
                      color: "error",
                    },
                  ]}
                />
              )
              }

              {/* Pagination */}
              <TablePagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={filteredFaculties.length}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </CardComponent>
          )
      }
    </>
  );
}
