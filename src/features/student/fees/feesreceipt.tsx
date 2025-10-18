import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import logo from "/assets/logo2.png";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { getValue } from "../../../utils/localStorageUtil";
import { toWords } from "number-to-words";

export default function FeesReceipt() {
  const { id } = useParams(); // Fee row ID
  const navigate = useNavigate();
  const studentId = getValue("student_id");
  const username = getValue("username");

  const [payments, setPayments] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [amountInWords, setAmountInWords] = useState<string>("");

  // ===== Fetch API =====
  const [orderId, setOrderId] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTFEES}/${studentId}`,
          method: "get",
        });

        if (response) {
          const filtered = (response as any[]).filter((p) => p.id.toString() === id);

          filtered.sort((a, b) => {
            if (a.payment_type === "application_fee") return -1;
            if (b.payment_type === "application_fee") return 1;
            return 0;
          });

          setPayments(filtered);

          if (filtered.length > 0 && filtered[0].payment_date) {
            setOrderId(filtered[0].order_id);
            const date = new Date(filtered[0].payment_date);
            const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
              date.getMonth() + 1
            ).padStart(2, "0")}/${date.getFullYear()}`;
            setPaymentDate(formattedDate);
          }

          // Calculate total
          let total = 0;
          filtered.forEach((p) => {
            if (p.payment_type === "application_fee") total += p.payment_amount;
            if (p.payment_type === "semester_fee" && p.semester_fee) {
              const sf = p.semester_fee;
              total += sf.tuition_fee + sf.lab_fee + sf.lms_fee + sf.exam_fee + 1000;
            }
          });
          if (total > 0) {
            const words = toWords(total);
            setAmountInWords(`a sum of Rupees ${words.charAt(0).toUpperCase() + words.slice(1)} Only`);
          }
          setTotalAmount(total);
        }
      } catch (err) {
        console.error("Failed to fetch fees", err);
        navigate("/students/list");
      }
    };

    if (id) fetchFees();
  }, [id, navigate, studentId]);

  // ===== Build Table Rows =====
  const feeRows: { sno: number; towards: string; amount: number }[] = [];
  let sno = 1;

  payments.forEach((p) => {
    if (p.payment_type === "application_fee") {
      feeRows.push({
        sno: sno++,
        towards: "Application Fee",
        amount: p.payment_amount,
      });
    } else if (p.payment_type === "semester_fee" && p.semester_fee) {
      const sf = p.semester_fee;
      const admissionFee = 1000;

      feeRows.push(
        { sno: sno++, towards: "Tuition Fee", amount: sf.tuition_fee },
        { sno: sno++, towards: "Lab Fee", amount: sf.lab_fee },
        { sno: sno++, towards: "LMS Fee", amount: sf.lms_fee },
        { sno: sno++, towards: "Exam Fee", amount: sf.exam_fee },
        { sno: sno++, towards: "Admission Fee", amount: admissionFee }
      );
    }
  });


  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "100%",
        maxWidth: { xs: "95%", sm: "90%", md: "1300px" },
        borderRadius: "8px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        p: { xs: 2, sm: 3, md: 4 },
        overflow: "hidden",
        mx: "auto",
        my: 2,
      }}
    >
      {/* ===== Header ===== */}
      <Box display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #ddd" pb={2} mb={2} flexWrap="wrap">
        <Box component="img" src={logo} alt="logo" sx={{ height: { xs: 60, sm: 80, md: 100 }, objectFit: "contain" }} />
        <Box sx={{ flex: 1, textAlign: "center", ml: { xs: -4, sm: -6 } }}>
          <Typography fontWeight="bold" fontSize={{ xs: "16px", sm: "18px", md: "20px" }}>SRI RAMACHANDRA</Typography>
          <Typography fontWeight="bold" fontSize={{ xs: "14px", sm: "16px", md: "18px" }}>INSTITUTE OF HIGHER EDUCATION & RESEARCH</Typography>
          <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>(Deemed to be University)</Typography>
          <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>PORUR, CHENNAI - 600 0116</Typography>
        </Box>
        <Box sx={{ width: { xs: 40, sm: 80, md: 100 } }} />
      </Box>

      {/* ===== Title ===== */}
      <Typography textAlign="center" fontWeight="bold" sx={{ textDecoration: "underline", mb: 2, fontSize: { xs: "14px", sm: "16px" } }}>FEE RECEIPT</Typography>



      {/* ===== Programme Info ===== */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        border="1px solid #ddd"
        mb={2}
      >
        {[
          ["Programme :", "Bachelor Of Science (Hons) (Data Science)"],
          ["Order ID :", orderId || "-"],
          ["Batch :", "July - 2025"],
          ["Date :", paymentDate || "-"],  // <-- from API
        ].map(([label, value], i) => (
          <Box
            key={label}
            p={1.2}
            display="flex"
            borderRight={{
              xs: "none",
              sm: i % 2 === 0 ? "1px solid #ddd" : "none",
            }}
            borderTop={i >= 2 ? "1px solid #ddd" : "none"}
          >
            <Typography fontWeight="bold" sx={{ width: { xs: "100px", sm: "120px" } }}>
              {label}
            </Typography>
            <Typography>{value}</Typography>
          </Box>
        ))}


      </Box>

      {/* ===== Acknowledgment ===== */}
      <Box
        border="1px solid #ddd"
        p={1.5}
        mb={2}
        textAlign="center"
        sx={{ fontSize: { xs: "13px", sm: "15px" } }}
      >
        <Typography fontWeight="bold">
          Received with thanks from {username} / Bachelor Of Science (Hons) (Data Science) July - 2025
        </Typography>
        <Typography fontWeight="bold">
          {amountInWords || "-"}
        </Typography>
      </Box>


      {/* ===== Fee Table ===== */}
      <Box sx={{ overflowX: "auto", mb: 2 }}>
        <Table sx={{ border: "1px solid #ddd", minWidth: 400 }}>
          <TableHead>
            <TableRow>
              {["Sno", "Towards", "Amount (in Rs)"].map((head) => (
                <TableCell
                  key={head}
                  align="center"
                  sx={{ border: "1px solid #ddd", fontWeight: "bold" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {feeRows.map((row) => (
              <TableRow key={row.sno}>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{row.sno}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{row.towards}</TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>{row.amount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} align="right" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>Total</TableCell>
              <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>{totalAmount.toLocaleString()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>


      {/* ===== Payment Info ===== */}
      {/* ===== Payment Info ===== */}
      <Box border="1px solid #ddd" p={1.5} mb={2}>
        <Typography fontWeight="bold" mb={1}>
          FEE FOR THE ACAD. YEAR July - 2025
        </Typography>
        {payments.length > 0 && (
          <>
            <Box display="flex" mb={0.5}>
              <Typography fontWeight="bold" sx={{ width: { xs: "120px", sm: "160px" } }}>
                Mode :
              </Typography>
              <Typography>{payments[0].payment_mode || "ONLINE"}</Typography>
            </Box>
            <Box display="flex" mb={0.5}>
              <Typography fontWeight="bold" sx={{ width: { xs: "120px", sm: "160px" } }}>
                Date :
              </Typography>
              <Typography>
                {payments[0].payment_date
                  ? new Date(payments[0].payment_date).toLocaleDateString("en-GB")
                  : "-"}
              </Typography>
            </Box>
            <Box display="flex" mb={0.5}>
              <Typography fontWeight="bold" sx={{ width: { xs: "120px", sm: "160px" } }}>
                Transaction ID :
              </Typography>
              <Typography>{payments[0].transaction_id || "-"}</Typography>
            </Box>
          </>
        )}
      </Box>


      {/* ===== Signature ===== */}
      <Box textAlign="center" mb={1}>
        <Typography fontWeight="bold">SRI RAMACHANDRA</Typography>
        <Typography fontWeight="bold">INSTITUTE OF HIGHER EDUCATION & RESEARCH</Typography>
        <Typography fontSize={{ xs: "12px", sm: "13px" }}>(Deemed to be University)</Typography>
        <Typography fontWeight="bold" mt={1}>Authorized Signatory</Typography>
        <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>(Electronically generated. No Signature required)</Typography>
      </Box>

      {/* ===== Print Button ===== */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ fontSize: { xs: "12px", sm: "14px" }, px: { xs: 2, sm: 3 }, py: { xs: 0.8, sm: 1 } }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
}
