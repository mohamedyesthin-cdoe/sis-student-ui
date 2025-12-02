import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Button,
  FormControl,
  CircularProgress,
} from "@mui/material";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAlert } from "../../../context/AlertContext";
import { useParams, useNavigate } from "react-router-dom";
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

const employmentOptions = ["Permanent", "Contract", "Temporary"];
const genderOptions = ["Male", "Female", "Other"];

// Use dayjs for date defaults so DatePickers get consistent values
const defaultValues = {
  employee_id: "",
  department: "CDOE", // default and disabled in UI
  designation: "",
  qualification: "",
  specialization: "",
  joining_date: dayjs(),
  experience_years: 0,
  employment_type: "Permanent",
  research_area: "",
  publications_count: 0,
  // status: "Active",
  gender: "Male",
  dob: null,
  // address: "",
  linkedin_url: "",
  id: 0,
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
};

const schema = Yup.object().shape({
  employee_id: Yup.string().required("Employee ID is required"),
  department: Yup.string().required(),
  designation: Yup.string().required("Designation is required"),
  qualification: Yup.string().required("Qualification is required"),
  specialization: Yup.string().required("Specialization is required"),
  joining_date: Yup.date().nullable().required("Joining date is required"),
  experience_years: Yup.number().min(0).required("Experience required"),
  employment_type: Yup.string().required("Select employment type"),
  research_area: Yup.string().nullable(),
  publications_count: Yup.number().min(0).required("Publication count required"),
  // status: Yup.string().required(),
  gender: Yup.string().required(),
  dob: Yup.date().nullable().required("DOB is required"),
  // address: Yup.string().required("Address is required"),
  linkedin_url: Yup.string().url("Invalid URL").nullable(),
  username: Yup.string().required("Username required"),
  first_name: Yup.string().required("First name required"),
  last_name: Yup.string().required("Last name required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  phone: Yup.string().required("Phone required"),
});

export default function FacultyAdd() {
  const navigate = useNavigate();
  const { showConfirm, showAlert } = useAlert();
  const { id } = useParams(); // if present => edit mode
  const { loading } = useLoader()
  const { error } = useGlobalError();
  const [initialData, setInitialData] = useState<any>(null); // store fetched for reset
  // const [avatarPreview, setAvatarPreview] = useState<string>("");
  // const fileInputRef: any = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  // const {
  //   control,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   setValue,
  //   formState: { errors, isDirty },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   defaultValues,
  // });

  // keep avatar preview synced if profile_photo changes
  // const watchedProfilePhoto = watch("profile_photo");
  // useEffect(() => {
  //   if (watchedProfilePhoto) setAvatarPreview(watchedProfilePhoto);
  // }, [watchedProfilePhoto]);

  // Fetch data if editing
  useEffect(() => {
    let mounted = true;
    if (!id) return;

    (async () => {
      try {
        const res = await apiRequest({ url: `${ApiRoutes.FACULTYADD}/${id}`, method: "get" });
        const data = res?.data || res;

        // map API fields to form fields — prefer dayjs for date fields
        const mapped: any = {
          employee_id: data.employee_id ?? data.employeeId ?? "",
          department: data.department ?? "CDOE",
          designation: data.designation ?? "",
          qualification: data.qualification ?? "",
          specialization: data.specialization ?? "",
          joining_date: data.joining_date ? dayjs(data.joining_date) : dayjs(),
          experience_years: Number(data.experience_years ?? 0),
          employment_type: data.employment_type ?? "Permanent",
          research_area: data.research_area ?? "",
          publications_count: Number(data.publications_count ?? 0),
          // status: data.status ?? "Active",
          gender: data.gender ?? "Male",
          dob: data.dob ? dayjs(data.dob) : null,
          // address: data.address ?? "",
          linkedin_url: data.linkedin_url ?? "",
          // profile_photo: data.profile_photo ?? "",
          id: data.id ?? id,
          username: data.username ?? "",
          first_name: data.first_name ?? data.firstName ?? "",
          last_name: data.last_name ?? data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        };

        if (!mounted) return;
        setInitialData(mapped);
        reset(mapped);
        // if (mapped.profile_photo) setAvatarPreview(mapped.profile_photo);
      } catch (err) {
        console.error("Failed to fetch faculty:", err);
        showAlert?.("Failed to load faculty data", "error");
      } finally {
        // if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, reset, showAlert]);

  // helper: convert file to base64
  // const fileToBase64 = (file: any) =>
  // new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   reader.onload = () => resolve(reader.result);
  //   reader.onerror = reject;
  //   reader.readAsDataURL(file);
  // });

  // avatar upload click
  // const handleAvatarClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleAvatarChange = async (e: any) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     const b64: any = await fileToBase64(file);
  //     setAvatarPreview(b64);

  //     // update form with proper options so RHF marks field dirty/touched
  //     setValue("profile_photo", b64, { shouldDirty: true, shouldTouch: true });
  //   } catch (err) {
  //     console.error("Avatar conversion failed", err);
  //     showAlert?.("Failed to read image file", "error");
  //   }
  // };

  // Back handler with unsaved check
  const handleBack = () => {
    if (isDirty) {
      showConfirm(
        "You have unsaved changes. Your changes will be lost if you continue.",
        () => navigate(-1),
        () => { }
      );
    } else {
      navigate(-1);
    }
  };

  const handleReset = () => {
    if (id && initialData) {
      // restore fetched
      reset(initialData);
      // setAvatarPreview(initialData.profile_photo || "");
      showAlert?.("Form restored to saved data", "info");
    } else {
      // reset to defaults
      reset(defaultValues);
      // setAvatarPreview("");
      showAlert?.("Form cleared", "info");
    }
  };

  // Submit handler
  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        faculty: {
          ...formData,
          joining_date: formData.joining_date ? dayjs(formData.joining_date).format("YYYY-MM-DD") : null,
          dob: formData.dob ? dayjs(formData.dob).format("YYYY-MM-DD") : null,
          experience_years: Number(formData.experience_years || 0),
          publications_count: Number(formData.publications_count || 0),
          // profile_photo: formData.profile_photo || avatarPreview || "",
        },
      };

      let res
      if (id) {
        res = await apiRequest({
          url: `${ApiRoutes.FACULTYADD}/${id}`,
          method: "put",
          data: payload,
        });
        showAlert("Faculty updated successfully", "success");
      } else {
        res = await apiRequest({
          url: ApiRoutes.FACULTYADD,
          method: "post",
          data: payload,
        });
        showAlert("Faculty created successfully", "success");
      }
      // optionally you might navigate or refresh list here
    } catch (err: any) {
      console.error("Save failed:", err);
      showAlert(err?.response?.data?.message || "Save failed", "error");
    } finally {
    }
  };

  // small UI helpers
  // const leftCard = (
  //   <Paper elevation={2} sx={{ p: 3, height: "100%", position: { md: "sticky" }, top: { md: 24 } }}>
  //     <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
  //       <Box sx={{ position: "relative" }}>
  //         <Avatar src={avatarPreview || ""} sx={{ width: 112, height: 112 }}>
  //           {/* {!avatarPreview && <EditIcon />} */}
  //         </Avatar>

  //         <input
  //           ref={fileInputRef}
  //           accept="image/*"
  //           style={{ display: "none" }}
  //           id="profile-photo"
  //           type="file"
  //           onChange={handleAvatarChange}
  //         />

  //         <IconButton
  //           color="primary"
  //           aria-label="upload picture"
  //           component="span"
  //           onClick={handleAvatarClick}
  //           sx={{
  //             position: "absolute",
  //             right: -6,
  //             bottom: -6,
  //             background: "white",
  //             border: "1px solid rgba(0,0,0,0.12)",
  //           }}
  //         >
  //           <PhotoCamera />
  //         </IconButton>
  //       </Box>

  //       <Typography variant="h6">{watch("first_name") || watch("username") || "New Faculty"}</Typography>
  //       <Typography variant="body2" color="text.secondary">
  //         {watch("designation") || "Designation"}
  //       </Typography>

  //       <Divider sx={{ width: "100%", my: 2 }} />

  //       <Box sx={{ width: "100%" }}>
  //         <Typography variant="subtitle2" sx={{ mb: 1 }}>
  //           Status
  //         </Typography>
  //         <Typography variant="body2">{watch("status")}</Typography>
  //       </Box>
  //     </Box>
  //   </Paper>
  // );

  return (
    <>
      {
        error.type === "NONE" && (
          loading ? (
            <ProgramFeeSkeleton />
          )
            : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {/* <Grid container > */}
                    {/* Left column - profile card */}
                    {/* <Grid size={{ xs: 12, md: 4 }}>{leftCard}</Grid> */}

                    {/* Right column - form */}
                    <CardComponent sx={{ p: 3 }}>
                      <Customtext
                        fieldName="Profile & Account"
                        sx={{
                          mb: 2,
                          fontSize: {
                            xs: "0.875rem", // 14px
                            sm: "1rem", // 16px
                            md: "1.125rem", // 18px
                            lg: "1rem", // 20px
                            xl: "1.5rem", // 24px
                          },
                        }}
                      />

                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <Controller
                            name="employee_id"
                            control={control}
                            render={({ field }) => (
                              <CustomInputText
                                label="Employee ID"
                                field={field}
                                error={!!errors.employee_id}
                                helperText={errors.employee_id?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                          <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                              <CustomInputText
                                label="Username"
                                field={field}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                          <Controller
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                              <CustomInputText
                                label="First Name"
                                field={field}
                                error={!!errors.first_name}
                                helperText={errors.first_name?.message}
                              />
                            )}
                          />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                          <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                              <CustomInputText
                                label="Last Name"
                                field={field}
                                error={!!errors.last_name}
                                helperText={errors.last_name?.message}
                              />
                            )}
                          />
                        </Grid>

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

                      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 4 }}>
                        <Button variant="contained" color="primary" onClick={handleBack}>
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
                    {/* </Grid> */}
                  </form>
                </Box>
              </LocalizationProvider>
            )
        )
      }
    </>
  );
}
