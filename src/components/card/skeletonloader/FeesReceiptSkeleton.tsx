import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function FeesReceiptSkeleton() {
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
      {/* Logo Loader */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderBottom="1px solid #ddd"
        pb={2}
        mb={2}
      >
        <Skeleton variant="rectangular" width={120} height={70} />
      </Box>

      {/* Title */}
      <Skeleton
        variant="text"
        sx={{ mx: "auto", width: "140px", height: "28px", mb: 2 }}
      />

      {/* Info Grid Loader */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        border="1px solid #ddd"
        mb={2}
      >
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            p={1.2}
            display="flex"
            borderRight={{ sm: i % 2 === 1 ? "1px solid #ddd" : "none" }}
            borderTop={i >= 3 ? "1px solid #ddd" : "none"}
          >
            <Skeleton variant="text" width="40%" height={20} sx={{ mr: 2 }} />
            <Skeleton variant="text" width="60%" height={20} />
          </Box>
        ))}
      </Box>

      {/* Receipt Text */}
      <Box border="1px solid #ddd" p={1.5} mb={2}>
        <Skeleton variant="text" width="80%" height={22} sx={{ mx: "auto" }} />
        <Skeleton variant="text" width="60%" height={22} sx={{ mx: "auto", mt: 1 }} />
      </Box>

      {/* Table Loader */}
      <Box sx={{ overflowX: "auto", mb: 2 }}>
        <Table sx={{ border: "1px solid #ddd", minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Skeleton width={50} /></TableCell>
              <TableCell align="center"><Skeleton width={100} /></TableCell>
              <TableCell align="center"><Skeleton width={80} /></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell align="center"><Skeleton width={40} /></TableCell>
                <TableCell align="center"><Skeleton width={120} /></TableCell>
                <TableCell align="center"><Skeleton width={80} /></TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right" colSpan={2}>
                <Skeleton width={80} />
              </TableCell>
              <TableCell align="center">
                <Skeleton width={80} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Footer Info */}
      <Box border="1px solid #ddd" p={1.5} mb={2}>
        {[1, 2, 3].map((i) => (
          <Box key={i} display="flex" mb={0.5}>
            <Skeleton width="30%" height={18} sx={{ mr: 2 }} />
            <Skeleton width="50%" height={18} />
          </Box>
        ))}
      </Box>

      {/* Signature Area */}
      <Box textAlign="center" mb={1}>
        <Skeleton width={200} height={22} sx={{ mx: "auto" }} />
        <Skeleton width={280} height={22} sx={{ mx: "auto", mt: 1 }} />
        <Skeleton width={180} height={18} sx={{ mx: "auto", mt: 1 }} />
        <Skeleton width={200} height={18} sx={{ mx: "auto", mt: 1 }} />
      </Box>
    </Box>
  );
}
