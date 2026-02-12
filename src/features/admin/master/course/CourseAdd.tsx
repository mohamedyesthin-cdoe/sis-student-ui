import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import CardComponent from "../../../../components/card/Card";
import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomNumberInput from "../../../../components/inputs/customtext/CustomNumberInput";
import apiClient from "../../../../services/ApiClient";

/* -------------------------------- types -------------------------------- */

interface FormValues {
  semester_id: string;
  dept_code: string;
  main_code: string;
  main_course: string;
  course_order: number;
  course_type: string;
  course_code: string;
  course_title: string;
  credits: number;
  regulation_pattern: string;
}

const defaultValues: FormValues = {
  semester_id: "",
  dept_code: "",
  main_code: "",
  main_course: "",
  course_order: 0,
  course_type: "",
  course_code: "",
  course_title: "",
  credits: 0,
  regulation_pattern: "",
};

/* ----------------------------- validation ------------------------------- */

const schema = Yup.object().shape({
  semester_id: Yup.string().required("Semester is required"),
  dept_code: Yup.string().required("Department Code is required"),
  main_code: Yup.string().required("Main Code is required"),
  main_course: Yup.string().required("Main Course is required"),
  course_order: Yup.number().min(1).required("Course Order is required"),
  course_type: Yup.string().required("Course Type is required"),
  course_code: Yup.string().required("Course Code is required"),
  course_title: Yup.string().required("Course Title is required"),
  credits: Yup.number().min(0).required("Credits are required"),
  regulation_pattern: Yup.string().required("Regulation Pattern is required"),
});

/* ----------------------------- component -------------------------------- */

export default function CourseAdd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showAlert, showConfirm } = useAlert();
  const { loading } = useLoader();
  const { clearError } = useGlobalError();

  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [semesters, setSemesters] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  /* -------------------------- fetch semesters ---------------------------- */

  useEffect(() => {
    clearError();

    const fetchSemesters = async () => {
      try {
        const res = await apiClient.get(ApiRoutes.SEMESTERS);

        const mapped = (res.data || []).map((s: any) => ({
          value: String(s.id),
          label: `${s.semester_name} - ${s.semester_no}`,
        }));

        setSemesters(mapped);
      } catch {
        showAlert("Failed to load semesters list", "error");
      }
    };

    fetchSemesters();
  }, []);

  /* --------------------------- edit mode -------------------------------- */

  useEffect(() => {
    if (!id || semesters.length === 0) return;

    const courseId = Number(id);
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await apiClient.get(
          `${ApiRoutes.COURSES}/${courseId}`
        );

        const data = res.data;

        const formatted: FormValues = {
          semester_id: String(data.semester_id),
          dept_code: data.dept_code,
          main_code: data.main_code,
          main_course: data.main_course,
          course_order: data.course_order,
          course_type: data.course_type,
          course_code: data.course_code,
          course_title: data.course_title,
          credits: data.credits,
          regulation_pattern: data.regulation_pattern,
        };

        setInitialData(formatted);
        reset(formatted);
      } catch (error: any) {
        showAlert(
          error?.response?.data?.detail ||
          "Failed to load course details",
          "error"
        );
      }
    };

    fetchCourse();
  }, [id, semesters.length]);

  /* ----------------------------- handlers -------------------------------- */

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Your changes will be lost.",
        () => navigate(-1),
        () => {}
      );
    } else {
      navigate(-1);
    }
  };

  const handleReset = () => {
    if (id && initialData) {
      reset(initialData);
      showAlert("Original values restored", "info");
    } else {
      reset(defaultValues);
      showAlert("Form cleared", "info");
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = {
        semester_id: Number(data.semester_id),
        dept_code: data.dept_code,
        main_code: data.main_code,
        main_course: data.main_course,
        course_order: Number(data.course_order),
        course_type: data.course_type,
        course_code: data.course_code,
        course_title: data.course_title,
        credits: Number(data.credits),
        regulation_pattern: data.regulation_pattern,
      };

      if (id) {
        await apiRequest({
          url: `${ApiRoutes.COURSES}/${Number(id)}`,
          method: "put",
          data: payload,
        });
        showAlert("Course updated successfully", "success");
      } else {
        await apiRequest({
          url: ApiRoutes.COURSES,
          method: "post",
          data: payload,
        });
        showAlert("Course created successfully", "success");
      }

      navigate("/courses/list");
    } catch (error: any) {
      showAlert(error?.detail || "Failed to save course", "error");
    }
  };

  /* ------------------------------- UI ----------------------------------- */

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardComponent sx={{ p: 4 }}>
          <Grid container spacing={3}>

            {/* Semester */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="semester_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Semester"
                    field={field}
                    options={semesters}
                    error={errors.semester_id}
                    helperText={errors.semester_id?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="dept_code"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Department Code"
                    field={field}
                    error={!!errors.dept_code}
                    helperText={errors.dept_code?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="main_code"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Main Code"
                    field={field}
                    error={!!errors.main_code}
                    helperText={errors.main_code?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="main_course"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Main Course"
                    field={field}
                    error={!!errors.main_course}
                    helperText={errors.main_course?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="course_order"
                control={control}
                render={({ field }) => (
                  <CustomNumberInput
                    label="Course Order"
                    value={field.value ?? ""}
                    error={!!errors.course_order}
                    helperText={errors.course_order?.message}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="course_type"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Course Type"
                    field={field}
                    error={!!errors.course_type}
                    helperText={errors.course_type?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="course_code"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Course Code"
                    field={field}
                    error={!!errors.course_code}
                    helperText={errors.course_code?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="course_title"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Course Title"
                    field={field}
                    error={!!errors.course_title}
                    helperText={errors.course_title?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="credits"
                control={control}
                render={({ field }) => (
                  <CustomNumberInput
                    label="Credits"
                    value={field.value ?? ""}
                    error={!!errors.credits}
                    helperText={errors.credits?.message}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="regulation_pattern"
                control={control}
                render={({ field }) => (
                  <CustomInputText
                    label="Regulation Pattern"
                    field={field}
                    error={!!errors.regulation_pattern}
                    helperText={errors.regulation_pattern?.message}
                  />
                )}
              />
            </Grid>

          </Grid>

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleBack}>
              Back
            </Button>

            <Button variant="outlined" color="error" onClick={handleReset}>
              Reset
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : id ? "Update" : "Submit"}
            </Button>
          </Box>
        </CardComponent>
      </form>
    </Box>
  );
}
