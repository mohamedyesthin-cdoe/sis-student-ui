import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import logo from '/assets/logo2.png';
export default function FeesReceipt() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "100%",
        maxWidth: { xs: '350px', sm: '900px', md: '1300px' },
        borderRadius: "8px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        p: 3,
        mx: 'auto',
        minHeight: "100vh",
        my:3
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid #ddd" pb={1} mb={2}>
        <Box component="img" src={logo} alt="logo" sx={{ height: 100, objectFit: "contain" }} />
        <Box textAlign="center" flex={1}>
          <Typography fontWeight="bold" fontSize="18px">
            SRI RAMACHANDRA
          </Typography>
          <Typography fontWeight="bold" fontSize="16px">
            INSTITUTE OF HIGHER EDUCATION & RESEARCH
          </Typography>
          <Typography fontSize="13px" mt={0.5}>
            (Deemed to be University)
          </Typography>
          <Typography fontSize="13px" mt={0.5}>
            PORUR, CHENNAI - 600 0116
          </Typography>
        </Box>
      </Box>

      {/* Fee Receipt Title */}
      <Typography
        textAlign="center"
        fontWeight="bold"
        sx={{ textDecoration: "underline", mb: 2 }}
      >
        FEE RECEIPT
      </Typography>

      {/* Programme, Receipt No, Batch, Date */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" border="1px solid #ddd" mb={2}>
        <Box borderRight="1px solid #ddd" p={1.2} display="flex">
          <Typography fontWeight="bold" sx={{ width: "120px" }}>
            Programme :
          </Typography>
          <Typography>BSC(ETCT)</Typography>
        </Box>
        <Box p={1.2} display="flex">
          <Typography fontWeight="bold" sx={{ width: "120px" }}>
            Receipt No :
          </Typography>
          <Typography>43723</Typography>
        </Box>
        <Box borderTop="1px solid #ddd" borderRight="1px solid #ddd" p={1.2} display="flex">
          <Typography fontWeight="bold" sx={{ width: "120px" }}>
            Batch :
          </Typography>
          <Typography>2022-2023</Typography>
        </Box>
        <Box borderTop="1px solid #ddd" p={1.2} display="flex">
          <Typography fontWeight="bold" sx={{ width: "120px" }}>
            Date :
          </Typography>
          <Typography>07-JAN-23</Typography>
        </Box>
      </Box>

      {/* Thanks message */}
      <Box
        border="1px solid #ddd"
        p={1.5}
        mb={2}
        textAlign="center"
      >
        <Typography fontWeight="bold">
          Received with thanks from BALAJI U / BSC(ETCT) 2022-2023
        </Typography>
        <Typography fontWeight="bold">
          a sum of Rupees Twenty Five Thousand Only
        </Typography>
      </Box>

      {/* Fee Table */}
      <Table sx={{ border: "1px solid #ddd", mb: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              Sno
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              Code
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              Towards
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              Amount (in Rs)
            </TableCell>
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
            <TableCell colSpan={3} align="right" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              Total
            </TableCell>
            <TableCell align="center" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
              25,000.00
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Footer Info */}
      <Box border="1px solid #ddd" p={1.5} mb={2}>
        <Typography fontWeight="bold" mb={1}>
          FEE FOR THE ACAD. YEAR 2022-2023
        </Typography>
        <Box display="flex" mb={0.5}>
          <Typography fontWeight="bold" sx={{ width: "160px" }}>
            Mode :
          </Typography>
          <Typography>CASH</Typography>
        </Box>
        <Box display="flex" mb={0.5}>
          <Typography fontWeight="bold" sx={{ width: "160px" }}>
            Date :
          </Typography>
          <Typography>-</Typography>
        </Box>
        <Box display="flex" mb={0.5}>
          <Typography fontWeight="bold" sx={{ width: "160px" }}>
            Transaction no / DD no :
          </Typography>
          <Typography>-</Typography>
        </Box>
      </Box>

      {/* Signature */}
      <Box textAlign="center" mb={1}>
        <Typography fontWeight="bold">SRI RAMACHANDRA</Typography>
        <Typography fontWeight="bold">INSTITUTE OF HIGHER EDUCATION & RESEARCH</Typography>
        <Typography fontSize="13px">(Deemed to be University)</Typography>
        <Typography fontWeight="bold" mt={1}>
          Authorized Signatory
        </Typography>
        <Typography fontSize="13px" mt={0.5}>
          (Electronically generated. No Signature required)
        </Typography>
      </Box>

      {/* Print Button */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
}
