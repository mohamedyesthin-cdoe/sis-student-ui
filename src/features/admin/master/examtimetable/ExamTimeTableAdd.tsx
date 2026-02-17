import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  CircularProgress
} from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";

import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../context/AlertContext";
import { useLoader } from "../../../../context/LoaderContext";
import { useGlobalError } from "../../../../context/ErrorContext";
import { apiRequest } from "../../../../utils/ApiRequest";
import { ApiRoutes } from "../../../../constants/ApiConstants";

import CardComponent from "../../../../components/card/Card";
import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomDateInput from "../../../../components/inputs/customtext/CustomDateInput";
import CustomTimeInput from "../../../../components/inputs/customtext/CustomTimeInput";


// ================= TYPES =================

interface FormValues {
  exam_id: number | undefined;
  course_id: number | undefined;
  component_id: number | undefined;
  exam_date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
}

interface OptionType {
  label: string;
  value: number;
}


// ================= DEFAULT VALUES =================

const defaultValues: FormValues = {
  exam_id: undefined,
  course_id: undefined,
  component_id: undefined,
  exam_date: null,
  start_time: null,
  end_time: null,
};


// ================= VALIDATION =================

const schema: Yup.ObjectSchema<FormValues> = Yup.object({
  exam_id: Yup.number()
    .typeError("Exam is required")
    .required("Exam is required"),

  course_id: Yup.number()
    .typeError("Course is required")
    .required("Course is required"),

  component_id: Yup.number()
    .typeError("Component is required")
    .required("Component is required"),

  exam_date: Yup.date()
    .nullable()
    .required("Exam Date is required"),

  start_time: Yup.date()
    .nullable()
    .required("Start Time is required"),

  end_time: Yup.date()
    .nullable()
    .required("End Time is required"),
});


// ================= COMPONENT =================

export default function ExamTimetableAdd() {

  const navigate = useNavigate();
  const { id } = useParams();
  const { showAlert, showConfirm } = useAlert();
  const { loading } = useLoader();
  const { clearError } = useGlobalError();

  const [initialData, setInitialData] = useState<FormValues | null>(null);
  const [examList, setExamList] = useState<OptionType[]>([]);
  const [courseList, setCourseList] = useState<OptionType[]>([]);
  const [componentList, setComponentList] = useState<OptionType[]>([]);

const {
  control,
  handleSubmit,
  reset,
  formState: { errors, isDirty },
} = useForm<FormValues>({
  resolver: yupResolver(schema) as any,
  defaultValues,
});



  // ================= CLEAR ERROR =================

  useEffect(() => {
    clearError();
  }, [clearError]);


  // ================= LOAD DROPDOWNS =================

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const examRes = await apiRequest({ url: ApiRoutes.EXAMS, method: "get" });
        const courseRes = await apiRequest({ url: ApiRoutes.COURSES, method: "get" });
        const componentRes = await apiRequest({ url: ApiRoutes.COURSE_COMPONENTS, method: "get" });

        setExamList((examRes?.data || examRes).map((item: any) => ({
          label: item.exam_name,
          value: item.id,
        })));

        setCourseList((courseRes?.data || courseRes).map((item: any) => ({
          label: item.course_name,
          value: item.id,
        })));

        setComponentList((componentRes?.data || componentRes).map((item: any) => ({
          label: item.component_name,
          value: item.id,
        })));

      } catch {
        showAlert("Failed to load dropdown data", "error");
      }
    };

    loadDropdowns();
  }, [showAlert]);


  // ================= LOAD EDIT DATA =================

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const res = await apiRequest({
          url: `${ApiRoutes.EXAMTIMETABLES}/${id}`,
          method: "get",
        });

        const data = res?.data || res;

        const formattedData: FormValues = {
          exam_id: data.exam_id,
          course_id: data.course_id,
          component_id: data.component_id,
          exam_date: data.exam_date ? new Date(data.exam_date) : null,
          start_time: data.start_time
            ? new Date(`1970-01-01T${data.start_time}`)
            : null,
          end_time: data.end_time
            ? new Date(`1970-01-01T${data.end_time}`)
            : null,
        };

        setInitialData(formattedData);
        reset(formattedData);

      } catch {
        showAlert("Failed to load data", "error");
      }
    })();

  }, [id, reset, showAlert]);


  // ================= HANDLERS =================

  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Continue?",
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
      showAlert("Restored original data", "info");
    } else {
      reset(defaultValues);
      showAlert("Form cleared", "info");
    }
  };


  // ================= SUBMIT =================

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      const payload = {
        exam_id: formData.exam_id,
        course_id: formData.course_id,
        component_id: formData.component_id,
        exam_date: dayjs(formData.exam_date).format("YYYY-MM-DD"),
        start_time: dayjs(formData.start_time).format("HH:mm") + ":00.000Z",
        end_time: dayjs(formData.end_time).format("HH:mm") + ":00.000Z",
      };

      if (id) {
        await apiRequest({
          url: `${ApiRoutes.EXAMTIMETABLES}/${id}`,
          method: "put",
          data: payload,
        });
        showAlert("Updated successfully", "success");
      } else {
        await apiRequest({
          url: ApiRoutes.EXAMTIMETABLES,
          method: "post",
          data: payload,
        });
        showAlert("Created successfully", "success");
      }

      clearError();
      navigate("/exam-timetable/list", { replace: true });

    } catch (err: any) {
      showAlert(err?.detail || "Failed to save", "error");
    }
  };


  // ================= UI =================

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardComponent sx={{ p: 4 }}>
          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="exam_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Exam"
                    field={field}
                    options={examList}
                    error={errors.exam_id}
                    helperText={errors.exam_id?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="course_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Course"
                    field={field}
                    options={courseList}
                    error={errors.course_id}
                    helperText={errors.course_id?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="component_id"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    label="Component"
                    field={field}
                    options={componentList}
                    error={errors.component_id}
                    helperText={errors.component_id?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="exam_date"
                control={control}
                render={({ field }) => (
                  <CustomDateInput
                    label="Exam Date"
                    field={field}
                    error={!!errors.exam_date}
                    helperText={errors.exam_date?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <CustomTimeInput
                    label="Start Time"
                    field={field}
                    error={!!errors.start_time}
                    helperText={errors.start_time?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="end_time"
                control={control}
                render={({ field }) => (
                  <CustomTimeInput
                    label="End Time"
                    field={field}
                    error={!!errors.end_time}
                    helperText={errors.end_time?.message}
                  />
                )}
              />
            </Grid>

          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 4, justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleBack}>
              Back
            </Button>

            <Button variant="outlined" color="error" onClick={handleReset}>
              Reset
            </Button>

            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : id ? "Update" : "Submit"}
            </Button>
          </Box>

        </CardComponent>
      </form>
    </Box>
  );
}
