import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Checkbox,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import theme from "../../../styles/theme";
import CardComponent from "../../../components/card/Card";
import ReusableTable from "../../../components/table/table";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../components/tablepagination/tablepagination";
import { ApiRoutes } from "../../../constants/ApiConstants";
import apiClient from "../../../services/ApiClient";
import { useGlobalError } from "../../../context/ErrorContext";
import TableSkeleton from "../../../components/card/skeletonloader/Tableskeleton";
import { useLoader } from "../../../context/LoaderContext";
import { NoDataFoundUI } from "../../../components/card/errorUi/NoDataFoundUI";
import { useNavigate } from "react-router-dom";

export default function FeesList() {
  const { clearError } = useGlobalError();
  const { loading } = useLoader();
  const navigate = useNavigate();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");
  const [fees, setFees] = React.useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = React.useState<number[]>([]);

  // --------------------------- API ---------------------------
  React.useEffect(() => {
    clearError();
    apiClient
      .get(ApiRoutes.GETSTUDENTSLIST)
      .then((res) => setFees(res.data || []))
      .catch(() => {});
  }, []);

  // ------------------------- FILTER --------------------------
  const filteredFees = React.useMemo(() => {
    return fees.filter((s) => {
      const text = `
        ${s.registration_no}
        ${s.first_name}
        ${s.last_name}
      `.toLowerCase();
      return text.includes(searchText.toLowerCase());
    });
  }, [fees, searchText]);

  // ---------------------- CHECKBOX --------------------------
  const toggleStudent = (id: number) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ---------------------- DOWNLOAD SELECTED -----------------
  const handleDownloadReceipts = async () => {
    if (selectedStudents.length === 0) return;

    try {
      const res = await apiClient.get(ApiRoutes.GETSTUDENTSLIST);
      const students = res.data || [];
      const selectedData = students.filter((s: any) =>
        selectedStudents.includes(s.id)
      );

      const zip = new JSZip();
      const rootFolder = zip.folder("receipts");

      for (const student of selectedData) {
        const studentFolder = rootFolder?.folder(`${student.registration_no}`);

        for (const payment of student.payments || []) {
          // Fetch receipt PDF from backend API
          const receiptUrl = `/fees/receipt/${payment.id}`;
          const response = await fetch(receiptUrl);
          const blob = await response.blob();

          studentFolder?.file(`receipt_${payment.id}.pdf`, blob);
        }
      }

      const finalBlob = await zip.generateAsync({ type: "blob" });
      saveAs(finalBlob, "receipts.zip");
    } catch (err) {
      console.error("Error downloading receipts:", err);
    }
  };

  return (
    <CardComponent sx={{ width: "100%", p: 3, mt: 3 }}>
      {/* ----------------- TOOLBAR ----------------- */}
      <TableToolbar
        filters={[
          {
            key: "search",
            label: "Search",
            type: "text",
            value: searchText,
            onChange: setSearchText,
            placeholder: "Search all fields",
            visible: true,
          },
        ]}
        actions={[
          {
            label: `Download Receipts (${selectedStudents.length})`,
            startIcon: <DownloadIcon />,
            disabled: selectedStudents.length == 0, // ✅ DISABLE WHEN NONE SELECTED
            onClick: handleDownloadReceipts,
          },
        ]}
      />

      {/* ----------------- TABLE ----------------- */}
      {loading ? (
        <TableSkeleton />
      ) : filteredFees.length === 0 ? (
        <NoDataFoundUI />
      ) : (
        <ReusableTable
          showSno={true}
          columns={[
            {
              key: "select",
              label: "",
              width: 50,
              render: (row) => (
                <Checkbox
                  size="small"
                  checked={selectedStudents.includes(row.id)}
                  onChange={() => toggleStudent(row.id)}
                />
              ),
            },
            {
              key: "sno",
              label: "S.No",
              render: (_row, index) => page * rowsPerPage + index + 1,
            },
            { key: "registration_no", label: "Registration No" },
            {
              key: "full_name",
              label: "Full Name",
              render: (r) => `${r.title} ${r.first_name} ${r.last_name}`,
            },
          ]}
          data={filteredFees}
          page={page}
          rowsPerPage={rowsPerPage}
          isRowExpandable={(row) =>
            Array.isArray(row.payments) && row.payments.length > 0
          }
          renderExpanded={(student) => (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Type", "Date", "Order", "Amount", "Status", "Receipt"].map(
                    (h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {student.payments?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.payment_type}</TableCell>
                    <TableCell>
                      {new Date(p.payment_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{p.order_id}</TableCell>
                    <TableCell>{p.payment_amount}</TableCell>
                    <TableCell>
                      <Chip label="Paid" size="small" color="success" />
                    </TableCell>
                    <TableCell>
                      {/* ✅ VisibilityIcon to view individual receipt */}
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/fees/receipt/${p.id}`, {
                            state: { studentId: student.id },
                          })
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        />
      )}

      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredFees.length}
        onPageChange={setPage}
      />
    </CardComponent>
  );
}
