import { Box, Divider, IconButton, useTheme } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CardComponent from "../../../components/card/Card";
import { useGlobalError } from "../../../context/ErrorContext";
import Customtext from "../../../components/inputs/customtext/Customtext";

// ✅ Only import the academic PDF
// import academicPdf from "/assets/documents/Academic calender 2025-26.pdf";

export default function DocumentsCard() {
  const theme = useTheme();

  // ✅ Only one document (Academic Calendar)
  const academicPdf = "https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/cdoedocument/Academic+calender+2025-26.pdf"
  const regulationPdf = "https://cdoe-sriher-online-content.s3.ap-south-1.amazonaws.com/cdoedocument/regulation.pdf"
  const docs = [
    { label: "Academic Calendar 2025-26", file: academicPdf },
    { label: "Regulations 2025-26", file: regulationPdf },
  ];

  const availableDocs = docs.filter((doc) => doc.file);
  const { error } = useGlobalError()

  return (
    <>
      {error.type == "NONE" && (
        <CardComponent sx={{ height: 'auto', display: "flex", flexDirection: "column" }}>
          {/* <Box className="py-2 px-3">
        <Customtext fieldName="Documents" sx={{ mb: 0 }} />
      </Box> */}
          <Divider sx={{ borderColor: "#899000" }} />

          {availableDocs.length > 0 ? (
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
                  {/* PDF Icon + Label */}
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
                    <Customtext variantName='body2' fieldName={doc.label}
                      sx={{ fontWeight: 600, color: theme.palette.text.primary }} />
                  </Box>

                  {/* View Button */}
                  <IconButton
                    onClick={() => window.open(doc.file, "_blank")}
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
            // 🚧 Coming Soon
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
              <Customtext variantName='h4' fieldName={'🚧 Coming Soon'}
                sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }} />
              <Customtext variantName='body2' fieldName={'No documents available yet. Please check back later.'}
                sx={{ color: theme.palette.text.secondary, maxWidth: 300 }} />
            </Box>
          )}
        </CardComponent>
      )}
    </>
  );
}
