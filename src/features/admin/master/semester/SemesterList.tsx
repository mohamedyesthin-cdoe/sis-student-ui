import * as React from "react";
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
import { apiRequest } from "../../../../utils/ApiRequest";
import CustomDialog from "../../../../context/ConfirmDialog";

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
  const [selectedSemesters, setSelectedSemesters] =
    React.useState<any>(null);

  /* ---------------------------- API CALL ---------------------------- */

  React.useEffect(() => {
    clearError();

    apiClient
      .get(ApiRoutes.SEMESTERS)
      .then((res) => {
        const apiData = res.data || [];

        // ✅ Map one row per program
        const mappedData = apiData.map(
          (program: any) => ({
            id: program.program_id,
            program_id: program.program_id,
            program_code: program.program_code,
            department_code:
              program.department_code,
            total_semesters:
              program.semesters?.length || 0,
          })
        );

        setSemesters(mappedData);
      })
      .catch(() =>
        showAlert(
          "Failed to load semesters",
          "error"
        )
      );
  }, []);

  /* ----------------------- DELETE ---------------------- */

  const handleConfirmDelete = async () => {
    if (!selectedSemesters?.program_id)
      return;

    try {
      await apiRequest({
        url: `${ApiRoutes.SEMESTERS}/${selectedSemesters.program_id}`,
        method: "delete",
      });

      setSemesters((prev) =>
        prev.filter(
          (item) =>
            item.program_id !==
            selectedSemesters.program_id
        )
      );

      showAlert(
        "Program semesters deleted successfully!",
        "success"
      );

      handleCloseDelete();
    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
          "Failed to delete program semesters.",
        "error"
      );
    }
  };

  const handleCloseDelete = () => {
    setSelectedSemesters(null);
    setOpenDelete(false);
  };

  /* ----------------------- FILTER ----------------------- */

  const filteredSemesters = semesters.filter(
    (s) => {
      const combined = `
        ${s.program_code}
        ${s.program_id}
        ${s.total_semesters}
      `.toLowerCase();

      return combined.includes(
        searchText.toLowerCase()
      );
    }
  );

  /* ----------------------- EXPORT ----------------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredSemesters.map(
        (s, index) => ({
          sno: index + 1,
          program_code: s.program_code,
          program_id: s.program_id,
          total_semesters:
            s.total_semesters,
        })
      ),
      [
        {
          header: "S.No",
          key: "sno",
        },
        {
          header: "Program Code",
          key: "program_code",
        },
        {
          header: "Department Code",
          key: "department_code",
        },
        {
          header: "Total Semesters",
          key: "total_semesters",
        },
      ],
      "Semesters",
      "Semesters"
    );
  };

  /* ----------------------- UI ----------------------- */

  return (
    <>
      <CardComponent
        sx={{
          width: "100%",
          maxWidth: {
            xs: "350px",
            sm: "900px",
            md: "1300px",
          },
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
              onChange: (val) =>
                setSearchText(val),
              placeholder:
                "Search programs",
              visible: true,
            },
          ]}
          actions={[
            {
              label: "Export Excel",
              color: "secondary",
              startIcon:
                <FileDownloadIcon />,
              onClick: handleExportExcel,
            },
            {
              label: "Add Semester",
              color: "primary",
              onClick: () =>
                navigate(
                  "/semesters/add"
                ),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredSemesters.length ===
          0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            columns={[
              {
                key: "total_semesters",
                label:
                  "Total Semesters",
              },
              {
                key: "program_code",
                label: "Program Code",
              },
               {
                key: "department_code",
                label: "Department Code",
              },            
              
            ]}
            data={filteredSemesters}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        )}

        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={
            filteredSemesters.length
          }
          onPageChange={(newPage) =>
            setPage(newPage)
          }
        />
      </CardComponent>

      <CustomDialog
        open={openDelete}
        title="Delete Program Semesters"
        description={
          <>
            Are you sure you want to delete
            semesters for{" "}
            <strong>
              {
                selectedSemesters?.program_code
              }
            </strong>
            ?
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        onClose={handleCloseDelete}
        onConfirm={
          handleConfirmDelete
        }
      />
    </>
  );
}