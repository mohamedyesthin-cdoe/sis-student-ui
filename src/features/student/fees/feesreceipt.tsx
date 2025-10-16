import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import logo from "/assets/logo2.png";

export default function FeesReceipt() {
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
          mx:'auto',
          my:2
        }}
      >
        {/* ===== Header ===== */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid #ddd"
          pb={2}
          mb={2}
          flexWrap="wrap"
        >
          {/* Left: Logo */}
          <Box
            component="img"
            src={logo}
            alt="logo"
            sx={{
              height: { xs: 60, sm: 80, md: 100 },
              objectFit: "contain",
            }}
          />

          {/* Center: Text */}
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              ml: { xs: -4, sm: -6 },
            }}
          >
            <Typography
              fontWeight="bold"
              fontSize={{ xs: "16px", sm: "18px", md: "20px" }}
            >
              SRI RAMACHANDRA
            </Typography>
            <Typography
              fontWeight="bold"
              fontSize={{ xs: "14px", sm: "16px", md: "18px" }}
            >
              INSTITUTE OF HIGHER EDUCATION & RESEARCH
            </Typography>
            <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>
              (Deemed to be University)
            </Typography>
            <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>
              PORUR, CHENNAI - 600 0116
            </Typography>
          </Box>

          {/* Right: Placeholder */}
          <Box sx={{ width: { xs: 40, sm: 80, md: 100 } }} />
        </Box>

        {/* ===== Title ===== */}
        <Typography
          textAlign="center"
          fontWeight="bold"
          sx={{
            textDecoration: "underline",
            mb: 2,
            fontSize: { xs: "14px", sm: "16px" },
          }}
        >
          FEE RECEIPT
        </Typography>

        {/* ===== Programme Info ===== */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          border="1px solid #ddd"
          mb={2}
        >
          {[
            ["Programme :", "BSC(ETCT)"],
            ["Receipt No :", "43723"],
            ["Batch :", "2022-2023"],
            ["Date :", "07-JAN-23"],
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
              <Typography
                fontWeight="bold"
                sx={{ width: { xs: "100px", sm: "120px" } }}
              >
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
            Received with thanks from BALAJI U / BSC(ETCT) 2022-2023
          </Typography>
          <Typography fontWeight="bold">
            a sum of Rupees Twenty Five Thousand Only
          </Typography>
        </Box>

        {/* ===== Fee Table ===== */}
        <Box sx={{ overflowX: "auto", mb: 2 }}>
          <Table sx={{ border: "1px solid #ddd", minWidth: 500 }}>
            <TableHead>
              <TableRow>
                {["Sno", "Code", "Towards", "Amount (in Rs)"].map((head) => (
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
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  1
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  30001
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  TUITION FEES
                </TableCell>
                <TableCell align="center" sx={{ border: "1px solid #ddd" }}>
                  25,000.00
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  colSpan={3}
                  align="right"
                  sx={{ border: "1px solid #ddd", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ border: "1px solid #ddd", fontWeight: "bold" }}
                >
                  25,000.00
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* ===== Payment Info ===== */}
        <Box border="1px solid #ddd" p={1.5} mb={2}>
          <Typography fontWeight="bold" mb={1}>
            FEE FOR THE ACAD. YEAR 2022-2023
          </Typography>
          {[
            ["Mode :", "CASH"],
            ["Date :", "-"],
            ["Transaction no / DD no :", "-"],
          ].map(([label, value]) => (
            <Box display="flex" mb={0.5} key={label}>
              <Typography
                fontWeight="bold"
                sx={{ width: { xs: "120px", sm: "160px" } }}
              >
                {label}
              </Typography>
              <Typography>{value}</Typography>
            </Box>
          ))}
        </Box>

        {/* ===== Signature ===== */}
        <Box textAlign="center" mb={1}>
          <Typography fontWeight="bold">SRI RAMACHANDRA</Typography>
          <Typography fontWeight="bold">
            INSTITUTE OF HIGHER EDUCATION & RESEARCH
          </Typography>
          <Typography fontSize={{ xs: "12px", sm: "13px" }}>
            (Deemed to be University)
          </Typography>
          <Typography fontWeight="bold" mt={1}>
            Authorized Signatory
          </Typography>
          <Typography fontSize={{ xs: "12px", sm: "13px" }} mt={0.5}>
            (Electronically generated. No Signature required)
          </Typography>
        </Box>

        {/* ===== Print Button ===== */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{
              fontSize: { xs: "12px", sm: "14px" },
              px: { xs: 2, sm: 3 },
              py: { xs: 0.8, sm: 1 },
            }}
          >
            Print
          </Button>
        </Box>
      </Box>
  );
}
