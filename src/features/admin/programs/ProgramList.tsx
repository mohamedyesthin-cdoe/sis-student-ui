import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import theme from "../../../styles/theme";
import CardComponent from "../../../components/card/Card";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../../components/table/table";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../components/tablepagination/tablepagination";
import { exportToExcel } from "../../../constants/excelExport";
import { ApiRoutes } from "../../../constants/ApiConstants";

import TableSkeleton from "../../../components/card/tableskeleton";
import { ConnectionLostUI } from "../../../components/card/connectionlost";
import { NoDataFoundUI } from "../../../components/card/NoDataFoundUI";
import apiClient from "../../../services/ApiClient";

export default function ProgramList() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");

  const [loading, setLoading] = React.useState(true);
  const [errorStatus, setErrorStatus] = React.useState<number | null>(null);
  const [programs, setPrograms] = React.useState<any[]>([]);

  // ----------------------------------------------------------
  // API CALL
  // ----------------------------------------------------------
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorStatus(null);
      apiClient.get(ApiRoutes.GETPROGRAMLIST)
        .then(res => {
          setPrograms(res.data);
        })
        .catch(err => {
          if (err.type === "NETWORK_OFFLINE") {
            setErrorStatus(0); // show connection lost
          }
          else if (err.type === "API_UNREACHABLE") {
            setErrorStatus(500); // backend not reachable → server error UI
          }
          else if (err.type === "TIMEOUT") {
            setErrorStatus(500);
          }
          else if (err.type === "NOT_FOUND") {
            setErrorStatus(404);
          }
          else if (err.type === "SERVER_ERROR") {
            setErrorStatus(500);
          }
        })

        .finally(() => setLoading(false));
    };

    fetchData();
  }, []);


  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------
  const filteredPrograms = programs.filter((c) => {
    const combined = `${c.programe_code} ${c.programe} ${c.duration}`.toLowerCase();
    return combined.includes(searchText.toLowerCase());
  });

  // ----------------------------------------------------------
  // EXPORT FUNCTION
  // ----------------------------------------------------------
  const handleExportExcel = () => {
    exportToExcel(
      filteredPrograms,
      [
        { header: "S.No", key: "sno" },
        { header: "Program ID", key: "programe_code" },
        { header: "Program Name", key: "programe" },
        { header: "Duration", key: "duration" },
      ],
      "Programs",
      "Programs"
    );
  };

  // ----------------------------------------------------------
  // 🌐 CONDITIONAL UI FROM STATUS CODE
  // ----------------------------------------------------------

  // 1️⃣ Loading – show skeleton
  if (loading) {
    return <TableSkeleton />;
  }

  // 2️⃣ Connection Lost
  if (errorStatus === 0) {
    return (
      <CardComponent sx={{ p: 4, mt: 3 }}>
        <ConnectionLostUI />
      </CardComponent>
    );
  }

  // 3️⃣ Server error (404, 500, etc)
  if (errorStatus && errorStatus !== 0) {
    return (
      <CardComponent sx={{ p: 4, mt: 3 }}>
        <NoDataFoundUI
        />
      </CardComponent>
    );
  }

  // 4️⃣ No Data Found (200 but empty)
  if (!loading && programs.length === 0) {
    return (
      <CardComponent sx={{ p: 4, mt: 3 }}>
        <NoDataFoundUI
        />
      </CardComponent>
    );
  }

  // ----------------------------------------------------------
  // 🎯 MAIN UI – only when data exists
  // ----------------------------------------------------------
  return (
    <CardComponent
      sx={{
        width: "100%",
        maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
        mx: "auto",
        p: 3,
        mt: 3,
      }}
    >
      {/* SHOW FILTER ONLY WHEN DATA EXISTS */}
      {filteredPrograms.length > 0 && (
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
              label: "Add Program",
              color: "primary",
              onClick: handleView,
            },
          ]}
        />
      )}

      {/* WHEN FILTER RESULT EMPTY — ONLY SHOW ADD BUTTON */}
      {filteredPrograms.length === 0 && (
        <TableToolbar
          actions={[
            {
              label: "Add Program",
              color: "primary",
              onClick: handleView,
            },
          ]}
        />
      )}

      {/* TABLE OR EMPTY UI */}
      {filteredPrograms.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <NoDataFoundUI />
        </Box>
      ) : (
        <ReusableTable
          columns={[
            { key: "programe_code", label: "Program ID" },
            { key: "programe", label: "Program Name" },
            { key: "duration", label: "Duration" },
          ]}
          data={filteredPrograms}
          page={page}
          rowsPerPage={rowsPerPage}
          isRowExpandable={(row) => Array.isArray(row.fee) && row.fee.length > 0}
          renderExpanded={(program) => (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    "Semester",
                    "Application Fee",
                    "Admission Fee",
                    "Tuition Fee",
                    "Exam Fee",
                    "LMS Fee",
                    "Lab Fee",
                    "Total Fee",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.secondary.main,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {program.fee?.map((fee: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ py: 0.5 }}>{fee.semester || `Semester ${idx + 1}`}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.application_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.admission_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.tuition_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.exam_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.lms_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5 }}>{fee.lab_fee || "-"}</TableCell>
                    <TableCell sx={{ py: 0.5, fontWeight: "bold" }}>
                      {fee.total_fee || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          actions={[
            {
              label: "Edit",
              icon: <EditIcon fontSize="small" />,
              onClick: (row) => navigate(`/programs/add/${row.id}`),
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
      )}

      {/* PAGINATION */}
      {filteredPrograms.length > 0 && (
        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={filteredPrograms.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </CardComponent>
  );
}
