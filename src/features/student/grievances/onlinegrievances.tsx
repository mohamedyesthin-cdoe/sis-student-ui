// import * as React from "react";
// import { Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import CardComponent from "../../../components/card/Card";
// import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
// import TablePagination from "../../../components/tablepagination/tablepagination";
// import { NoDataFoundUI } from "../../../components/card/errorUi/NoDataFoundUI";

import { useNavigate } from "react-router-dom";
import CardComponent from "../../../components/card/Card";
import { ComingSoonUI } from "../../../components/card/errorUi/ComingSoonUI";
import { useGlobalError } from "../../../context/ErrorContext";
import TableToolbar from "../../../components/tabletoolbar/tableToolbar";
import { NoDataFoundUI } from "../../../components/card/errorUi/NoDataFoundUI";

// export default function Onlinegrievances() {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage] = React.useState(10);
//   const [searchText, setSearchText] = React.useState("");
//   const [showSearch] = React.useState(false);
//   const [data, setData] = React.useState<any[]>([]);
//   const navigate = useNavigate();

//   // ✅ Simulate fetching data (replace with API call)
//   React.useEffect(() => {
//     const fetchData = async () => {
//       await new Promise((res) => setTimeout(res, 1000)); // simulate API delay
//       // Uncomment to test different states
//       // setData([]); // No data
//       setData([
//         // { id: 1, name: "Network Issue" },
//         // { id: 2, name: "Login Problem" },
//         // { id: 3, name: "Course Access Issue" },
//       ]);
//     };
//     fetchData();
//   }, []);

//   const handleView = () => navigate(`/grievances/add`);

//   return (
//     <CardComponent
//       sx={{
//         width: "100%",
//         maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
//         mx: "auto",
//         p: 3,
//         mt: 3,
//       }}
//     >
//       {/* ✅ Toolbar with Search Toggle */}
//       {data.length > 0 && (
//         <TableToolbar
//           filters={[
//             {
//               key: "search",
//               label: "Search Grievances",
//               type: "text",
//               value: searchText,
//               onChange: (val) => setSearchText(val),
//               placeholder: "Search Grievances...",
//               visible: showSearch, // ✅ controlled visibility
//             },
//           ]}
//           actions={[
//             {
//               label: "Add Grievance",
//               color: "primary",
//               onClick: handleView,
//             },
//           ]}
//         />
//       )}

//       {/* ✅ Conditional Rendering */}
//       {data.length === 0 ? (
//         // No Data Found
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             py: 8,
//             color: "text.secondary",
//           }}
//         >
//           <NoDataFoundUI />
//         </Box>
//       ) : (
//         // ✅  TableData (placeholder list)
//         <Box sx={{ py: 3 }}>
//           {data
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map((item) => (
//               <Typography key={item.id} sx={{ py: 0.5 }}>
//                 {item.name}
//               </Typography>
//             ))}
//         </Box>
//       )}

//       {/* ✅ Show pagination only if data exists */}
//       {data.length > 0 && (
//         <TablePagination
//           page={page}
//           rowsPerPage={rowsPerPage}
//           totalCount={data.length}
//           onPageChange={(newPage) => setPage(newPage)}
//         />
//       )}
//     </CardComponent>
//   );
// }
// import CardComponent from "../../../components/card/Card";
// import { ComingSoonUI } from "../../../components/card/errorUi/ComingSoonUI";
// import { useGlobalError } from "../../../context/ErrorContext";

export default function Onlinegrievances() {
  const { error } = useGlobalError();
  const navigate = useNavigate();
  const handleView = () => navigate(`/grievances/add`);


  return (
    <>
      {error.type === "NONE" && (
        <CardComponent
          sx={{
            width: "100%",
            maxWidth: { xs: "350px", sm: "900px", md: "1300px" },
            mx: "auto",
            p: 3,
            mt: 3,
          }}
        >
          <TableToolbar
            actions={[
              {
                label: "Add Grievance",
                color: "primary",
                onClick: handleView,
              },
            ]}
          />
          <NoDataFoundUI />
        </CardComponent>
      )}
    </>
  )
}
