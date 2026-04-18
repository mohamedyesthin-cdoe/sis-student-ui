import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate, useParams } from "react-router-dom";

import CardComponent from "../../../../components/card/Card";
import apiClient from "../../../../services/ApiClient";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import { useLoader } from "../../../../context/LoaderContext";
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
}

export default function GrievanceFacultyView() {
  const navigate = useNavigate();

  const [data, setData] = useState<GrievanceData | null>(null);
  const [, setAssignedTo] = useState<number | "">("");
  const { loading } = useLoader();
  const { id } = useParams();
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [updating, setUpdating] = useState(false);

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

      const response = await apiClient.get(
        `${ApiRoutes.GRIEVANCEFACULTYVIEW}/${id}`
      );

      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      alert("Please enter resolution notes before resolving.");
      return;
    }

    try {
      setUpdating(true);

      await apiClient.post(
        `${ApiRoutes.GRIEVANCEUPDATEBYFACULTY}/${id}`,
        {
          status: "",
          resolution_notes: resolutionNotes,
        }
      );

      await fetchGrievance();

    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };


  useEffect(() => {
    // if (id) {
    fetchGrievance();
    // }
  }, []);

  useEffect(() => {
    if (data?.assigned_to_id) {
      setAssignedTo(data.assigned_to_id);
    }
  }, [data]);


  // const handleDownload = () => {
  //   if (data?.attachment_url) {
  //     const link = document.createElement("a");
  //     link.href = data.attachment_url;
  //     link.download = "attachment";
  //     link.click();
  //   }
  // };
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

                {/* RESOLUTION NOTES */}

                {data?.status?.toLowerCase() !== "resolved" && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                      backgroundColor: "#fff",
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

                    <textarea
                      value={resolutionNotes}
                      onChange={(e) =>
                        setResolutionNotes(e.target.value)
                      }
                      placeholder="Enter resolution details..."
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        resize: "vertical",
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={handleResolve}
                        disabled={updating}
                      >
                        Mark as Resolved
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* DISPLAY RESOLUTION NOTES AFTER RESOLVED */}

                {data?.status?.toLowerCase() === "resolved" &&
                  data?.resolution_notes && (
                    <Box
                      sx={{
                        mt: 2,
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
              </Grid>

              {/* RIGHT ATTACHMENT */}

              <Grid size={{ xs: 12, md: 5 }}>
                <Typography
                  fontWeight={600}
                  mb={2}
                >
                  Attachment
                </Typography>

                {data?.attachment_url ? (
                  <Box>
                    <Box
                      sx={{
                        width: "100%",
                        height: 520,
                        border:
                          "1px solid #e0e0e0",
                        borderRadius: 2,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "center",
                        backgroundColor:
                          "#fafafa",
                      }}
                    >
                      {data.attachment_url.match(
                        /\.(jpeg|jpg|png|gif|webp)$/i
                      ) ? (
                        <Box
                          component="img"
                          src={
                            data.attachment_url
                          }
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "contain",
                          }}
                        />
                      ) : (
                        <iframe
                          src={
                            data.attachment_url
                          }
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
                      startIcon={
                        <DownloadIcon />
                      }
                      onClick={
                        handleDownload
                      }
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
      )
      }
    </>


  );
}
