import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import CardComponent from "../../components/card/Card";
import Subheader from "../../components/subheader/Subheader";
import { useAlert } from "../../context/AlertContext";
import { ApiRoutes } from "../../constants/ApiConstants";
import { apiRequest } from "../../utils/ApiRequest";
import theme from "../../styles/theme";

// ✅ Validation schema
const ProgramSchema = Yup.object().shape({
  programId: Yup.string().required("Program ID is required"),
  programName: Yup.string().required("Program Name is required"),
  duration: Yup.string().required("Duration is required"),
  faculty: Yup.string().required("Faculty is required"),
  category: Yup.string().required("Category is required"),
});

type Semester = {
  applicationFee: string | number;
  admissionFee: string | number;
  tuitionFee: string | number;
  examFee: string | number;
  lmsFee: string | number;
  labFee: string | number;
  totalFee: number;
};

// ✅ Semester Form Group Component
type SemesterProps = {
  semesterIndex: number;
  control: any;
  handleFeeChange: (index: number, field: keyof Semester, value: string | number) => void;
  errors: any;
};

const SemesterFormGroup: React.FC<SemesterProps> = ({
  semesterIndex,
  control,
  handleFeeChange,
  errors,
}) => {
  const fields: { label: string; field: keyof Semester; readOnly?: boolean }[] = [
    { label: "Application Fee", field: "applicationFee" },
    { label: "Admission Fee", field: "admissionFee" },
    { label: "Tuition Fee", field: "tuitionFee" },
    { label: "Exam Fee", field: "examFee" },
    { label: "LMS Fee", field: "lmsFee" },
    { label: "Lab Fee", field: "labFee" },
    { label: "Total Fee", field: "totalFee", readOnly: true },
  ];

  return (
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {fields.map(({ label, field, readOnly }) => (
        <Grid key={field} xs={12} sm={6} md={4}>
          <Controller
            name={`semesters.${semesterIndex}.${field}`}
            control={control}
            render={({ field: controllerField }) => {
              const value = controllerField.value ?? "";
              return (
                <TextField
                  {...controllerField}
                  value={value}
                  label={label}
                  fullWidth
                  size="small"
                  type="number"
                  InputProps={readOnly ? { readOnly: true } : {}}
                  error={!!errors.semesters?.[semesterIndex]?.[field]}
                  helperText={errors.semesters?.[semesterIndex]?.[field]?.message as string}
                  onChange={(e) =>
                    !readOnly && handleFeeChange(semesterIndex, field, e.target.value)
                  }
                />
              );
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const ProgramForm = () => {
  const { id } = useParams();
  const { showConfirm, showAlert } = useAlert();

  const initialSemesterData: Semester[] = Array.from({ length: 6 }, () => ({
    applicationFee: "",
    admissionFee: "",
    tuitionFee: "",
    examFee: "",
    lmsFee: "",
    labFee: "",
    totalFee: 0,
  }));

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(ProgramSchema),
    defaultValues: {
      programId: "",
      programName: "",
      duration: "3",
      faculty: "",
      category: "UG",
      semesters: initialSemesterData.map(s => ({ ...s })), // fresh objects
    },
  });

  // ✅ Prefill data if editing
  useEffect(() => {
    if (!id) return;

    const fetchProgram = async () => {
      try {
        const res = await apiRequest({
          url: `${ApiRoutes.PROGRAMFETCH}/${id}`,
          method: "get",
        });

        const data = res.data || res;

        const semestersData: Semester[] = (data.fee || []).map((fee: any) => ({
          applicationFee: fee.application_fee || "",
          admissionFee: fee.admission_fee || "",
          tuitionFee: fee.tuition_fee || "",
          examFee: fee.exam_fee || "",
          lmsFee: fee.lms_fee || "",
          labFee: fee.lab_fee || "",
          totalFee: Number(fee.total_fee) || 0,
        }));

        reset({
          programId: data.programe_code || id,
          programName: data.programe || "",
          duration: data.duration || "3",
          faculty: data.faculty || "",
          category: data.category || "UG",
          semesters: semestersData.length
            ? semestersData.map(s => ({ ...s })) // deep copy
            : initialSemesterData.map(s => ({ ...s })),
        });
      } catch (err: any) {
        console.error("Failed to fetch program:", err.response?.data || err.message);
        showAlert(err.response?.data?.message || "Failed to fetch program details.", "error");
      }
    };

    fetchProgram();
  }, [id]);

  // ✅ Handle fee changes (totalFee excludes applicationFee)
  const handleFeeChange = (
    semesterIndex: number,
    field: keyof Semester,
    value: string | number
  ) => {
    const semestersCurrent: Semester[] = JSON.parse(
      JSON.stringify(getValues("semesters"))
    ); // deep clone

    semestersCurrent[semesterIndex][field] = value;

    const s = semestersCurrent[semesterIndex];
    s.totalFee =
      Number(s.admissionFee || 0) +
      Number(s.tuitionFee || 0) +
      Number(s.examFee || 0) +
      Number(s.lmsFee || 0) +
      Number(s.labFee || 0);

    setValue("semesters", semestersCurrent, { shouldDirty: true });
  };

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Are you sure you want to leave?",
        () => window.history.back(),
        () => { }
      );
    } else {
      window.history.back();
    }
  };

  const onSubmit = async (data: any) => {
    const fees = data.semesters.map((s: Semester, idx: number) => ({
      semester: `Semester ${idx + 1}`,
      application_fee: s.applicationFee,
      admission_fee: s.admissionFee,
      tuition_fee: s.tuitionFee,
      exam_fee: s.examFee,
      lms_fee: s.lmsFee,
      lab_fee: s.labFee,
      total_fee: String(s.totalFee || 0)
    }));
    console.log("dta", fees);


    const payload = {
      programe: data.programName,
      programe_code: data.programId,
      duration: data.duration,
      faculty: data.faculty,
      category: data.category,
      fees,
    };

    const apiUrl = id
      ? `${ApiRoutes.PROGRAMUPDATE}/${id}`
      : ApiRoutes.PROGRAMADD;

    const method = id ? "put" : "post";

    try {
      await apiRequest({ url: apiUrl, method, data: payload });
      showAlert(
        id ? "Program updated successfully!" : "Program added successfully!",
        "success"
      );
    } catch (err: any) {
      console.error("Program save failed:", err.response?.data || err.message);
      showAlert(
        err.response?.data?.message || "Something went wrong. Please try again.",
        "error"
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3, mb: 5 }}
    >
      {/* Program Details */}
      <CardComponent sx={{ p: 3 }}>
        <Subheader fieldName="Program Details" sx={{ mb: 2 }} />
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* Program ID */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="programId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Program ID"
                  fullWidth
                  size="small"
                  disabled={!!id}
                  error={!!errors.programId}
                  helperText={errors.programId?.message as string}
                />
              )}
            />
          </Grid>

          {/* Program Name */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="programName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Program Name"
                  fullWidth
                  size="small"
                  error={!!errors.programName}
                  helperText={errors.programName?.message as string}
                />
              )}
            />
          </Grid>

          {/* Duration (dropdown) */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="duration"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Duration"
                  fullWidth
                  size="small"
                  error={!!errors.duration}
                  helperText={errors.duration?.message as string}
                  sx={{
                    width: { xs: "100%", sm: 200 }, // ✅ constant width but responsive
                  }}
                >
                  <MenuItem value="1">1 Year</MenuItem>
                  <MenuItem value="2">2 Years</MenuItem>
                  <MenuItem value="3">3 Years</MenuItem>
                  <MenuItem value="4">4 Years</MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Faculty */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="faculty"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Faculty"
                  fullWidth
                  size="small"
                  error={!!errors.faculty}
                  helperText={errors.faculty?.message as string}
                />
              )}
            />
          </Grid>

          {/* Category (dropdown) */}
          <Grid item xs={12} sm={6} md={4}>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Category"
                  fullWidth
                  size="small"
                  error={!!errors.category}
                  helperText={errors.category?.message as string}
                  sx={{
                    width: { xs: "100%", sm: 200 }, // ✅ constant width but responsive
                  }}
                >
                  <MenuItem value="UG">UG</MenuItem>
                  <MenuItem value="PG">PG</MenuItem>
                </TextField>
              )}
            />
          </Grid>
        </Grid>

      </CardComponent>

      {/* Semester Fees */}
      <CardComponent sx={{ p: 3, mt: 4 }}>
        <Subheader fieldName="Semester Fee Details" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Box key={index} sx={{ mt: 3, mb: 3 }}>
            <Subheader
              fieldName={`Semester ${index + 1}`}
              sx={{ mb: 2, color: theme.palette.text.primary }}
            />
            <SemesterFormGroup
              semesterIndex={index}
              control={control}
              handleFeeChange={handleFeeChange}
              errors={errors}
            />
            {index < 5 && (
              <Divider
                sx={{
                  mt: 3,
                  mb: 3,
                  borderColor: theme.palette.text.disabled,
                  borderBottomWidth: 1,
                  width: "80%",
                  mx: "auto",
                }}
              />
            )}
          </Box>
        ))}
      </CardComponent>

      {/* Buttons */}
      <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="primary" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() =>
            reset({
              programId: "",
              programName: "",
              duration: "3",
              faculty: "",
              category: "UG",
              semesters: initialSemesterData.map(s => ({ ...s })),
            })
          }
        >
          Reset
        </Button>
        <Button variant="contained" color="secondary" type="submit">
          {id ? "Update" : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProgramForm;
