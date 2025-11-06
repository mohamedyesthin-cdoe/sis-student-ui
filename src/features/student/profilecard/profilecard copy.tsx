import React, { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  Box,
  Typography,
  // Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FlipIcon from "@mui/icons-material/FlipCameraAndroid";
import DownloadIcon from "@mui/icons-material/Download";
import logo2 from "/assets/logo2.png";
// import maleimage from '/assets/images/male-logo.jpg'
// import femaleimage from '/assets/images/female-logo.jpg'
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
    fullName: `${student?.first_name || ""} ${student?.last_name || ""}`,
    email: student?.email,
    phoneNumber: student?.mobile_number,
    program: "B.Sc Data Science",
    department: student?.department || "CDOE",
    batch: student?.batch || "July",
    year: student?.year || "2025",
    registration_no: student?.registration_no,
    parent_guardian_name: student?.parent_guardian_name,
    address: `${student?.address_details?.corr_addr1}, - ${student?.address_details?.corr_pin}`,
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
  const gender = getValue("gender");
  // const userimage = gender == 'Male' ? maleimage : femaleimage
  const userimage = 'https://d1jgwwhd2xazx1.cloudfront.net/uploads/student/document/6719/21235/2025/09/16/68c93391d0bdf518716830_PHOTO.jpg?Expires=1762317025&Signature=LX8EPDqTM8Mgz3kRXuYLnHVP1FUNVaFmNKks-AcmEmhw23MmnBlylsNwW5pYKQZxh1UV7JixF9aIzeD0yZ3smRFmLhmOxIZCjkuunDfZndCdWZSlhgRcoiw151ECXu9Vhim4qb513g7BRpHFs310IVOPSCgAoxfvVV7iQI7YdoOZiMjs99UgFPB1uqQi4y7SXG4BrgHd44NSHWX5OSD-LFlEjAQ9fQZNXr~21BuqGo1GKIfAEGbYSSXcM3fbdij8~RUtOdU82j7RbIPElBVEfsZM~yg2nD-1Z2nDKrV6QC~DrdCNBSy~en0atuJgAZPRrCIQvsCW0NSaFw~-JIL7gQ__&Key-Pair-Id=K3KU6FKMGSED79'

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
    <Box className="flex flex-col items-center my-6 space-y-5 px-3">
      {/* CARD */}
      <Box
        ref={cardRef}
        sx={{
          width: { xs: 270, sm: 310, md: 340, lg: 360 },
          height: { xs: 420, sm: 470, md: 500, lg: 520 },
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: 4,
          background: isBack
            ? "linear-gradient(to bottom, #e74c3c, #fbeedb)"
            : "linear-gradient(to bottom, #f44336, #fff3e0)",
          position: "relative",
          p: { xs: 2, sm: 3 },
          transition: "all 0.3s ease-in-out",
        }}
      >
        {/* FRONT SIDE */}
        {!isBack ? (
          <>
            {/* Header Logo */}
            <Box
              className="bg-white flex justify-center items-center mx-auto mt-1 rounded-lg shadow-sm"
              sx={{
                width: "95%",
                py: { xs: 1, sm: 1.5 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <img
                src={logo2}
                alt="Logo"
                className="object-contain"
                style={{ height: "48px", maxWidth: "80%" }}
              />
            </Box>

            {/* Avatar */}
            <Box
              className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-white shadow-md rounded-full"
              sx={{
                top: { xs: 110, sm: 130, md: 140 },
                width: { xs: 120, sm: 140, md: 150 },
                height: { xs: 120, sm: 140, md: 150 },
                border: "4px solid #f44336",
              }}
            >
              <img
                src={userimage}
                alt="Student"
                style={{
                  width: "136px",
                  height: "142px",
                  borderRadius: "50%",
                  // objectFit: "cover",
                  display: "block",
                  // margin: "20px auto", // vertical + centered horizontally
                  padding:'8px'
                }}
              />


            </Box>

            {/* Info Section */}
            <Box
              className="absolute w-full"
              sx={{
                bottom: { xs: 35, sm: 45 },
                px: { xs: 2, sm: 3 },
              }}
            >
              <Typography
                sx={{
                  color: "#b71c1c",
                  fontWeight: 700,
                  fontSize: { xs: "15px", sm: "17px", md: "18px" },
                  textAlign: "center",
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                {personalInfo.fullName}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0.8}
                  sx={{ width: "100%", maxWidth: 350 }}
                >
                  {[
                    { label: "Roll No", value: personalInfo.registration_no },
                    { label: "Program", value: personalInfo.program },
                    { label: "Dept", value: personalInfo.department },
                    { label: "Session", value: student?.session || "JULY – 2025" },
                  ].map(({ label, value }) => (
                    <Box key={label} display="flex" alignItems="flex-start">
                      <Typography
                        sx={{
                          width: "35%",
                          fontWeight: 600,
                          fontSize: { xs: "12px", sm: "13px", md: "14px" },
                          color: "#333",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          width: "20px",
                          fontWeight: 600,
                          fontSize: { xs: "12px", sm: "13px", md: "14px" },
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
                          fontSize: { xs: "12px", sm: "13.5px", md: "14px" },
                          color: "#0a3d62",
                          wordBreak: "break-word",
                        }}
                      >
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
            <Box
              sx={{
                mt: { xs: 5, sm: 7 },
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                display="flex"
                flexDirection="column"
                gap={0.7}
                sx={{ width: "100%", maxWidth: 350 }}
              >
                {[
                  { label: "Father’s Name", value: personalInfo.parent_guardian_name },
                  { label: "Address", value: personalInfo.address },
                  { label: "Contact No", value: personalInfo.phoneNumber },
                  { label: "Blood Group", value: student?.blood_group },
                ].map(({ label, value }) => (
                  <Box key={label} display="flex" alignItems="flex-start">
                    <Typography
                      sx={{
                        width: "35%",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "13px" },
                        color: "#333",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        width: "20px",
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "13px" },
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
                        fontSize: { xs: "12px", sm: "13.5px" },
                        color: "#0a3d62",
                        wordBreak: "break-word",
                      }}
                    >
                      {value || "-"}
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
                mb: { xs: 3, sm: 4 },
                mt: { xs: 14, sm: 18 },
              }}
            >
              <img
                src={logo2}
                alt="Logo"
                className="object-contain"
                style={{ height: "42px", maxWidth: "75%" }}
              />
            </Box>
          </>
        )}
      </Box>

      {/* ACTION BUTTONS */}
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        <Tooltip title={isBack ? "View Front Side" : "View Back Side"}>
          <IconButton
            onClick={() => setIsBack(!isBack)}
            sx={{
              backgroundColor: "#105c8e",
              color: "#fff",
              "&:hover": { backgroundColor: "#0a4368" },
              width: { xs: 38, sm: 42 },
              height: { xs: 38, sm: 42 },
            }}
          >
            <FlipIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download PDF">
          <IconButton
            onClick={handleDownloadBothSidesPDF}
            sx={{
              backgroundColor: "#BF2728",
              color: "#fff",
              "&:hover": { backgroundColor: "#a11f20" },
              width: { xs: 38, sm: 42 },
              height: { xs: 38, sm: 42 },
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default StudentIdCard;
