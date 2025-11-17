import * as React from "react";
import { Typography, Box } from "@mui/material";
import CardComponent from "../../../components/card/Card";
import TablePagination from "../../../components/tablepagination/tablepagination";
import { NoDataFoundUI } from "../../../components/card/NoDataFoundUI";

export default function Examination() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [data, setData] = React.useState<any[]>([]);

  // ✅ Simulate fetching data (replace with API call)
  React.useEffect(() => {
    const fetchData = async () => {
      await new Promise((res) => setTimeout(res, 1000));
      setData([
      ]);
    };
    fetchData();
  }, []);


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

      {/* ✅ Conditional Rendering */}
      {data.length === 0 ? (
        // No Data Found
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
        <NoDataFoundUI />
        </Box>
      ) : (
        // ✅  TableData (placeholder list)
        <Box sx={{ py: 3 }}>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item) => (
              <Typography key={item.id} sx={{ py: 0.5 }}>
                {item.name}
              </Typography>
            ))}
        </Box>
      )}

      {/* ✅ Show pagination only if data exists */}
      {data.length > 0 && (
        <TablePagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={data.length}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </CardComponent>
  );
}
