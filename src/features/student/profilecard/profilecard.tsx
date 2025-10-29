import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FlipIcon from "@mui/icons-material/FlipCameraAndroid";
import DownloadIcon from "@mui/icons-material/Download";
import logo2 from "/assets/logo2.png";
import userimage from "/assets/images/man.png";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { getValue } from "../../../utils/localStorageUtil";

const StudentIdCard: React.FC = () => {
  const [isBack, setIsBack] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const student_id = getValue("student_id");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await apiRequest({
          url: `${ApiRoutes.GETSTUDENTBYID}/${student_id}`,
          method: "get",
        });
        if (response) setStudent(response);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      } finally {
        setLoading(false);
      }
    };
    if (student_id) fetchStudent();
  }, [student_id, navigate]);

  const personalInfo = {
    fullName: `${student?.first_name} ${student?.last_name}`,
    email: student?.email,
    phoneNumber: student?.mobile_number,
    program:
      // student?.program_id === "1500038"
      "B.Sc Data Science",
        // : "-",
    department: student?.department || "CDOE",
    batch: student?.batch || "July",
    year: student?.year || "2025",
    registration_no: student?.registration_no,
    parent_guardian_name: student?.parent_guardian_name,
    address: `${student?.address_details?.corr_addr1 || ""}, ${
      student?.address_details?.corr_addr2 || ""
    }, ${student?.address_details?.corr_city || ""} - ${
      student?.address_details?.corr_pin || ""
    }`,
  };

  const handleDownloadBothSidesPDF = async () => {
    if (!cardRef.current) return;

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const cardRect = cardRef.current.getBoundingClientRect();
    const scale = 0.7;
    const scaledWidth = cardRect.width * scale;
    const scaledHeight = cardRect.height * scale;
    const xOffset = (pageWidth - scaledWidth) / 2;
    const yOffset = (pageHeight - scaledHeight) / 2;

    const originalSide = isBack;
    setIsBack(false);
    await new Promise((r) => setTimeout(r, 300));
    const front = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
    pdf.addImage(front.toDataURL("image/png"), "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

    pdf.addPage();
    setIsBack(true);
    await new Promise((r) => setTimeout(r, 300));
    const back = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
    pdf.addImage(back.toDataURL("image/png"), "PNG", xOffset, yOffset, scaledWidth, scaledHeight);

    setIsBack(originalSide);
    pdf.save(`${student?.first_name || "Student"}_ID_Card.pdf`);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  if (!student) {
    return (
      <Box className="text-center text-gray-500 mt-10">
        <Typography>No student data found.</Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center my-4 space-y-3">
      {/* Card */}
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
        {/* FRONT SIDE */}
        {!isBack ? (
          <>
            <Box
              className="bg-white flex justify-between items-center w-[98%] mx-auto mt-2 px-3 py-2 rounded-lg shadow-sm"
              sx={{ border: "none", mb: 2 }}
            >
              <img src={logo2} alt="Logo" className="mx-auto object-contain h-12" />
            </Box>

            {/* Student Photo */}
            <Box
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-md rounded-full mt-2"
              sx={{
                top: { xs: 75, sm: 95 },
                width: { xs: 130, sm: 170 },
                height: { xs: 130, sm: 170 },
                border: "5px solid #f44336",
              }}
            >
              <Avatar
                src={student?.profile_photo || userimage}
                alt="Student"
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                }}
              />
            </Box>

            {/* Aligned Info Section */}
            <Box
              className="absolute w-full"
              sx={{
                bottom: { xs: 35, sm: 40 },
                px: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#b71c1c",
                  fontWeight: 700,
                  fontSize: { xs: "16px", sm: "18px" },
                  textAlign: "center",
                  mb: 2,
                }}
              >
                {personalInfo.fullName}
              </Typography>

              {/* Aligned Labels/Values (same as back side) */}
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box display="flex" flexDirection="column" gap={1} sx={{ width: "100%", maxWidth: 350 }}>
                  {[
                    { label: "Roll No", value: personalInfo.registration_no },
                    { label: "Program", value: personalInfo.program },
                    { label: "Dept", value: personalInfo.department },
                    { label: "Session", value: student?.session || "JULY – 2025" },
                  ].map(({ label, value }) => (
                    <Box key={label} display="flex" alignItems="flex-start" mb={0}>
                      <Typography sx={{ width: "35%", fontWeight: 600, fontSize: "13px", color: "#333" }}>
                        {label}
                      </Typography>
                      <Typography sx={{ width: "20px", fontWeight: 600, fontSize: "13px", textAlign: "center", color: "#333" }}>
                        :
                      </Typography>
                      <Typography sx={{ flex: 1, fontWeight: 500, fontSize: "14px", color: "#0a3d62", wordBreak: "break-word" }}>
                        {value || "-"}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <>
            {/* BACK SIDE */}
            <Box sx={{ mt: 6, display: "flex", justifyContent: "center" }}>
              <Box display="flex" flexDirection="column" gap={1} sx={{ width: "100%", maxWidth: 350 }}>
                {[
                  { label: "Father’s Name", value: personalInfo.parent_guardian_name },
                  { label: "Res Address", value: personalInfo.address },
                  { label: "Contact No", value: personalInfo.phoneNumber },
                  { label: "Blood Group", value: student?.blood_group },
                ].map(({ label, value }) => (
                  <Box key={label} display="flex" alignItems="flex-start" mb={0}>
                    <Typography sx={{ width: "35%", fontWeight: 600, fontSize: "13px", color: "#333" }}>
                      {label}
                    </Typography>
                    <Typography sx={{ width: "20px", fontWeight: 600, fontSize: "13px", textAlign: "center", color: "#333" }}>
                      :
                    </Typography>
                    <Typography sx={{ flex: 1, fontWeight: 500, fontSize: "14px", color: "#0a3d62", wordBreak: "break-word" }}>
                      {value || "-"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottom Logo */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4, mt: 18 }}>
              <img src={logo2} alt="Logo" className="h-10 object-contain" />
            </Box>
          </>
        )}
      </Box>

      {/* Action Buttons */}
      <Box display="flex" gap={2}>
        <Tooltip title={isBack ? "View Front Side" : "View Back Side"}>
          <IconButton
            onClick={() => setIsBack(!isBack)}
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
