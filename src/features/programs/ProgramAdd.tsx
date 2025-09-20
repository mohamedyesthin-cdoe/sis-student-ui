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

const CourseForm = () => {
  const { id } = useParams(); // ✅ detect edit mode
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [duration, setDuration] = useState("3 Years");
  const [tabValue, setTabValue] = useState(0);
  const { showConfirm } = useAlert();

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
        courseId: id,
        courseName: "Sample Course " + id,
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
      setCourseId(sampleData.courseId);
      setCourseName(sampleData.courseName);
      setDuration(sampleData.duration);
      setSemesters(sampleData.semesters);
    }
  }, [id]);

  // Function to check if form is dirty
  const isFormDirty = () => {
    if (courseId || courseName || duration !== "3 Years") return true;
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
        () => {}
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
    setCourseId("");
    setCourseName("");
    setDuration("3 Years");
    setSemesters(initialSemesterData);
  };

  const handleSubmit = () => {
    if (!courseId.trim()) {
      showConfirm("Course ID is required.", () => {}, () => {});
      return;
    }
    if (!courseName.trim()) {
      showConfirm("Course Name is required.", () => {}, () => {});
      return;
    }
    if (!duration) {
      showConfirm("Please select a course duration.", () => {}, () => {});
      return;
    }

    for (let i = 0; i < semesters.length; i++) {
      const s = semesters[i];
      const fields = [
        "applicationFee",
        "admissionFee",
        "tuitionFee",
        "examFee",
        "lmsFee",
        "labFee",
      ];
      for (let field of fields) {
        if (!s[field] || Number(s[field]) < 0) {
          showConfirm(
            `Please enter a valid ${field.replace(/([A-Z])/g, " $1")} for Semester ${i + 1}.`,
            () => {},
            () => {}
          );
          return;
        }
      }
    }

    const courseData = { courseId, courseName, duration, semesters };
    console.log("Submitted Data:", courseData);

    showConfirm(
      id ? "Course updated successfully!" : "Course added successfully!",
      () => {},
      () => {}
    );
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
      {/* Course Details Section */}
      <CardComponent sx={{ p: 3 }}>
        <Subheader fieldName="Course Details" sx={{ mb: 2 }} />
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Course ID"
              variant="outlined"
              fullWidth
              size="small"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={!!id} // ✅ lock courseId when editing
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              label="Course Name"
              variant="outlined"
              fullWidth
              size="small"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
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

export default CourseForm;
