import * as React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

type Grievance = {
  id: number;
  subject: string;
  description: string;
  attachment_url: string | null;
  created_at: string;
  status: string;
  assigned_to_name: string | null;
};

export default function GrievanceFacultyList() {
  const navigate = useNavigate();

  const { clearError } = useGlobalError();
  const { showAlert } = useAlert();
  const { loading } = useLoader();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage] = React.useState(10);
  const [searchText, setSearchText] = React.useState("");

  const [grievances, setGrievances] =
    React.useState<Grievance[]>([]);

  /* ---------------- FETCH LIST ---------------- */

  React.useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      clearError();

      const res = await apiRequest({
        url: ApiRoutes.GRIEVANCEFACULTYLIST,
        method: "get",
      });

      /* NEW RESPONSE IS DIRECT LIST */

      setGrievances(res || []);

    } catch (err: any) {
      showAlert(
        err.response?.data?.message ||
        "Failed to load grievances.",
        "error"
      );
    }
  };


  /* ---------------- SEARCH FILTER ---------------- */

  const filteredData = grievances.filter(
    (g) => {
      const combined = `
        ${g.subject}
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
        subject: g.subject,
        description: g.description,
        created_at: new Date(
          g.created_at
        ).toLocaleString(),
      })),
      [
        { header: "S.No", key: "sno" },
        {
          header: "Registration No",
          key: "registration_no",
        },
        {
          header: "Student Name",
          key: "student_name",
        },
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

  /* ---------------- VIEW ATTACHMENT ---------------- */

  const handleView = (
    row: Grievance
  ) => {
    navigate(`/facultylogin/grievance/view/${row.id}`);
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
                key: "registration_no",
                label:
                  "Registration No",
              },
              {
                key: "student_name",
                label:
                  "Student Name",
              },
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
                key: "assigned_to_name",
                label:
                  "Assigned To",
              },
              {
                key: "status",
                label:
                  "Ticket Status",
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
                label:
                  "View",
                icon: (
                  <VisibilityIcon fontSize="small" />
                ),
                color:
                  "primary",
                onClick:
                  handleView,
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
    </>
  );
}