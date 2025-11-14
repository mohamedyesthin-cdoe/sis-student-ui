// import React, { useState } from "react";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   Collapse,
//   Box,
//   useTheme,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// interface Column {
//   key: string;
//   label: string;
//   align?: "left" | "center" | "right";
//   render?: (row: any, index: number) => React.ReactNode;
// }

// interface TableAction {
//   label: string;
//   icon?: React.ReactNode;
//   onClick: (row: any) => void;
//   color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
// }

// interface ReusableTableProps {
//   columns: Column[];
//   data: any[];
//   page: number;
//   rowsPerPage: number;
//   actions?: TableAction[];
//   renderExpanded?: (row: any) => React.ReactNode;
// }

// const ReusableTable: React.FC<ReusableTableProps> = ({
//   columns,
//   data,
//   page,
//   rowsPerPage,
//   actions = [],
//   renderExpanded,
// }) => {
//   const theme = useTheme();

//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
//   const [selectedRow, setSelectedRow] = useState<any>(null);
//   const [expandedRow, setExpandedRow] = useState<number | null>(null);

//   const handleMenuOpen = (
//     event: React.MouseEvent<HTMLButtonElement>,
//     row: any
//   ) => {
//     setMenuAnchor(event.currentTarget);
//     setSelectedRow(row);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setSelectedRow(null);
//   };

//   // total columns to span for expanded row
//   const expandedColSpan =
//     columns.length +
//     (actions.length > 0 ? 1 : 0) +
//     (typeof renderExpanded === "function" ? 1 : 0);

//   return (
//     <Box sx={{ overflowX: 'auto', width: '100%' }}>
//       <Table size="small" sx={{ overflowX: 'auto', width: '100%', minWidth: 900 }} stickyHeader>
//         <TableHead>
//           <TableRow sx={{ "& th": { py: 0.5, px: 1 } }}>
//             <TableCell
//               sx={{
//                 fontWeight: 600,
//                 fontSize: { xs: "0.75rem", sm: "0.85rem" },
//                 backgroundColor: theme.palette.background.paper,
//               }}
//             >
//               S.No
//             </TableCell>
//             {columns.map((col) => (
//               <TableCell
//                 key={col.key}
//                 align={col.align || "left"}
//                 sx={{
//                   fontWeight: 600,
//                   py: 1,
//                   px: 1,
//                   backgroundColor: theme.palette.background.paper,
//                 }}
//               >
//                 {col.label}
//               </TableCell>
//             ))}

//             {actions.length > 0 && (
//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: 600,
//                   py: 1,
//                   px: 1,
//                   backgroundColor: theme.palette.background.paper,
//                 }}
//               >
//                 Action
//               </TableCell>
//             )}

//             {typeof renderExpanded === "function" && (
//               <TableCell
//                 align="center"
//                 sx={{
//                   fontWeight: 600,
//                   py: 1,
//                   px: 1,
//                   backgroundColor: theme.palette.background.paper,
//                 }}
//               >
//                 {/* optional label or leave empty */}
//               </TableCell>
//             )}
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {data
//             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//             .map((row, index) => {
//               const isExpanded = expandedRow === index;

//               return (
//                 <React.Fragment key={row.id || index}>
//                   <TableRow hover>
//                     <TableCell sx={{ py: 0.5, px: 1 }}>
//                       {page * rowsPerPage + index + 1}
//                     </TableCell>

//                     {columns.map((col) => (
//                       <TableCell
//                         key={col.key}
//                         align={col.align || "left"}
//                         sx={{ py: 0.5, px: 1 }}
//                       >
//                         {col.render ? col.render(row, index) : row[col.key] || "-"}
//                       </TableCell>
//                     ))}

//                     {/* Actions */}
//                     {actions.length > 0 && (
//                       <TableCell align="center">
//                         <IconButton
//                           size="small"
//                           onClick={(e) => handleMenuOpen(e, row)}
//                         >
//                           <MoreVertIcon fontSize="small" />
//                         </IconButton>
//                       </TableCell>
//                     )}

//                     {/* Expand toggle */}
//                     {typeof renderExpanded === "function" && (
//                       <TableCell align="center">
//                         <IconButton
//                           size="small"
//                           onClick={() =>
//                             setExpandedRow(isExpanded ? null : index)
//                           }
//                         >
//                           {isExpanded ? (
//                             <KeyboardArrowUpIcon />
//                           ) : (
//                             <KeyboardArrowDownIcon />
//                           )}
//                         </IconButton>
//                       </TableCell>
//                     )}
//                   </TableRow>

//                   {/* Expanded content */}
//                   {typeof renderExpanded === "function" && (
//                     <TableRow sx={{ '& th': { py: 0.4, px: 1, fontSize: '0.8rem' } }}>
//                       <TableCell
//                         colSpan={expandedColSpan}
//                         sx={{ py: 0, px: 0, borderBottom: 0 }}
//                       >
//                         <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                           <Box sx={{ p: 2 }}>{renderExpanded(row)}</Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//         </TableBody>

//         {/* Actions Menu */}
//         <Menu
//           anchorEl={menuAnchor}
//           open={Boolean(menuAnchor)}
//           onClose={handleMenuClose}
//         >
//           {actions.map((action, i) => (
//             <MenuItem
//               key={i}
//               onClick={() => {
//                 action.onClick(selectedRow);
//                 handleMenuClose();
//               }}
//               sx={{ gap: 0.2, minHeight: 32, px: 2 }}
//             >
//               {action.icon && (
//                 <ListItemIcon
//                   sx={{
//                     minWidth: 24,
//                     color: action.color
//                       ? theme.palette[action.color].main
//                       : theme.palette.secondary.main,
//                     mr: -1,
//                   }}
//                 >
//                   {action.icon}
//                 </ListItemIcon>
//               )}
//               <span
//                 style={{
//                   fontSize: '0.85rem',
//                   color: action.color
//                     ? theme.palette[action.color].main
//                     : theme.palette.secondary.main,
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {action.label}
//               </span>
//             </MenuItem>
//           ))}

//         </Menu>
//       </Table>
//     </Box>
//   );
// };

// export default ReusableTable;
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Collapse,
  Box,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: any, index: number) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  page?: number;              // optional
  rowsPerPage?: number;       // optional
  actions?: TableAction[];
  renderExpanded?: (row: any) => React.ReactNode;
  isRowExpandable?: (row: any) => boolean;
}


const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  page = 0,              // default: first page
  rowsPerPage = data.length,    // default: show full table
  actions = [],
  renderExpanded,
  isRowExpandable,
}) => {

  const theme = useTheme();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: any
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const expandedColSpan =
    columns.length +
    (actions.length > 0 ? 1 : 0) +
    (renderExpanded && isRowExpandable ? 1 : 0);
  const paginatedData =
    rowsPerPage && rowsPerPage > 0
      ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : data;

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
      <Table size="small" sx={{ minWidth: 900 }} stickyHeader>
        <TableHead>
          <TableRow sx={{ "& th": { py: 0.5, px: 1 } }}>
            <TableCell sx={{ fontWeight: 600 }}>S.No</TableCell>
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align || "left"} sx={{ fontWeight: 600 }}>
                {col.label}
              </TableCell>
            ))}

            {actions.length > 0 && <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>}

            {renderExpanded && isRowExpandable && <TableCell align="center" sx={{ fontWeight: 600 }} />}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedData.map((row, index) => {

            const isExpanded = expandedRow === index;
            const canExpand = isRowExpandable ? isRowExpandable(row) : false;

            return (
              <React.Fragment key={row.id || index}>
                <TableRow hover>
                  <TableCell sx={{ py: 0.5, px: 1 }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"} sx={{ py: 0.5, px: 1 }}>
                      {col.render ? col.render(row, index) : row[col.key] || "-"}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  {actions.length > 0 && (
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}

                  {/* Expand toggle */}
                  {renderExpanded && isRowExpandable && (
                    <TableCell align="center">
                      {canExpand && (
                        <IconButton size="small" onClick={() => setExpandedRow(isExpanded ? null : index)}>
                          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>

                {/* Expanded content */}
                {renderExpanded && isRowExpandable && canExpand && (
                  <TableRow>
                    <TableCell colSpan={expandedColSpan} sx={{ py: 0, px: 0, borderBottom: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>{renderExpanded(row)}</Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>

        {/* Actions Menu */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          {actions.map((action, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                action.onClick(selectedRow);
                handleMenuClose();
              }}
              sx={{ gap: 0.2, minHeight: 32, px: 2 }}
            >
              {action.icon && (
                <ListItemIcon sx={{ minWidth: 24, color: action.color ? theme.palette[action.color].main : theme.palette.secondary.main, mr: -1 }}>
                  {action.icon}
                </ListItemIcon>
              )}
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: action.color ? theme.palette[action.color].main : theme.palette.secondary.main }}>
                {action.label}
              </span>
            </MenuItem>
          ))}
        </Menu>
      </Table>
    </Box>
  );
};

export default ReusableTable;
