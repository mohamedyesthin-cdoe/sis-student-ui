import React, { useRef } from "react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import {  Box, Typography, Avatar } from "@mui/material";
import logo2 from "/assets/logo2.png";
import userimage from "/assets/images/man.png";

const StudentIdCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  // const handleDownloadPDF = async () => {
  //   if (!cardRef.current) return;

  //   try {
  //     // Capture the card
  //     const canvas = await html2canvas(cardRef.current, { scale: 2 } as any) ;
  //     const imgData = canvas.toDataURL("image/png");

  //     // Create PDF
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "mm",
  //       format: "a4",
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save("Student_ID_Card.pdf");
  //   } catch (error) {
  //     console.error("PDF download failed:", error);
  //   }
  // };

  return (
    <Box className="flex flex-col items-center mt-0 p-5">
      {/* ID Card */}
      <Box
        ref={cardRef}
        sx={{
          width: { xs: 260, sm: 300, md: 320 },
          height: { xs: 420, sm: 480, md: 500 },
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          boxShadow: 1,
          background: "linear-gradient(to bottom, #f44336, #fff3e0)", // hex colors
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: "auto",
        }}
      >
        {/* Top Logo Bar */}
        <Box
          className="bg-white flex justify-between items-center w-[90%] mt-3 px-3 py-2 rounded-lg shadow-sm"
          sx={{ border: "none" }}
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
                  color: "#666666",
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
            top: { xs: 80, sm: 100 },
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
            Student Name
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Box display="flex" flexDirection="column" gap={1} sx={{ width: "100%", maxWidth: 350 }}>
              {[
                { label: "Roll", value: "23SCS101" },
                { label: "Class", value: "II B.Sc CS" },
                { label: "Dept", value: "Computer Science" },
                { label: "Session", value: "2024–2025" },
              ].map(({ label, value }) => (
                <Box key={label} display="flex" alignItems="flex-start" mb={0}>
                  <Typography
                    sx={{
                      width: "35%",
                      fontWeight: 600,
                      fontSize: { xs: "13px", sm: "13px" },
                      color: "#666666",
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
                      color: "#666666",
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
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      textAlign: "left",
                    }}
                  >
                    {value || "-"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Download Button */}
      {/* <Button
        variant="contained"
        onClick={handleDownloadPDF}
        sx={{
          mt: 3,
          backgroundColor: "#105c8e",
          "&:hover": { backgroundColor: "#0c4a6e" },
          textTransform: "none",
          px: { xs: 3, sm: 4 },
          py: { xs: 0.8, sm: 1 },
          borderRadius: "6px",
          fontSize: { xs: "12px", sm: "14px" },
        }}
      >
        Download PDF
      </Button> */}
    </Box>
  );
};

export default StudentIdCard;
