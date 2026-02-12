import { useEffect, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import apiClient from "../../../../services/ApiClient";
import { ApiRoutes } from "../../../../constants/ApiConstants";
import { useAlert } from "../../../../context/AlertContext";

import CardComponent from "../../../../components/card/Card";
import CustomInputText from "../../../../components/inputs/customtext/CustomInputText";
import CustomSelect from "../../../../components/inputs/customtext/CustomSelect";
import CustomCheckboxInput from "../../../../components/inputs/customtext/CustomCheckboxInput";

interface CourseOption {
  value: number;
  label: string;
  course_code: string;
}

interface FormValues {
  course_id: number;
  component_no: number;
  component_type: string;
  component_code: string;
  component_description: string;

  max_marks: number;
  min_marks: number;
  min_percentage: number;
  exam_mark: number;

  is_theory: boolean;
  is_practical: boolean;
  is_ia: boolean;
  is_computed: boolean;
  is_others: boolean;

  specify_others: string;
  core_or_elective: string;
  is_programme_elective: boolean;
  elective_type: string;
  elective_programe_type: string;

  attendence_percentage: number;
  book_type: string;
  mcq_time: string;
  is_tpi: string;

  incl_credit: boolean;
  techorder: number;
  approved: boolean;
  is_maincode: boolean;
}

const defaultValues: FormValues = {
  course_id: 0,
  component_no: 0,
  component_type: "",
  component_code: "",
  component_description: "",

  max_marks: 0,
  min_marks: 0,
  min_percentage: 0,
  exam_mark: 0,

  is_theory: false,
  is_practical: false,
  is_ia: false,
  is_computed: false,
  is_others: false,

  specify_others: "",
  core_or_elective: "",
  is_programme_elective: false,
  elective_type: "",
  elective_programe_type: "",

  attendence_percentage: 0,
  book_type: "",
  mcq_time: "",
  is_tpi: "",

  incl_credit: true,
  techorder: 0,
  approved: false,
  is_maincode: true,
};

const componentNoOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
];

const coreElectiveOptions = [
  { label: "Core", value: "Core" },
  { label: "Elective", value: "Elective" },
];

export default function CourseComponentAdd() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showAlert, showConfirm } = useAlert();

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, formState: { isDirty } } = useForm<FormValues>({
    defaultValues,
  });


  const selectedCourseId = watch("course_id");
  const selectedComponentNo = watch("component_no");
  const selectedComponentType = watch("component_type");
  const selectedCoreElective = watch("core_or_elective");

  /* ----------------------------- LOAD COURSES ----------------------------- */
  useEffect(() => {
    apiClient.get(ApiRoutes.COURSES).then((res) => {
      const mapped = (res.data || []).map((c: any) => ({
        value: c.id,
        label: c.course_title,
        course_code: c.course_code,
      }));
      setCourses(mapped);
    });
  }, []);

  /* ----------------------------- AUTO FILL COURSE ----------------------------- */
  useEffect(() => {
    const selected = courses.find((c) => c.value === selectedCourseId);
    if (!selected) return;
    setValue("component_description", selected.label);
    setValue("component_code", selected.course_code);
  }, [selectedCourseId, courses, setValue]);

  /* ----------------------------- AUTO COMPONENT TYPE ----------------------------- */
  useEffect(() => {
    if (selectedComponentNo === 1) setValue("component_type", "CIA");
    else if (selectedComponentNo === 2) setValue("component_type", "ESE");
    else if (selectedComponentNo === 3) setValue("component_type", "TOTAL");
    else setValue("component_type", "");
  }, [selectedComponentNo, setValue]);

  /* ----------------------------- AUTO CHECKBOX & MARKS RULES ----------------------------- */
  useEffect(() => {
    if (selectedComponentType === "CIA") {
      setValue("is_ia", true);
      setValue("is_theory", false);
      setValue("is_computed", false);
      setValue("max_marks", 30);
      setValue("min_marks", 0);
      setValue("min_percentage", 0);
      setValue("exam_mark", 0);
    } else if (selectedComponentType === "ESE") {
      setValue("is_ia", false);
      setValue("is_theory", true);
      setValue("is_computed", false);
      setValue("max_marks", 70);
      setValue("min_marks", 35);
      setValue("min_percentage", 50);
      setValue("exam_mark", 100);
    } else if (selectedComponentType === "TOTAL") {
      setValue("is_ia", false);
      setValue("is_theory", false);
      setValue("is_computed", true);
      setValue("max_marks", 100);
      setValue("min_marks", 50);
      setValue("min_percentage", 50);
      setValue("exam_mark", 0);
    }
  }, [selectedComponentType, setValue]);

  /* ----------------------------- CORE/ELECTIVE ----------------------------- */
  useEffect(() => {
    setValue("is_programme_elective", selectedCoreElective === "Elective");
  }, [selectedCoreElective, setValue]);

  /* ----------------------------- EDIT MODE ----------------------------- */
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get(`${ApiRoutes.COURSE_COMPONENTS}/${id}`)
      .then((res) => reset(res.data))
      .catch(() => showAlert("Failed to load component details", "error"))
      .finally(() => setLoading(false));
  }, [id, reset, showAlert]);


  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "Unsaved changes will be lost. Continue?",
        () => navigate(-1)
      );
    } else {
      navigate(-1);
    }
  };

  /* ----------------------------- SUBMIT ----------------------------- */
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      if (id) await apiClient.put(`${ApiRoutes.COURSE_COMPONENTS}/${id}`, data);
      else await apiClient.post(ApiRoutes.COURSE_COMPONENTS, data);

      showAlert(`Component ${id ? "updated" : "created"} successfully`, "success");
      navigate("/course-components/list");
    } catch {
      showAlert("Failed to save component", "error");
    }
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardComponent sx={{ p: 4 }}>
          <Grid container spacing={2}>

            {/* ROW 1: Course + Component Code + Component Description */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="course_id"
                control={control}
                render={({ field }) => <CustomSelect label="Course" field={field} options={courses} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="component_code"
                control={control}
                render={({ field }) => <CustomInputText label="Component Code" field={field} disabled />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="component_description"
                control={control}
                render={({ field }) => <CustomInputText label="Component Description" field={field} disabled />}
              />
            </Grid>

            {/* ROW 2: Component No + Component Type */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="component_no"
                control={control}
                render={({ field }) => <CustomSelect label="Component No" field={field} options={componentNoOptions} />}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Controller
                name="component_type"
                control={control}
                render={({ field }) => <CustomInputText label="Component Type" field={field} disabled />}
              />
            </Grid>

            {/* ROW 3: Marks */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="max_marks" control={control} render={({ field }) => <CustomInputText label="Max Marks" type="number" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="min_marks" control={control} render={({ field }) => <CustomInputText label="Min Marks" type="number" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="min_percentage" control={control} render={({ field }) => <CustomInputText label="Min Percentage" type="number" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="exam_mark" control={control} render={({ field }) => <CustomInputText label="Exam Mark" type="number" field={field} />} />
            </Grid>

            {/* ROW 4: Attendance + Core/Elective + Elective Type + Elective Programme Type */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="attendence_percentage" control={control} render={({ field }) => <CustomInputText label="Attendance Percentage" type="number" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="core_or_elective" control={control} render={({ field }) => <CustomSelect label="Core / Elective" field={field} options={coreElectiveOptions} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="elective_type" control={control} render={({ field }) => <CustomInputText label="Elective Type" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="elective_programe_type" control={control} render={({ field }) => <CustomInputText label="Elective Programme Type" field={field} />} />
            </Grid>

            {/* ROW 5: Book Type, MCQ, TPI, TechOrder */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="book_type" control={control} render={({ field }) => <CustomInputText label="Book Type" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="mcq_time" control={control} render={({ field }) => <CustomInputText label="MCQ Time" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="is_tpi" control={control} render={({ field }) => <CustomInputText label="TPI" field={field} />} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="techorder" control={control} render={({ field }) => <CustomInputText label="Tech Order" type="number" field={field} />} />
            </Grid>

            {/* CHECKBOX ROW 1 */}
            {["is_theory", "is_practical", "is_ia", "is_computed", "is_others"].map((k) => (
              <Grid key={k} size={{ xs: 12, md: 3 }}>
                <Controller
                  name={k as keyof FormValues}
                  control={control}
                  render={({ field }) => {
                    // Convert label
                    let label = k.replace(/_/g, " "); // "is ia"
                    label = label.replace(/^is /i, ""); // remove leading "is " -> "ia"
                    // Special handling for acronyms
                    if (["ia", "tpi"].includes(label.toLowerCase())) label = label.toUpperCase();
                    else label = label.replace(/\b\w/g, l => l.toUpperCase()); // capitalize first letter
                    return <CustomCheckboxInput label={label} field={field} />;
                  }}
                />
              </Grid>
            ))}

            {/* CHECKBOX ROW 2 */}
            {["is_programme_elective", "incl_credit", "approved", "is_maincode"].map((k) => (
              <Grid key={k} size={{ xs: 12, md: 3 }}>
                <Controller
                  name={k as keyof FormValues}
                  control={control}
                  render={({ field }) => {
                    let label = k.replace(/_/g, " ");
                    label = label.replace(/^is /i, "");
                    label = label.replace(/\b\w/g, l => l.toUpperCase());
                    return <CustomCheckboxInput label={label} field={field} />;
                  }}
                />
              </Grid>
            ))}

            {/* LAST ROW */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Controller name="specify_others" control={control} render={({ field }) => <CustomInputText label="Specify Others" field={field} />} />
            </Grid>

          </Grid>

          <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" onClick={handleBack}>
              Back
            </Button>

            <Button variant="outlined" onClick={() => reset(defaultValues)}>
              Reset
            </Button>

            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? <CircularProgress size={20} /> : id ? "Update" : "Save"}
            </Button>
          </Box>

        </CardComponent>
      </form>
    </Box>
  );
}
