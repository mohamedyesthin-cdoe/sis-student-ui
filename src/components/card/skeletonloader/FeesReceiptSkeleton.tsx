import { Box, Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export default function FeesReceiptSkeleton() {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "100%",
        maxWidth: { xs: "95%", sm: "90%", md: "1300px" },
        borderRadius: "10px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
        mb={3}
      >
        <Skeleton variant="rectangular" width={120} height={70} />
      </Box>

      {/* Title */}
      <Skeleton
        variant="text"
        sx={{ mx: "auto", width: "150px", height: 30, mb: 3 }}
      />

      {/* Info Grid */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
        border="1px solid #ddd"
        mb={3}
      >
        {[1, 2, 3, 4].map((i) => (
          <Box
            key={i}
            p={1.5}
            display="flex"
            alignItems="center"
            borderRight={{ sm: i % 2 === 1 ? "1px solid #ddd" : "none" }}
            borderTop={i >= 3 ? "1px solid #ddd" : "none"}
          >
            <Skeleton variant="text" width="35%" height={20} sx={{ mr: 2 }} />
            <Skeleton variant="text" width="55%" height={20} />
          </Box>
        ))}
      </Box>

      {/* Receipt Text */}
      <Box border="1px solid #ddd" p={2} mb={3}>
        <Skeleton variant="text" width="80%" height={24} sx={{ mx: "auto" }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto", mt: 1 }} />
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: "auto", mb: 3 }}>
        <Table sx={{ border: "1px solid #ddd", minWidth: 450 }}>
          <TableHead>
            <TableRow>
              <TableCell align="center"><Skeleton width={50} height={20} /></TableCell>
              <TableCell align="center"><Skeleton width={100} height={20} /></TableCell>
              <TableCell align="center"><Skeleton width={80} height={20} /></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell align="center"><Skeleton width={45} height={20} /></TableCell>
                <TableCell align="center"><Skeleton width={120} height={20} /></TableCell>
                <TableCell align="center"><Skeleton width={85} height={20} /></TableCell>
              </TableRow>
            ))}

            {/* Total Row */}
            <TableRow>
              <TableCell align="right" colSpan={2}>
                <Skeleton width={80} height={22} sx={{ ml: "auto" }} />
              </TableCell>
              <TableCell align="center">
                <Skeleton width={90} height={22} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Footer Info */}
      <Box border="1px solid #ddd" p={2} mb={3}>
        {[1, 2, 3].map((i) => (
          <Box key={i} display="flex" alignItems="center" mb={1}>
            <Skeleton width="30%" height={18} sx={{ mr: 2 }} />
            <Skeleton width="50%" height={18} />
          </Box>
        ))}
      </Box>

      {/* Signature Section */}
      <Box textAlign="center" mb={1}>
        <Skeleton width={220} height={24} sx={{ mx: "auto" }} />
        <Skeleton width={260} height={24} sx={{ mx: "auto", mt: 1 }} />
        <Skeleton width={180} height={20} sx={{ mx: "auto", mt: 1 }} />
        <Skeleton width={200} height={20} sx={{ mx: "auto", mt: 1 }} />
      </Box>
    </Box>
  );
}
