import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Box } from "@mui/material";
import CardComponent from "../Card";

export default function TableSkeleton() {
  const columns = 6;
  const rows = 8;

  return (
    <CardComponent
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: "900px", md: "1300px" },
        mx: "auto",
        p: { xs: 2, sm: 3 },
        mt: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: columns }).map((_, idx) => (
                <TableCell key={idx}>
                  <Box sx={{ width: { xs: "80%", sm: "60%" } }}>
                    <Skeleton variant="text" height={20} width="100%" />
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <TableRow key={rowIdx}>
                {Array.from({ length: columns }).map((__, colIdx) => (
                  <TableCell key={colIdx}>
                    <Box sx={{ width: { xs: "90%", sm: "80%" } }}>
                      <Skeleton variant="rectangular" height={20} width="100%" />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </CardComponent>
  );
}
