import * as React from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useNavigate } from "react-router-dom";

import { useGlobalError } from "../../../../context/ErrorContext";
import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";

import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import { exportToExcel } from "../../../../constants/excelExport";

import CardComponent from "../../../../components/card/Card";
import TableToolbar from "../../../../components/tabletoolbar/tableToolbar";
import TableSkeleton from "../../../../components/card/skeletonloader/Tableskeleton";
import { NoDataFoundUI } from "../../../../components/card/errorUi/NoDataFoundUI";
import ReusableTable from "../../../../components/table/table";
import TablePagination from "../../../../components/tablepagination/tablepagination";
import CustomDialog from "../../../../context/ConfirmDialog";
import { Chip, Tooltip } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

type Grievance = {
  id: number;
  student_id: number;
  student_name: string;
  registration_no: string;
  subject: string;
  description: string;
  attachment_url: string;
  created_at: string;
  status: string;
};
export default function GrievanceList() {
  const navigate = useNavigate();

  const { clearError } = useGlobalError();
  const { showAlert } = useAlert();
  const { loading } = useLoader();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");

  const [grievances, setGrievances] =
    React.useState<Grievance[]>([]);

  const [openDelete, setOpenDelete] =
    React.useState(false);

  const [selectedRow, setSelectedRow] =
    React.useState<Grievance | null>(null);

  const [openReissue, setOpenReissue] =
    React.useState(false);

  /* ---------------- FETCH LIST ---------------- */

  React.useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      clearError();

      const res = await apiRequest({
        url: ApiRoutes.GRIEVANCELIST,
        method: "get",
      });

      const list =
        res

      setGrievances(list);

    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to load grievances.",
        "error"
      );
    }
  };

  const handleOpenReissue = (row: Grievance) => {
    setSelectedRow(row);
    setOpenReissue(true);
  };

  const handleCloseReissue = () => {
    setSelectedRow(null);
    setOpenReissue(false);
  };


  const handleConfirmReissue = async () => {
    if (!selectedRow?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.GRIEVANCEREISSUE}/${selectedRow.id}`,
        method: "post",
      });

      showAlert(
        "Grievance reissued successfully!",
        "success"
      );

      fetchGrievances();

      handleCloseReissue();

    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to reissue grievance.",
        "error"
      );
    }
  };
  /* ---------------- DELETE ---------------- */

  const handleOpenDelete = (row: Grievance) => {
    setSelectedRow(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setSelectedRow(null);
    setOpenDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRow?.id) return;

    try {
      await apiRequest({
        url: `${ApiRoutes.GRIEVANCEDELETE}/${selectedRow.id}`,
        method: "delete",
      });

      setGrievances((prev) =>
        prev.filter(
          (item) => item.id !== selectedRow.id
        )
      );

      showAlert(
        "Grievance deleted successfully!",
        "success"
      );

      handleCloseDelete();

    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to delete grievance.",
        "error"
      );
    }
  };

  /* ---------------- SEARCH FILTER ---------------- */

  const filteredData = grievances.filter(
    (g) => {
      const combined = `
        ${g.subject}
        ${g.student_name}
        ${g.registration_no}
        ${g.description}
      `.toLowerCase();

      return combined.includes(
        searchText.toLowerCase()
      );
    }
  );

  /* ---------------- EXPORT ---------------- */

  const handleExportExcel = () => {
    exportToExcel(
      filteredData.map((g, index) => ({
        sno: index + 1,
        registration_no: g.registration_no,
        student_name: g.student_name,
        subject: g.subject,
        description: g.description,
        created_at: new Date(
          g.created_at
        ).toLocaleString(),
      })),
      [
        { header: "S.No", key: "sno" },
        { header: "Subject", key: "subject" },
        {
          header: "Description",
          key: "description",
        },
        {
          header: "Created At",
          key: "created_at",
        },
      ],
      "GrievanceList",
      "GrievanceList"
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <CardComponent
        sx={{
          width: "100%",
          maxWidth: {
            xs: "350px",
            sm: "900px",
            md: "1300px",
          },
          mx: "auto",
          p: 3,
          mt: 3,
        }}
      >
        <TableToolbar
          filters={[
            {
              key: "search",
              label: "Search",
              type: "text",
              value: searchText,
              onChange: (val) =>
                setSearchText(val),
              placeholder:
                "Search grievance",
              visible: true,
            },
          ]}
          actions={[
            {
              label: "Export Excel",
              color: "secondary",
              startIcon: (
                <FileDownloadIcon />
              ),
              onClick:
                handleExportExcel,
            },
            {
              label: "Add Grievance",
              color: "primary",
              onClick: () =>
                navigate(
                  "/grievances/add"
                ),
            },
          ]}
        />

        {loading ? (
          <TableSkeleton />
        ) : filteredData.length === 0 ? (
          <NoDataFoundUI />
        ) : (
          <ReusableTable
            actionDisplay="inline"
            columns={[
              {
                key: "subject",
                label: "Subject",
              },
              {
                key: "description",
                label:
                  "Description",
              },
              {
                key: "status",
                label: "Ticket Status",
                render: (row: Grievance) => (
                  <Chip
                    label={row.status}
                    color={
                      row.status === "Resolved"
                        ? "success"
                        : row.status === "Open"
                          ? "warning"
                          : "default"
                    }
                    size="small"
                  />
                ),
              },
              {
                key: "created_at",
                label:
                  "Created Date",
                render: (
                  row: Grievance
                ) =>
                  new Date(
                    row.created_at
                  ).toLocaleDateString(),
              },
            ]}
            data={filteredData}
            page={page}
            rowsPerPage={
              rowsPerPage
            }
            actions={[
              {
                label: "Edit",
                icon: (
                  <Tooltip title="Edit Grievance">
                    <EditIcon fontSize="small" />
                  </Tooltip>
                ),
                color: "primary",
                onClick: (row) =>
                  navigate(`/grievances/edit/${row.id}`),
              },
              {
                label: "Delete",
                icon: (
                  <Tooltip title="Delete Grievance">
                    <DeleteIcon fontSize="small" />
                  </Tooltip>
                ),
                color: "error",
                onClick: handleOpenDelete,
              },
              {
                label: "Reissue",
                icon: (
                  <Tooltip title="Reissue Grievance">
                    <ReplayIcon fontSize="small" />
                  </Tooltip>
                ),
                color: "secondary",

                disabled: (row) =>
                  row.status === "open",

                onClick: handleOpenReissue,
              },
            ]}
          />
        )}

        <TablePagination
          page={page}
          rowsPerPage={
            rowsPerPage
          }
          totalCount={
            filteredData.length
          }
          onPageChange={
            setPage
          }
        />
      </CardComponent>

      <CustomDialog
        open={openDelete}
        title="Delete Grievance"
        description={
          <>
            Are you sure you want to
            delete{" "}
            <strong>
              {
                selectedRow?.subject
              }
            </strong>
            ?
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        onClose={
          handleCloseDelete
        }
        onConfirm={
          handleConfirmDelete
        }
      />
      <CustomDialog
        open={openReissue}
        title="Reissue Grievance"
        description={
          <>
            Are you sure you want to reissue{" "}
            <strong>
              {selectedRow?.subject}
            </strong>
            ?
          </>
        }
        confirmText="Reissue"
        cancelText="Cancel"
        onClose={handleCloseReissue}
        onConfirm={handleConfirmReissue}
      />
    </>
  );
}