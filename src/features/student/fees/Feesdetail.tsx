import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CardComponent from "../../../components/card/Card";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import TablePagination from "../../../components/tablepagination/tablepagination";
import ReusableTable from "../../../components/table/table";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { exportToExcel } from "../../../constants/excelExport";
import { getValue } from "../../../utils/localStorageUtil";
import { useLoader } from "../../../context/LoaderContext";
import TableSkeleton from "../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../components/card/errorUi/NoDataFoundUI";

export default function FeesDetail() {
  const navigate = useNavigate();
  const student_id = getValue("student_id");

  const [payments, setPayments] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [showSearch] = React.useState(true);
  const { loading } = useLoader();


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
      <>

        {/* Search and Export Toolbar */}
        <TableToolbar
          filters={[
            {
              key: "search",
              label: "Search Fees",
              type: "text",
              value: searchText,
              onChange: (val) => setSearchText(val),
              placeholder: "Search all fields",
              visible: showSearch, // ✅ toggle visibility
            },
          ]}
          actions={[
            {
              label: "Export Excel",
              color: "secondary",
              startIcon: <FileDownloadIcon />,
              onClick: handleExportExcel,
            },
          ]}
        />
        {
          loading ? (
            <TableSkeleton />
          )
            : (
              <>
                {
                  filteredPayments.length === 0 ? (
                    <NoDataFoundUI />
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
                  )
                }
              </>
            )}
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
      </>

    </CardComponent>
  );
}
