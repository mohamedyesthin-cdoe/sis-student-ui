import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Box,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import CardComponent from "../../components/card/Card";
import { useAlert } from "../../context/AlertContext";
import Subheader from "../../components/subheader/Subheader";
import { ApiRoutes } from "../../constants/ApiConstants";
import { apiRequest } from "../../utils/ApiRequest";

const ProgramForm = () => {
  const { id } = useParams(); // ✅ detect edit mode
  const [programId, setProgramId] = useState("");
  const [programName, setProgramName] = useState("");
  const [duration, setDuration] = useState("3 Years");
  const [tabValue, setTabValue] = useState(0);
  const { showConfirm } = useAlert();
  const {showAlert} = useAlert()

  const initialSemesterData = Array.from({ length: 6 }, () => ({
    applicationFee: "",
    admissionFee: "",
    tuitionFee: "",
    examFee: "",
    lmsFee: "",
    labFee: "",
    totalFee: 0,
  }));

  const [semesters, setSemesters] = useState(initialSemesterData);

  // ✅ Prefill if editing
  useEffect(() => {
    if (id) {
      // Replace with real API call if needed
      const sampleData = {
        programId: id,
        programName: "Sample Program " + id,
        duration: "3 Years",
        semesters: initialSemesterData.map((s, idx) => ({
          ...s,
          applicationFee: "500",
          admissionFee: "1000",
          tuitionFee: "2000",
          examFee: "300",
          lmsFee: "200",
          labFee: "400",
          totalFee: 4400,
        })),
      };
      setProgramId(sampleData.programId);
      setProgramName(sampleData.programName);
      setDuration(sampleData.duration);
      setSemesters(sampleData.semesters);
    }
  }, [id]);

  // Function to check if form is dirty
  const isFormDirty = () => {
    if (programId || programName || duration !== "3 Years") return true;
    for (let i = 0; i < semesters.length; i++) {
      const s = semesters[i];
      const initial = initialSemesterData[i];
      if (
        s.applicationFee !== initial.applicationFee ||
        s.admissionFee !== initial.admissionFee ||
        s.tuitionFee !== initial.tuitionFee ||
        s.examFee !== initial.examFee ||
        s.lmsFee !== initial.lmsFee ||
        s.labFee !== initial.labFee
      ) {
        return true;
      }
    }
    return false;
  };

  const handleBack = () => {
    if (isFormDirty()) {
      showConfirm(
        "You have unsaved changes. Are you sure you want to leave?",
        () => window.history.back(),
        () => { }
      );
    } else {
      window.history.back();
    }
  };

  const handleFeeChange = (semesterIndex: number, field: string, value: string) => {
    const updatedSemesters = [...semesters];
    // @ts-ignore
    updatedSemesters[semesterIndex][field] = value;

    const s = updatedSemesters[semesterIndex];
    const total =
      Number(s.applicationFee || 0) +
      Number(s.admissionFee || 0) +
      Number(s.tuitionFee || 0) +
      Number(s.examFee || 0) +
      Number(s.lmsFee || 0) +
      Number(s.labFee || 0);

    updatedSemesters[semesterIndex].totalFee = total;

    setSemesters(updatedSemesters);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReset = () => {
    setProgramId("");
    setProgramName("");
    setDuration("3 Years");
    setSemesters(initialSemesterData);
  };

  const handleSubmit = () => {
  if (!programId.trim()) {
    showAlert("Program ID is required.", 'error');
    return;
  }
  if (!programName.trim()) {
    showAlert("Program Name is required.", 'error');
    return;
  }
  if (!duration) {
    showAlert("Please select a program duration.", 'error');
    return;
  }

  // Validate semesters
  for (let i = 0; i < semesters.length; i++) {
    const s = semesters[i];
    const fields = ["applicationFee", "admissionFee", "tuitionFee", "examFee", "lmsFee", "labFee"];
    for (let field of fields) {
      if (!s[field] || Number(s[field]) < 0) {
        showAlert(
          `Please enter a valid ${field.replace(/([A-Z])/g, " $1")} for Semester ${i + 1}.`,
         'error'
        );
        return;
      }
    }
  }

  // Map semesters to backend fees format
  const fees = semesters.map((s, idx) => ({
    semester: `Semester ${idx + 1}`,
    application_fee: s.applicationFee,
    admission_fee: s.admissionFee,
    tuition_fee: s.tuitionFee,
    exam_fee: s.examFee,
    lms_fee: s.lmsFee,
    lab_fee: s.labFee,
    total_fee: String(s.totalFee), // make sure total_fee is string
  }));

  // Construct payload
  const payload = {
    programe: programName,
    programe_code: programId,
    duration,
    fees,
  };

  console.log("Payload:", payload);

  // API call
  const apiUrl = id ? `${ApiRoutes.PROGRAMADD}/${id}` : ApiRoutes.PROGRAMADD;

  apiRequest({
    url: apiUrl,
    method: id ? "put" : "post",
    data: payload,
  })
    .then(() => {
      showAlert(
        id ? "Program updated successfully!" : "Program added successfully!",
       'success'
      );
    })
    .catch((err) => {
      showAlert("Something went wrong. Please try again.", 'error');
      console.error(err);
    });
};


  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { xs: "350px", sm: "900px", md: "1200px" },
        mx: "auto",
        mt: 3,
        mb: 5,
      }}
    >
      {/* Program Details Section */}
      <CardComponent sx={{ p: 3 }}>
        <Subheader fieldName="Program Details" sx={{ mb: 2 }} />
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Program ID"
              variant="outlined"
              fullWidth
              size="small"
              value={programId}
              onChange={(e) => setProgramId(e.target.value)}
              disabled={!!id}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Program Name"
              variant="outlined"
              fullWidth
              size="small"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              label="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="1 Year">1 Year</MenuItem>
              <MenuItem value="2 Years">2 Years</MenuItem>
              <MenuItem value="3 Years">3 Years</MenuItem>
              <MenuItem value="4 Years">4 Years</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </CardComponent>

      {/* Semester Fee Details */}
      <CardComponent sx={{ p: 3, mt: 4 }}>
        <Subheader fieldName="Semester Fee Details" />
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Tab key={index} label={`Semester ${index + 1}`} />
          ))}
        </Tabs>

        <Box>
          <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {[
              { label: "Application Fee", field: "applicationFee" },
              { label: "Admission Fee", field: "admissionFee" },
              { label: "Tuition Fee", field: "tuitionFee" },
              { label: "Exam Fee", field: "examFee" },
              { label: "LMS Fee", field: "lmsFee" },
              { label: "Lab Fee", field: "labFee" },
              { label: "Total Fee", field: "totalFee", readOnly: true },
            ].map(({ label, field, readOnly }) => (
              <Grid key={field} size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  label={label}
                  variant="outlined"
                  fullWidth
                  size="small"
                  type="number"
                  value={semesters[tabValue][field]}
                  InputProps={readOnly ? { readOnly: true } : {}}
                  onChange={(e) =>
                    !readOnly && handleFeeChange(tabValue, field, e.target.value)
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </CardComponent>

      {/* Buttons */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          {id ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProgramForm;
