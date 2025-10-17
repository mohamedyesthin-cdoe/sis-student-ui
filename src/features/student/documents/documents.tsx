import { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CardComponent from "../../../components/card/Card";
import Customtext from "../../../components/customtext/Customtext";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { useParams } from "react-router-dom";

export default function DocumemtsCard() {
  const theme = useTheme();
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTBYID}/${id}`,
          method: "get",
        });
        if (response) {
          setStudent(response);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  const docs = [
    { label: "Aadhar", value: student?.document_details?.aadhar },
    { label: "Class 10th Marksheet", value: student?.document_details?.class_10th_marksheet },
    { label: "Class 12th Marksheet", value: student?.document_details?.class_12th_marksheet },
    { label: "Diploma Marksheet", value: student?.document_details?.diploma_marksheet },
    { label: "Graduation Marksheet", value: student?.document_details?.graduation_marksheet },
    { label: "Passport", value: student?.document_details?.passport },
    { label: "Signature", value: student?.document_details?.signature },
    { label: "Work Experience Certificates", value: student?.document_details?.work_experience_certificates },
  ];

  const availableDocs = docs.filter((doc) => doc.value);

  return (
    <CardComponent sx={{ height: 400, display: "flex", flexDirection: "column" }}>
      <Box className="py-2 px-3">
        <Customtext fieldName="Documents" sx={{ mb: 0 }} />
      </Box>
      <Divider sx={{ borderColor: "#899000" }} />

      {/* Loading State */}
      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Loading...</Typography>
        </Box>
      ) : availableDocs.length > 0 ? (
        // ✅ Show document list
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {availableDocs.map((doc) => (
            <Box
              key={doc.label}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={1.2}
              sx={{
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1,
                boxShadow: "inset 0 0 3px rgba(0,0,0,0.05)",
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: "4px",
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PictureAsPdfIcon
                    sx={{ color: theme.palette.grey[500], fontSize: "18px" }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {doc.label}
                </Typography>
              </Box>

              <IconButton
                onClick={() => window.open(doc.value, "_blank")}
                sx={{
                  backgroundColor: "black",
                  color: theme.palette.grey[300],
                  p: 0.7,
                  "&:hover": { backgroundColor: "black" },
                }}
              >
                <FileDownloadIcon sx={{ fontSize: "18px" }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : (
        // 🚧 Coming Soon Fallback
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundColor: theme.palette.grey[50],
            borderRadius: 2,
            m: 2,
            p: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}
          >
            🚧 Coming Soon
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, maxWidth: 300 }}
          >
            We’re working on adding document details for this student.
          </Typography>
        </Box>
      )}
    </CardComponent>
  );
}
