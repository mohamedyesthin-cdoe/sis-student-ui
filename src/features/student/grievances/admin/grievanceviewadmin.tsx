import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material/Select";

import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useParams, useNavigate } from "react-router-dom";

import CardComponent from "../../../../components/card/Card";
import apiClient from "../../../../services/ApiClient";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import GrievanceSkeletonAdmin from "../../../../components/card/skeletonloader/GrievanceSkeletonAdmin";

interface GrievanceData {
  id: number;
  student_name: string;
  registration_no: string;
  subject: string;
  description: string;
  status: string;
  assigned_to_id?: number;
  assigned_to_name?: string | null;
  created_at: string;
  attachment_url?: string;
  resolution_notes?: string;
  history?: GrievanceHistory[];
}
interface GrievanceHistory {
  action: string;
  status: string;
  resolved_by_id?: number | null;
  resolved_by_name?: string | null;
  notes?: string;
  created_at: string;
}

export default function GrievanceViewAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<GrievanceData | null>(null);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [assignedTo, setAssignedTo] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const statusColorMap: Record<string, any> = {
    open: "warning",
    pending: "warning",
    "in progress": "info",
    resolved: "success",
    rejected: "error",
  };


  const getStatusChipProps = (status?: string) => {
    if (!status) {
      return {
        label: "Unknown",
        color: "default",
      };
    }

    const normalized = status.toLowerCase();

    return {
      label: status.toUpperCase(),
      color: statusColorMap[normalized] || "default",
    };
  };

  const fetchGrievance = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(
        `${ApiRoutes.GRIVANCEVIEWBYIDADMIN}/${id}`
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyList = async () => {
    try {
      const response = await apiClient.get(
        ApiRoutes.GETFACULTYLIST
      );

      // API returns object with data array
      const list = response.data?.data;

      setFacultyList(
        Array.isArray(list) ? list : []
      );
    } catch (error) {
      console.error(error);
      setFacultyList([]);
    }
  };

  const handleCloseGrievance = async () => {
    if (!id) return;

    try {
      setClosing(true);

      await apiClient.post(
        `${ApiRoutes.GRIEVANCECLOSEBYADMIN}/${id}`,
        {
          status: "closed_by_admin",
        }
      );

      // Refresh grievance data
      await fetchGrievance();

    } catch (error) {
      console.error("Error closing grievance:", error);
    } finally {
      setClosing(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGrievance();
      fetchFacultyList();
    }
  }, [id]);

  useEffect(() => {
    if (data?.assigned_to_id) {
      setAssignedTo(data.assigned_to_id);
    }
  }, [data]);

  // FIXED HANDLER (Type-safe)
  const handleAssignmentChange = (
    event: SelectChangeEvent<number | "">
  ) => {
    const value = event.target.value;

    setAssignedTo(
      value === "" ? "" : Number(value)
    );
  };

  const handleAssign = async () => {
    if (!assignedTo || !id) return;

    try {
      await apiClient.post(
        `${ApiRoutes.GRIVANCEASSIGN}/${id}`,
        {
          staff_id: assignedTo,
        }
      );

      // Refresh grievance data after assign
      fetchGrievance();
    } catch (error) {
      console.error("Error assigning grievance:", error);
    }
  };

  const handleDownload = () => {
    if (data?.attachment_url) {
      window.open(data.attachment_url, "_blank", "noopener,noreferrer");
    }
  };



  return (
    <>
      {loading ? (
        <GrievanceSkeletonAdmin />
      ) : (

        <Box sx={{ p: 3 }}>
          <CardComponent
            sx={{
              p: 4,
              borderRadius: 3,
            }}
          >
            {/* HEADER */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
              >
                Grievance Details
              </Typography>

              <Chip
                {...getStatusChipProps(data?.status)}
                sx={{
                  fontWeight: 700,
                  px: 2,
                  fontSize: "0.9rem",
                  letterSpacing: 0.5,
                }}
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* LEFT CONTENT */}

              <Grid size={{ xs: 12, md: 7 }}>
                {/* STUDENT INFO ROW */}

                <Grid
                  container
                  spacing={3}
                  mb={2}
                >
                  <Grid size={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Student Name
                    </Typography>

                    <Typography fontWeight={600}>
                      {data?.student_name}
                    </Typography>
                  </Grid>

                  <Grid size={6}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Registration Number
                    </Typography>

                    <Typography fontWeight={600}>
                      {data?.registration_no}
                    </Typography>
                  </Grid>
                </Grid>

                {/* SUBJECT */}
                <Divider sx={{ mb: 3 }} />
                <Box mb={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Subject
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                  >
                    {data?.subject}
                  </Typography>
                </Box>

                {/* DESCRIPTION */}

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "#f8f9fa",
                    border:
                      "1px solid #e0e0e0",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={1}
                  >
                    Description
                  </Typography>

                  <Typography>
                    {data?.description}
                  </Typography>
                </Box>

                {/* ASSIGNMENT */}

                {/* ================= ASSIGNMENT / CLOSED MESSAGE ================= */}

                {data?.status?.toLowerCase() === "open" && (

                  /* NORMAL ASSIGNMENT UI */

                  <Box>
                    <Typography
                      fontWeight={600}
                      mb={2}
                    >
                      Assign Faculty
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid size={8}>
                        <FormControl fullWidth>
                          <InputLabel>
                            Assigned To
                          </InputLabel>

                          <Select<number | "">
                            value={assignedTo}
                            label="Assigned To"
                            onChange={handleAssignmentChange}
                          >
                            <MenuItem value="">
                              Select Faculty
                            </MenuItem>

                            {facultyList.map(
                              (faculty) => (
                                <MenuItem
                                  key={faculty.id}
                                  value={faculty.id}
                                >
                                  {`${faculty.first_name} ${faculty.last_name} (${faculty.employee_id})`}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={4}>
                        <Button
                          variant="contained"
                          startIcon={
                            <AssignmentIndIcon />
                          }
                          fullWidth
                          disabled={!assignedTo}
                          onClick={handleAssign}
                        >
                          Assign
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                )}
                {
                  data?.status?.toLowerCase() === 'closed_by_admin' && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #e0e0e0",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        This grievance was closed by administrator
                      </Typography>
                    </Box>
                  )
                }
                {data?.status?.toLowerCase() === "resolved" &&
                  data?.resolution_notes && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#e8f5e9",
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1}
                        fontWeight={500}
                      >
                        Resolution Notes
                      </Typography>

                      <Typography
                        sx={{
                          whiteSpace: "pre-wrap",
                          fontWeight: 500,
                        }}
                      >
                        {data.resolution_notes}
                      </Typography>
                    </Box>
                  )}

                {/* CLOSE GRIEVANCE BUTTON */}

                {data?.status?.toLowerCase() === "resolved" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleCloseGrievance}
                      disabled={closing}
                    >
                      {closing ? "Closing..." : "Close Grievance"}
                    </Button>
                  </Box>
                )}
                {/* ================= ATTACHMENT (LEFT BOTTOM) ================= */}

                <Box mt={4}>
                  <Typography fontWeight={600} mb={2}>
                    Attachment
                  </Typography>

                  {data?.attachment_url ? (
                    <Box>
                      <Box
                        sx={{
                          width: "100%",
                          height: 420,
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        {data.attachment_url.match(
                          /\.(jpeg|jpg|png|gif|webp)$/i
                        ) ? (
                          <Box
                            component="img"
                            src={data.attachment_url}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <iframe
                            src={data.attachment_url}
                            width="100%"
                            height="100%"
                            style={{
                              border: "none",
                            }}
                          />
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        Download Attachment
                      </Button>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      No attachment available
                    </Typography>
                  )}
                </Box>

              </Grid>

              {/* RIGHT ATTACHMENT */}

              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography fontWeight={600} mb={2}>
                    Grievance History
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  {data?.history &&
                    data.history.length > 0 ? (
                    <Box
                      sx={{
                        maxHeight: 650,
                        overflowY: "auto",
                        pr: 1,

                        /* scrollbar */

                        "&::-webkit-scrollbar": {
                          width: 6,
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#c1c1c1",
                          borderRadius: 3,
                        },
                      }}
                    >
                      {data.history.map(
                        (item, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb: 2,
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid #e0e0e0",
                              backgroundColor: "#fafafa",
                            }}
                          >
                            <Typography
                              fontWeight={600}
                              mb={1}
                            >
                              {item.action.toUpperCase()}
                            </Typography>

                            <Chip
                              label={item.status}
                              size="small"
                              sx={{ mb: 1 }}
                            />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {new Date(
                                item.created_at
                              ).toLocaleString()}
                            </Typography>

                            {item.notes && (
                              <Typography
                                variant="body2"
                                sx={{ mt: 1 }}
                              >
                                {item.notes}
                              </Typography>
                            )}

                            {item.resolved_by_name && (
                              <Typography
                                variant="body2"
                                sx={{ mt: 1 }}
                              >
                                Resolved By: {
                                  item.resolved_by_name
                                }
                              </Typography>
                            )}
                          </Box>
                        )
                      )}
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      No history available
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* BACK BUTTON */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                mt: 4,
              }}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  navigate(-1)
                }
              >
                Back
              </Button>
            </Box>
          </CardComponent>
        </Box>

      )}
    </>
  )
}
