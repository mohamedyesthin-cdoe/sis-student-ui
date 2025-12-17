// --- IMPORTS
import { useEffect, useState } from "react";
import { Box, Grid, Button, FormControl, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAlert } from "../../../context/AlertContext";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import dayjs from "dayjs";

import Customtext from "../../../components/inputs/customtext/Customtext";
import CustomInputText from "../../../components/inputs/customtext/CustomInputText";
import CustomSelect from "../../../components/inputs/customtext/CustomSelect";
import CustomRadioInput from "../../../components/inputs/customtext/CustomRadioInput";
import CustomDateInput from "../../../components/inputs/customtext/CustomDateInput";
import CardComponent from "../../../components/card/Card";
import { useLoader } from "../../../context/LoaderContext";
import { useGlobalError } from "../../../context/ErrorContext";
import FacultyFormSkeleton from "../../../components/card/skeletonloader/FacultyFormSkeleton";

// ==================================
// CONSTANTS
// ==================================
const employmentOptions = [
  { name: "Permanent", id: "Permanent" },
  { name: "Contract", id: "Contract" },
  { name: "Temporary", id: "Temporary" },
];

const genderOptions = [
  "Male",
  "Female",
  "Other"
];


// ==================================
// DEFAULT VALUES
// ==================================
const defaultValues = {
  employee_id: "",
  department: "CDOE",
  designation: "",
  qualification: "",
  specialization: "",
  joining_date: dayjs(),
  experience_years: 0,
  employment_type: "Permanent",
  research_area: "",
  publications_count: 0,
  gender: "Male",
  dob: null,
  linkedin_url: "",
  id: 0,
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  role: "", // role id
};

// ==================================
// VALIDATION SCHEMA
// ==================================
const schema = Yup.object().shape({
  employee_id: Yup.string().required("Employee ID is required"),
  first_name: Yup.string().required("First name required"),
  last_name: Yup.string().required("Last name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  phone: Yup.string().required("Phone required"),
  role: Yup.string().required("Role is required"),
  department: Yup.string().nullable(),
  designation: Yup.string().nullable(),
  qualification: Yup.string().nullable(),
  specialization: Yup.string().nullable(),
  joining_date: Yup.date().nullable(),
  experience_years: Yup.number().min(0),
  employment_type: Yup.string().nullable(),
  research_area: Yup.string().nullable(),
  publications_count: Yup.number().min(0),
  gender: Yup.string().nullable(),
  dob: Yup.date().nullable(),
  linkedin_url: Yup.string().url("Invalid URL").nullable(),
});

// ==================================
// COMPONENT
// ==================================
export default function FacultyAdd() {
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useAlert();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // id will be "1"
  const { loading } = useLoader();
  const { clearError } = useGlobalError();

  const [initialData, setInitialData] = useState<any>(null);
  const [roleOptions, setRoleOptions] = useState<any[]>([]);

  // ==================================
  // FETCH ROLES
  // ==================================
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest({ url: ApiRoutes.GETROLES, method: "get" });
        setRoleOptions(res); // res = [{id,name}, ...]
      } catch (err) {
        console.error("Failed to load roles", err);
      }
    })();
  }, []);

  // ==================================
  // FORM HOOK
  // ==================================
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // ==================================
  // FETCH FACULTY (EDIT MODE)
  // ==================================
  useEffect(() => {
    console.log("FacultyAdd useEffect triggered with id:", id);

    if (!id) {
      console.log("No faculty ID found in URL params");
      return;
    }

    console.log("Fetching faculty data for ID:", id);

    const fetchFaculty = async () => {
      try {
        const res = await apiRequest({ url: `${ApiRoutes.GETFACULTYBYID}/${id}`, method: "get" });
        console.log("Faculty API response:", res);

        const d = res?.data || res;

        const mapped: any = {
          employee_id: d.employee_id ?? "",
          department: d.department ?? "CDOE",
          designation: d.designation ?? "",
          qualification: d.qualification ?? "",
          specialization: d.specialization ?? "",
          joining_date: d.joining_date ? dayjs(d.joining_date) : dayjs(),
          experience_years: Number(d.experience_years ?? 0),
          employment_type: d.employment_type ?? "Permanent",
          research_area: d.research_area ?? "",
          publications_count: Number(d.publications_count ?? 0),
          gender: d.gender ?? "Male",
          dob: d.dob ? dayjs(d.dob) : null,
          linkedin_url: d.linkedin_url ?? "",
          id: d.id ?? id,
          first_name: d.first_name ?? "",
          last_name: d.last_name ?? "",
          email: d.email ?? "",
          phone: d.phone ?? "",
          role: d.role?.id ?? "",
        };

        setInitialData(mapped);
        reset(mapped);
      } catch (err) {
        console.error("Failed to fetch faculty by ID:", err);
        showAlert?.("Failed to load faculty data", "error");
      }
    };

    fetchFaculty();
  }, [id, reset]);


  // ==================================
  // HANDLERS
  // ==================================
  const handleBack = () => {
    if (isDirty) showConfirm("Unsaved changes will be lost. Continue?", () => navigate(-1));
    else navigate(-1);
  };

  const handleReset = () => {
    if (id && initialData) reset(initialData);
    else reset(defaultValues);
  };
  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        joining_date: formData.joining_date
          ? dayjs(formData.joining_date).format("YYYY-MM-DD")
          : null,
        dob: formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : null,
      };

      if (id) {
        await apiRequest({ url: `${ApiRoutes.FACULTYADD}/${id}`, method: "put", data: payload });
        showAlert("Faculty updated successfully", "success");
      } else {
        await apiRequest({ url: ApiRoutes.FACULTYADD, method: "post", data: payload });
        showAlert("Faculty created successfully", "success");
      }
      clearError();
      // Navigate to faculty list page after success
      navigate("/faculty"); // <-- replace with your actual faculty page route

    } catch (err: any) {
      showAlert(err?.response?.data?.message || "Save failed", "error");
    }
  };


  // ==================================
  // UI RETURN
  // ==================================
  return (
    <>
      {(
        loading ? (
          <FacultyFormSkeleton />
        ) : (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardComponent sx={{ p: 3 }}>
                  <Customtext fieldName="Profile & Account" sx={{ mb: 2 }} />

                  <Grid container spacing={3}>
                    {/* EMPLOYEE ID */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller name="employee_id" control={control} render={({ field }) => (
                        <CustomInputText label="Employee ID" field={field} error={!!errors.employee_id} helperText={errors.employee_id?.message} />
                      )} />
                    </Grid>

                    {/* FIRST NAME */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller name="first_name" control={control} render={({ field }) => (
                        <CustomInputText label="First Name" field={field} error={!!errors.first_name} helperText={errors.first_name?.message} />
                      )} />
                    </Grid>

                    {/* LAST NAME */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller name="last_name" control={control} render={({ field }) => (
                        <CustomInputText label="Last Name" field={field} error={!!errors.last_name} helperText={errors.last_name?.message} />
                      )} />
                    </Grid>

                    {/* EMAIL */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Email"
                            field={field}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>

                    {/* PHONE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Phone"
                            field={field}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                          />
                        )}
                      />
                    </Grid>

                    {/* ROLE - NEW DROPDOWN */}
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            label="Role"
                            field={field}
                            options={roleOptions}
                            error={!!errors.role}
                            helperText={errors.role?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Department"
                            field={field}
                            error={!!errors.department}
                            helperText={errors.department?.message}
                            disabled
                            // ensure the field shows the value from the controller
                            value={field.value ?? "CDOE"}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="designation"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Designation"
                            field={field}
                            error={!!errors.designation}
                            helperText={errors.designation?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="qualification"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Qualification"
                            field={field}
                            error={!!errors.qualification}
                            helperText={errors.qualification?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="specialization"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Specialization"
                            field={field}
                            error={!!errors.specialization}
                            helperText={errors.specialization?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="joining_date"
                        control={control}
                        render={({ field }) => (
                          // pass dayjs value explicitly to avoid label overlap issues
                          <CustomDateInput
                            label="Joining Date"
                            field={{
                              ...field,
                              value: field.value ? dayjs(field.value) : null,
                              onChange: (v: any) => field.onChange(v),
                            }}
                            error={!!errors.joining_date}
                            helperText={errors.joining_date?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="experience_years"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Experience (Years)"
                            field={field}
                            type="number"
                            error={!!errors.experience_years}
                            helperText={errors.experience_years?.message}
                            defaultValue={0}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="employment_type"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            label="Employment Type"
                            field={field}
                            options={employmentOptions}
                            error={errors.employment_type}
                            helperText={errors.employment_type?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="publications_count"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Publications Count"
                            field={field}
                            type="number"
                            error={!!errors.publications_count}
                            helperText={errors.publications_count?.message}
                            defaultValue={0}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }} display={"flex"} alignItems="center">
                      <FormControl component="fieldset">
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <CustomRadioInput
                              label="Gender  :"
                              field={field}
                              options={genderOptions}
                              error={!!errors.gender}
                              helperText={errors.gender?.message}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                          <CustomDateInput
                            label="Date of Birth"
                            field={{
                              ...field,
                              value: field.value ? dayjs(field.value) : null,
                              onChange: (v: any) => field.onChange(v),
                            }}
                            error={!!errors.dob}
                            helperText={errors.dob?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="research_area"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="Research Area"
                            field={field}
                            error={!!errors.research_area}
                            helperText={errors.research_area?.message}
                            multiline
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Controller
                        name="linkedin_url"
                        control={control}
                        render={({ field }) => (
                          <CustomInputText
                            label="LinkedIn URL"
                            field={field}
                            error={!!errors.linkedin_url}
                            helperText={errors.linkedin_url?.message}
                          />
                        )}
                      />
                    </Grid>

                  </Grid>

                  {/* Buttons */}
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
          </LocalizationProvider>
        ))}
    </>
  );
}
