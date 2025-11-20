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

import CardComponent from "../../../components/card/Card";
import Customtext from "../../../components/customtext/Customtext";
import { useAlert } from "../../../context/AlertContext";
import { ApiRoutes } from "../../../constants/ApiConstants";
import { apiRequest } from "../../../utils/ApiRequest";
import theme from "../../../styles/theme";
import { useGlobalError } from "../../../context/ErrorContext";
import { useLoader } from "../../../context/LoaderContext";
import ProgramFeeSkeleton from "../../../components/card/skeletonloader/ProgramFeeSkeleton";


// ✅ Validation schema
const ProgramSchema: Yup.ObjectSchema<ProgramFormValues> = Yup.object().shape({
  programId: Yup.string().required("Program ID is required"),
  programName: Yup.string().required("Program Name is required"),
  duration: Yup.string().required("Duration is required"),
  faculty: Yup.string().required("Faculty is required"),
  category: Yup.string().required("Category is required"),
  semesters: Yup.array()
    .of(
      Yup.object().shape({
        applicationFee: Yup.number().required(),
        admissionFee: Yup.number().required(),
        tuitionFee: Yup.number().required(),
        examFee: Yup.number().required(),
        lmsFee: Yup.number().required(),
        labFee: Yup.number().required(),
        totalFee: Yup.number().required(),
      })
    )
    .required(),
});


type Semester = {
  applicationFee: number;
  admissionFee: number;
  tuitionFee: number;
  examFee: number;
  lmsFee: number;
  labFee: number;
  totalFee: number;
};

type ProgramFormValues = {
  programId: string;
  programName: string;
  duration: string;
  faculty: string;
  category: string;
  semesters: Semester[];
};


// ✅ Semester Form Group Component
type SemesterProps = {
  semesterIndex: number;
  control: any;
  handleFeeChange: (
    index: number,
    field: keyof Semester,
    value: string | number
  ) => void;
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
    <Grid container spacing={2}>
      {fields.map(({ label, field, readOnly }) => (
        <Grid size={{ xs: 12, md: 3 }} my={1}>
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
                    !readOnly &&
                    handleFeeChange(semesterIndex, field, Number(e.target.value) || 0)
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
  const { error } = useGlobalError();
  const { loading } = useLoader()
  const initialSemesterData: Semester[] = Array.from({ length: 6 }, () => ({
    applicationFee: 0,
    admissionFee: 0,
    tuitionFee: 0,
    examFee: 0,
    lmsFee: 0,
    labFee: 0,
    totalFee: 0,
  }));

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProgramFormValues>({
    resolver: yupResolver(ProgramSchema),
    defaultValues: {
      programId: "",
      programName: "",
      duration: "3",
      faculty: "",
      category: "UG",
      semesters: initialSemesterData, // all numbers
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
          applicationFee: Number(fee.application_fee) || 0,
          admissionFee: Number(fee.admission_fee) || 0,
          tuitionFee: Number(fee.tuition_fee) || 0,
          examFee: Number(fee.exam_fee) || 0,
          lmsFee: Number(fee.lms_fee) || 0,
          labFee: Number(fee.lab_fee) || 0,
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
    const numericValue = typeof value === "string" ? Number(value) || 0 : value;

    const semestersCurrent = [...getValues("semesters")];
    semestersCurrent[semesterIndex] = {
      ...semestersCurrent[semesterIndex],
      [field]: numericValue,
    };

    const s = semestersCurrent[semesterIndex];
    s.totalFee =
      (s.admissionFee || 0) +
      (s.tuitionFee || 0) +
      (s.examFee || 0) +
      (s.lmsFee || 0) +
      (s.labFee || 0);

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
    <>
      {
        error.type === "NONE" && (
          loading ? (
            <ProgramFeeSkeleton />
          )
            : (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ width: "100%", maxWidth: { xs: '350px', sm: '900px', md: '1300px' }, mx: "auto", mt: 3, mb: 5 }}
              >
                {/* Program Details */}
                <CardComponent sx={{ p: 3 }}>
                  <Customtext fieldName="Program Details" sx={{
                    mb: 2, fontSize: {
                      xs: '0.875rem', // 14px
                      sm: '1rem',     // 16px
                      md: '1.125rem', // 18px
                      lg: '1rem',  // 20px
                      xl: '1.5rem',   // 24px
                    },
                  }} />
                  <Grid container spacing={2}>
                    {/* Program ID */}
                    <Grid size={{ xs: 12, md: 3 }} my={1}>
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
                    <Grid size={{ xs: 12, md: 3 }} my={1}>
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
                    <Grid container size={{ xs: 12, md: 3 }} my={1}>
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
                    <Grid container size={{ xs: 12, md: 3 }} my={1}>
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
                    <Grid container size={{ xs: 12, md: 3 }} my={1}>
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
                  <Customtext fieldName="Semester Fee Details"
                    sx={{
                      fontSize: {
                        xs: '0.875rem', // 14px
                        sm: '1rem',     // 16px
                        md: '1.125rem', // 18px
                        lg: '1rem',  // 20px
                        xl: '1.5rem',   // 24px
                      },
                    }} />
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Box key={index} sx={{ mt: 3, mb: 3 }}>
                      <Customtext
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
                <Box
                  mt={4}
                  display="flex"
                  gap={2}
                  sx={{
                    justifyContent: {
                      xs: "center", // center on mobile
                      sm: "flex-end", // right align on tablet and above
                    },
                  }}
                >
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
                        semesters: initialSemesterData.map((s) => ({ ...s })),
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
            )
        )
      }
    </>
  );
};

export default ProgramForm;
