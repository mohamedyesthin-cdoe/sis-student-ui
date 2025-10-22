import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CardComponent from "../../../components/card/Card";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../components/tablepagination/tablepagination";
import ReusableTable from "../../../components/table/table";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { exportToExcel } from "../../../constants/excelExport";
import { getValue } from "../../../utils/localStorageUtil";

export default function FeesDetail() {
  const navigate = useNavigate();
  const student_id  = getValue("student_id");
  
  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  // Fetch student fees
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTFEES}/${student_id}`,
          method: "get",
        });
        if (response) {
          // Add formatted date
          const formatted = (response as any[]).map((p) => ({
            ...p,
            formattedDate: new Date(p.payment_date).toLocaleDateString("en-GB"), // dd/mm/yyyy
          }));
          setPayments(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch fees", err);
      }
    };
    if (student_id) fetchFees();
  }, [student_id, navigate]);

  // Filter payments by search text
  const filteredPayments = payments.filter((p) => {
    const combinedText = `${p.order_id} ${p.payment_type} ${p.payment_amount} ${p.formattedDate}`.toLowerCase();
    return combinedText.includes(searchText.toLowerCase());
  });

  // Export to Excel
  const handleExportExcel = () => {
    exportToExcel(
      filteredPayments,
      [
        { header: "Order ID", key: "order_id" },
        { header: "Fees Type", key: "payment_type" },
        { header: "Amount", key: "payment_amount" },
        { header: "Fees Date", key: "formattedDate" },
      ],
      "Student Fees",
      "Fees"
    );
  };


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
      {/* Search and Export Toolbar */}
      <TableToolbar
        searchText={searchText}
        onSearchChange={(val) => {
          setSearchText(val);
          setPage(0);
        }}
        searchPlaceholder="Search all fields"
        actions={[
          {
            label: "Export Excel",
            color: "secondary",
            startIcon: <FileDownloadIcon />,
            onClick: handleExportExcel,
          },
        ]}
      />

      {/* Table */}
      {filteredPayments.length === 0 ? (
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
          <SearchOffIcon sx={{ fontSize: 50, mb: 1, color: "grey.500" }} />
          <Typography variant="h6">No records found</Typography>
          <Typography variant="body2" color="text.secondary">
            Please check your search or filters.
          </Typography>
        </Box>
      ) : (
        <ReusableTable
          columns={[
            { key: "order_id", label: "Order ID" },
            { key: "payment_type", label: "Fees Type" },
            { key: "payment_amount", label: "Fees Amount" },
            { key: "formattedDate", label: "Fees Date" },
          ]}
          data={filteredPayments}
          page={page}
          rowsPerPage={rowsPerPage}
          isRowExpandable={(row) => row.payment_type === "semester_fee"}
          renderExpanded={(row) =>
            row.semester_fee ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Semester", "Tuition Fee", "Exam Fee", "LMS Fee", "Lab Fee", "Total Fee"].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600 }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.semester_fee.semester}</TableCell>
                    <TableCell>{row.semester_fee.tuition_fee}</TableCell>
                    <TableCell>{row.semester_fee.exam_fee}</TableCell>
                    <TableCell>{row.semester_fee.lms_fee}</TableCell>
                    <TableCell>{row.semester_fee.lab_fee}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{row.semester_fee.total_fee}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : null
          }
          actions={[
            {
              label: "View",
              icon: <VisibilityIcon fontSize="small" />,
              onClick: (row) => {
                navigate(`/fees/receipt/${row.id}`);
              },
              color: "secondary",
            },
          ]}
        />
      )}

      {/* Pagination */}
      <TablePagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredPayments.length}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(newRowsPerPage) => {
          setRowsPerPage(newRowsPerPage);
          setPage(0);
        }}
      />
    </CardComponent>
  );
}
