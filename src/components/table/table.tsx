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
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/* ================= TYPES ================= */

interface Column {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (row: any, index: number) => React.ReactNode;
}

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  color?: "primary" | "secondary" | "error" | "success" | "warning";
}

interface ReusableTableProps {
  columns: Column[];
  data: any[];
  page?: number;
  rowsPerPage?: number;
  actions?: TableAction[];
  actionDisplay?: "menu" | "inline";
  renderExpanded?: (row: any) => React.ReactNode;
  isRowExpandable?: (row: any) => boolean;

  /** ✅ OPTIONAL S.NO */
  showSno?: boolean;
}

/* ================= COMPONENT ================= */

const ReusableTable: React.FC<ReusableTableProps> = ({
  columns,
  data,
  page = 0,
  rowsPerPage = data.length,
  actions = [],
  actionDisplay = "menu",
  renderExpanded,
  isRowExpandable,
  showSno = true,
}) => {
  const theme = useTheme();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  /* 🔒 Prevent duplicate S.No */
  const hasCustomSno = columns.some((c) => c.key === "sno");
  const shouldShowSno = showSno && !hasCustomSno;

  const handleMenuOpen = (
    e: React.MouseEvent<HTMLButtonElement>,
    row: any
  ) => {
    setMenuAnchor(e.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRow(null);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const expandedColSpan =
    columns.length +
    (shouldShowSno ? 1 : 0) +
    (actions.length > 0 ? 1 : 0) +
    (renderExpanded && isRowExpandable ? 1 : 0);

  return (
    <Box sx={{ overflowX: "auto", width: "100%" }}>
      <Table size="small" stickyHeader sx={{ tableLayout: "fixed" }}>
        {/* ================= COL WIDTH ================= */}
        <colgroup>
          {shouldShowSno && <col style={{ width: 60 }} />}
          {columns.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
          {actions.length > 0 && <col style={{ width: 80 }} />}
          {renderExpanded && isRowExpandable && <col style={{ width: 50 }} />}
        </colgroup>

        {/* ================= HEADER ================= */}
        <TableHead>
          <TableRow>
            {shouldShowSno && (
              <TableCell
                align="left"
                sx={{ fontWeight: 600, textAlign: "left" }}
              >
                S.No
              </TableCell>
            )}

            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align ?? "left"}
                sx={{ fontWeight: 600 }}
              >
                {col.label}
              </TableCell>
            ))}

            {actions.length > 0 && (
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Action
              </TableCell>
            )}

            {renderExpanded && isRowExpandable && <TableCell />}
          </TableRow>
        </TableHead>

        {/* ================= BODY ================= */}
        <TableBody>
          {paginatedData.map((row, index) => {
            const isExpanded = expandedRow === index;
            const canExpand = isRowExpandable?.(row);

            return (
              <React.Fragment key={row.id ?? index}>
                <TableRow hover>
                  {shouldShowSno && (
                    <TableCell
                      align="left"
                      sx={{ textAlign: "left" }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                  )}

                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      align={col.align ?? "left"}
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {col.render
                        ? col.render(row, index)
                        : row[col.key] ?? "-"}
                    </TableCell>
                  ))}

                  {/* ACTIONS */}
                  {actions.length > 0 && (
                    <TableCell align="center">
                      {actionDisplay === "menu" ? (
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, row)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="center"
                        >
                          {actions.map((action, i) => (
                            <IconButton
                              key={i}
                              size="small"
                              color={action.color}
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon}
                            </IconButton>
                          ))}
                        </Stack>
                      )}
                    </TableCell>
                  )}

                  {/* EXPAND */}
                  {renderExpanded && isRowExpandable && (
                    <TableCell align="center">
                      {canExpand && (
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedRow(isExpanded ? null : index)
                          }
                        >
                          {isExpanded ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>

                {/* EXPANDED CONTENT */}
                {renderExpanded && isRowExpandable && canExpand && (
                  <TableRow>
                    <TableCell
                      colSpan={expandedColSpan}
                      sx={{ p: 0, borderBottom: 0 }}
                    >
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

        {/* ================= MENU ================= */}
        {actionDisplay === "menu" && (
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {actions.map((action, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  action.onClick(selectedRow);
                  handleMenuClose();
                }}
              >
                {action.icon && (
                  <ListItemIcon
                    sx={{
                      color: action.color
                        ? theme.palette[action.color].main
                        : theme.palette.secondary.main,
                    }}
                  >
                    {action.icon}
                  </ListItemIcon>
                )}
                {action.label}
              </MenuItem>
            ))}
          </Menu>
        )}
      </Table>
    </Box>
  );
};

export default ReusableTable;
