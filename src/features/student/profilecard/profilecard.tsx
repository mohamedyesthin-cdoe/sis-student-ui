import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro"; // ✅ use pro version
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import FlipIcon from "@mui/icons-material/FlipCameraAndroid";
import DownloadIcon from "@mui/icons-material/Download";
import logo2 from "/assets/logo2.png";
import logo from "/assets/logo.png";
import userimage from "/assets/images/man.png";

const StudentIdCard: React.FC = () => {
  const [isBack, setIsBack] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ✅ download as PDF
const handleDownloadBothSidesPDF = async () => {
  if (!cardRef.current) return;

  const cardRect = cardRef.current.getBoundingClientRect();
  const cardWidth = cardRect.width;
  const cardHeight = cardRect.height;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: "a4", // fixed A4 page
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const scale = 0.7; // reduce card size to 70%
  const scaledWidth = cardWidth * scale;
  const scaledHeight = cardHeight * scale;

  const xOffset = (pageWidth - scaledWidth) / 2;
  const yOffset = (pageHeight - scaledHeight) / 2;

  const originalSide = isBack;

  // Capture Front
  setIsBack(false);
  await new Promise((res) => setTimeout(res, 300));
  const canvasFront = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
  pdf.addImage(
    canvasFront.toDataURL("image/png"),
    "PNG",
    xOffset,
    yOffset,
    scaledWidth,
    scaledHeight
  );

  // Capture Back
  pdf.addPage();
  setIsBack(true);
  await new Promise((res) => setTimeout(res, 300));
  const canvasBack = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
  pdf.addImage(
    canvasBack.toDataURL("image/png"),
    "PNG",
    xOffset,
    yOffset,
    scaledWidth,
    scaledHeight
  );

  setIsBack(originalSide);
  pdf.save("Student_ID_Card.pdf");
};





  // 🔄 toggle front/back
  const toggleSide = () => setIsBack(!isBack);

  return (
    <Box className="flex flex-col items-center my-4 space-y-3">
      {/* Card Container */}
      <Box
        ref={cardRef}
        sx={{
          width: { xs: 260, sm: 300, md: 320 },
          height: { xs: 420, sm: 480, md: 500 },
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: 2,
          background: isBack
            ? "linear-gradient(to bottom, #e74c3c, #fbeedb)"
            : "linear-gradient(to bottom, #f44336, #fff3e0)",
          position: "relative",
          p: 2.5,
          transition: "all 0.3s ease-in-out",
        }}
      >
        {!isBack ? (
          <>
            {/* Top Logo Bar */}
            <Box
              className="bg-white flex justify-between items-center w-[90%] mx-auto mt-2 px-3 py-2 rounded-lg shadow-sm"
              sx={{ border: "none", mb: 2 }}
            >
              <Box className="flex items-center gap-2 border-r border-gray-300 pr-1">
                <img src={logo2} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#1d4e89",
                      fontWeight: "bold",
                      fontSize: { xs: "10px", sm: "12px" },
                      lineHeight: "14px",
                    }}
                  >
                    SRI RAMACHANDRA
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "7px", sm: "8px" },
                      color: "#666",
                      lineHeight: "10px",
                    }}
                  >
                    INSTITUTE OF HIGHER EDUCATION AND RESEARCH
                  </Typography>
                </Box>
              </Box>
              <Typography
                sx={{
                  color: "#1d4e89",
                  fontSize: { xs: "10px", sm: "11px" },
                  fontWeight: 600,
                  paddingLeft: 1,
                }}
              >
                Digilearn
              </Typography>
            </Box>

            {/* Student Photo */}
            <Box
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-md rounded-full"
              sx={{
                top: { xs: 75, sm: 95 },
                width: { xs: 130, sm: 170 },
                height: { xs: 130, sm: 170 },
                border: "5px solid #f44336",
              }}
            >
              <Avatar
                src={userimage}
                alt="Student"
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                }}
              />
            </Box>

            {/* Student Info */}
            <Box
              className="absolute text-center w-full px-6"
              sx={{ bottom: { xs: 30, sm: 40 } }}
            >
              <Typography
                sx={{
                  color: "#b71c1c",
                  fontWeight: 600,
                  fontSize: { xs: "16px", sm: "18px" },
                  mt: 4,
                  mb: 1.5,
                }}
              >
                Yesthin Mohamed
              </Typography>

              <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={1}
                  sx={{ width: "100%", maxWidth: 350 }}
                >
                  {[
                    { label: "Roll", value: "23SCS101" },
                    { label: "Class", value: "II B.Sc CS" },
                    { label: "Dept", value: "Computer Science" },
                    { label: "Session", value: "2024 – 2025" },
                  ].map(({ label, value }) => (
                    <Box key={label} display="flex" alignItems="flex-start" mb={0}>
                      <Typography
                        sx={{
                          width: "35%",
                          fontWeight: 600,
                          fontSize: { xs: "13px", sm: "13px" },
                          color: "#666",
                          textAlign: "left",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          width: "20px",
                          fontWeight: 600,
                          fontSize: { xs: "13px", sm: "13px" },
                          textAlign: "center",
                          color: "#666",
                        }}
                      >
                        :
                      </Typography>
                      <Typography
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          fontSize: { xs: "13px", sm: "14px" },
                          color: "#105c8e",
                          textAlign: "left",
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <>
            {/* Back Side Info */}
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Box
                display="flex"
                flexDirection="column"
                gap={1}
                sx={{ width: "100%", maxWidth: 350 }}
              >
                {[
                  { label: "Father’s Name", value: "Mr. K. Ramesh" },
                  { label: "Res Address", value: "24, Anna Nagar, Chennai – 600040" },
                  { label: "Contact No", value: "+91 98765 43210" },
                  { label: "Blood Group", value: "B+" },
                ].map(({ label, value }) => (
                  <Box key={label} display="flex" alignItems="flex-start" mb={0}>
                    <Typography
                      sx={{
                        width: "35%",
                        fontWeight: 600,
                        fontSize: { xs: "13px", sm: "13px" },
                        color: "#333",
                        textAlign: "left",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        width: "20px",
                        fontWeight: 600,
                        fontSize: { xs: "13px", sm: "13px" },
                        textAlign: "center",
                        color: "#333",
                      }}
                    >
                      :
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        fontWeight: 500,
                        fontSize: { xs: "13px", sm: "14px" },
                        color: "#0a3d62",
                        textAlign: "left",
                        wordBreak: "break-word",
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottom Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
                mt: 6,
              }}
            >
              <img
                src={logo}
                alt="Logo"
                className="h-10 object-contain"
              />
            </Box>
          </>
        )}
      </Box>

      {/* Action Buttons */}
      <Box display="flex" gap={2}>
        <Tooltip title={isBack ? "View Front Side" : "View Back Side"}>
          <IconButton
            onClick={toggleSide}
            sx={{
              backgroundColor: "#105c8e",
              color: "#fff",
              "&:hover": { backgroundColor: "#0a4368" },
            }}
          >
            <FlipIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download PDF">
          <IconButton
            onClick={handleDownloadBothSidesPDF}
            sx={{
              backgroundColor: "#BF2728",
              color: "#fff",
              "&:hover": { backgroundColor: "#a11f20" },
            }}
          >
            <DownloadIcon />
          </IconButton>

        </Tooltip>
      </Box>
    </Box>
  );
};

export default StudentIdCard;
