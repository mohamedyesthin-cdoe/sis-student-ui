import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
import apiClient from "../../../services/ApiClient";
import { useGlobalError } from "../../../context/ErrorContext";

export default function ProgramList() {
  const navigate = useNavigate();
  const handleView = () => navigate(`/programs/add`);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [programs, setPrograms] = React.useState<any[]>([]);

  // ----------------------------------------------------------
  // API CALL
  // ----------------------------------------------------------
  React.useEffect(() => {
    const fetchData = async () => {
      apiClient.get(ApiRoutes.GETPROGRAMLIST)
        .then(res => {
          setPrograms(res.data);
        })
        .catch()

        .finally();
    };

    fetchData();
  }, []);
  const { error } = useGlobalError();

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

  {
    error.type === "NO_DATA" && (
      <TableToolbar
        actions={[
          {
            label: "Add Program",
            color: "primary",
            onClick: handleView,
          },
        ]}
      />
    )
  }
  // ----------------------------------------------------------
  // 🎯 MAIN UI – only when data exists
  // ----------------------------------------------------------
  return (
    <>
      {error.type == "NONE" && (
        <CardComponent
          sx={{
            width: '100%',
            maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
            mx: 'auto',
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
                label: "Add Program",
                color: "primary",
                onClick: handleView,
              },
            ]}
          />
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
          <TablePagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={filteredPrograms.length}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </CardComponent>
      )}
    </>
  );
}
