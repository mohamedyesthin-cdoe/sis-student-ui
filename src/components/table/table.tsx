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

  /* existing */
  visible?: (row: any) => boolean;

  /* NEW */
  disabled?: (row: any) => boolean;
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

  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null);

  const [selectedRow, setSelectedRow] =
    useState<any>(null);

  const [expandedRow, setExpandedRow] =
    useState<number | null>(null);

  /* Prevent duplicate S.No */

  const hasCustomSno = columns.some(
    (c) => c.key === "sno"
  );

  const shouldShowSno =
    showSno && !hasCustomSno;

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
    (renderExpanded && isRowExpandable
      ? 1
      : 0);

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      <Table
        size="small"
        stickyHeader
        sx={{
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        {/* ================= COL WIDTH ================= */}

        <colgroup>
          {shouldShowSno && (
            <col style={{ width: 60 }} />
          )}

          {columns.map((c) => (
            <col
              key={c.key}
              style={{ width: c.width }}
            />
          ))}

          {actions.length > 0 && (
            <col style={{ width: 140 }} />
          )}

          {renderExpanded &&
            isRowExpandable && (
              <col style={{ width: 50 }} />
            )}
        </colgroup>

        {/* ================= HEADER ================= */}

        <TableHead>
          <TableRow>

            {shouldShowSno && (
              <TableCell
                align="left"
                sx={{ fontWeight: 600 }}
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
              <TableCell
                align="center"
                sx={{ fontWeight: 600 }}
              >
                Action
              </TableCell>
            )}

            {renderExpanded &&
              isRowExpandable && (
                <TableCell />
              )}

          </TableRow>
        </TableHead>

        {/* ================= BODY ================= */}

        <TableBody>
          {paginatedData.map(
            (row, index) => {
              const isExpanded =
                expandedRow === index;

              const canExpand =
                isRowExpandable?.(row);

              return (
                <React.Fragment
                  key={row.id ?? index}
                >

                  <TableRow hover>

                    {/* S.No */}

                    {shouldShowSno && (
                      <TableCell>
                        {page *
                          rowsPerPage +
                          index +
                          1}
                      </TableCell>
                    )}

                    {/* DATA */}

                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        align={
                          col.align ?? "left"
                        }
                        sx={{
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {col.render
                          ? col.render(
                            row,
                            index
                          )
                          : row[
                          col.key
                          ] ?? "-"}
                      </TableCell>
                    ))}

                    {/* ACTIONS */}

                    {actions.length > 0 && (
                      <TableCell align="center">

                        {actionDisplay ===
                          "menu" ? (

                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleMenuOpen(
                                e,
                                row
                              )
                            }
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>

                        ) : (

                          <Stack
                            direction="row"
                            spacing={0.5}
                            justifyContent="center"
                            alignItems="center"
                            flexWrap="nowrap"
                          >
                            {actions
                              .filter(
                                (action) =>
                                  action.visible
                                    ? action.visible(
                                      row
                                    )
                                    : true
                              )
                              .map(
                                (
                                  action,
                                  i
                                ) => (
                                  <IconButton
                                    key={i}
                                    size="small"
                                    color={action.color}
                                    disabled={
                                      action.disabled
                                        ? action.disabled(row)
                                        : false
                                    }
                                    onClick={() => {
                                      if (
                                        action.disabled &&
                                        action.disabled(row)
                                      )
                                        return;

                                      action.onClick(row);
                                    }}
                                  >
                                    <span>
                                      {action.icon}
                                    </span>
                                  </IconButton>
                                )
                              )}
                          </Stack>

                        )}

                      </TableCell>
                    )}

                    {/* EXPAND */}

                    {renderExpanded &&
                      isRowExpandable && (
                        <TableCell align="center">
                          {canExpand && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                setExpandedRow(
                                  isExpanded
                                    ? null
                                    : index
                                )
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

                  {renderExpanded &&
                    isRowExpandable &&
                    canExpand && (
                      <TableRow>
                        <TableCell
                          colSpan={
                            expandedColSpan
                          }
                          sx={{
                            p: 0,
                            borderBottom: 0,
                          }}
                        >
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ p: 2 }}>
                              {renderExpanded(
                                row
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}

                </React.Fragment>
              );
            }
          )}
        </TableBody>

        {/* ================= MENU ================= */}

        {actionDisplay === "menu" && (
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {actions
              .filter(
                (action) =>
                  action.visible
                    ? selectedRow
                      ? action.visible(
                        selectedRow
                      )
                      : false
                    : true
              )
              .map((action, i) => (
                <MenuItem
                  key={i}
                  disabled={
                    action.disabled
                      ? selectedRow
                        ? action.disabled(selectedRow)
                        : false
                      : false
                  }
                  onClick={() => {
                    if (
                      selectedRow &&
                      !(
                        action.disabled &&
                        action.disabled(selectedRow)
                      )
                    ) {
                      action.onClick(selectedRow);
                    }

                    handleMenuClose();
                  }}
                >
                  {action.icon && (
                    <ListItemIcon
                      sx={{
                        color: action.color
                          ? theme.palette[
                            action.color
                          ].main
                          : theme.palette
                            .secondary
                            .main,
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