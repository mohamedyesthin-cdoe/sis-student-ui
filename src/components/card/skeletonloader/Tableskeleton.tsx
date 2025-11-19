import {  Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import CardComponent from "../Card";

export default function TableSkeleton() {
  const columns = 6; // match your table columns
  const rows = 8;    // number of loading rows

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
      {/* Table Header Skeleton */}
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, idx) => (
              <TableCell key={idx}>
                <Skeleton variant="text" height={18} width="60%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body Skeleton */}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: columns }).map((__, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton variant="rectangular" height={18} width="80%" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardComponent>
  );
}
