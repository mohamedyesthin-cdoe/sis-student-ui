// FacultyAdd.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    FormControlLabel,
    Checkbox,
    Typography,
    Avatar,
    IconButton,
    Paper,
    Divider,
    Radio,
    RadioGroup,
    FormControl,
    FormLabel,
    Stack,
    CircularProgress,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAlert } from "../../../context/AlertContext";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../../utils/ApiRequest";
import { ApiRoutes } from "../../../constants/ApiConstants";
import dayjs from "dayjs";
/*
  NOTE:
  - Ensure you have @mui/x-date-pickers and dayjs installed.
  - This component expects `apiRequest` and `ApiRoutes` to be present in your project.
*/

const employmentOptions = ["Permanent", "Contract", "Temporary"];
const statusOptions = ["Active", "Inactive"];
const genderOptions = ["Male", "Female", "Other"];

const defaultValues = {
    employee_id: "",
    department: "CDOE", // default and disabled in UI
    designation: "",
    qualification: "",
    specialization: "",
    joining_date: new Date(),
    experience_years: 0,
    employment_type: "Permanent",
    research_area: "",
    publications_count: 0,
    status: "Active",
    gender: "Male",
    dob: null as Date | null,
    address: "",
    linkedin_url: "",
    profile_photo: "", // base64 data url
    id: 0,
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    is_active: true,
    is_superuser: false as boolean,

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
    status: Yup.string().required(),
    gender: Yup.string().required(),
    dob: Yup.date().nullable().required("DOB is required"),
    address: Yup.string().required("Address is required"),
    linkedin_url: Yup.string().url("Invalid URL").nullable(),
    profile_photo: Yup.string().nullable(),
    username: Yup.string().required("Username required"),
    first_name: Yup.string().required("First name required"),
    last_name: Yup.string().required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    phone: Yup.string().required("Phone required"),
    is_active: Yup.boolean(),
    is_superuser: Yup.boolean(),
});

export default function FacultyAdd() {
    const navigate = useNavigate();
    const { showConfirm, showAlert } = useAlert();
    const { id } = useParams(); // if present => edit mode
    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null); // store fetched for reset
    const [avatarPreview, setAvatarPreview] = useState("");
    const fileInputRef: any = useRef(null);

    const {
        control,
        register,
        handleSubmit,
        reset,
        watch,
        setValue,  // ✔️ this is correct
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues,
    });

    // watch profile_photo to keep avatar preview in sync if user edits via other means
    const watchedProfilePhoto = watch("profile_photo");

    useEffect(() => {
        if (watchedProfilePhoto) setAvatarPreview(watchedProfilePhoto);
    }, [watchedProfilePhoto]);

    // Fetch data if editing
    useEffect(() => {
        let mounted = true;
        if (!id) return;

        (async () => {
            try {
                setLoading(true);
                const res = await apiRequest({ url: `${ApiRoutes.FACULTYADD}/${id}`, method: "get" });
                const data = res?.data || res;

                // map API fields to form fields — adjust keys if your API uses different names
                const mapped: any = {
                    employee_id: data.employee_id ?? data.employeeId ?? "",
                    department: data.department ?? "CDOE",
                    designation: data.designation ?? "",
                    qualification: data.qualification ?? "",
                    specialization: data.specialization ?? "",
                    joining_date: data.joining_date ? dayjs(data.joining_date).toDate() : null,
                    experience_years: Number(data.experience_years ?? 0),
                    employment_type: data.employment_type ?? "Permanent",
                    research_area: data.research_area ?? "",
                    publications_count: Number(data.publications_count ?? 0),
                    status: data.status ?? "Active",
                    gender: data.gender ?? "Male",
                    dob: data.dob ? dayjs(data.dob).toDate() : null,
                    address: data.address ?? "",
                    linkedin_url: data.linkedin_url ?? "",
                    profile_photo: data.profile_photo ?? "", // assume base64 or url
                    id: data.id ?? id,
                    username: data.username ?? "",
                    first_name: data.first_name ?? data.firstName ?? "",
                    last_name: data.last_name ?? data.lastName ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                    is_active: data.is_active ?? true,
                    is_superuser: data.is_superuser ?? false,
                };

                if (!mounted) return;
                setInitialData(mapped);
                reset(mapped);
                if (mapped.profile_photo) setAvatarPreview(mapped.profile_photo);
            } catch (err) {
                console.error("Failed to fetch faculty:", err);
                showAlert?.("Failed to load faculty data", "error");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id, reset, showAlert]);

    // helper: convert file to base64
    const fileToBase64 = (file: any) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    // avatar upload click
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const b64: any = await fileToBase64(file);
            setAvatarPreview(b64);

            // Correct update of react-hook-form value
            setValue("profile_photo", b64, { shouldDirty: true });

        } catch (err) {
            console.error("Avatar conversion failed", err);
            showAlert?.("Failed to read image file", "error");
        }
    };


    // Better approach: setValue to update single field without resetting form
    // but we chose reset approach for simplicity; if you prefer setValue import it and use:
    // setValue("profile_photo", b64, { shouldDirty: true });

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
            setAvatarPreview(initialData.profile_photo || "");
            showAlert?.("Form restored to saved data", "info");
        } else {
            // reset to defaults
            reset(defaultValues);
            setAvatarPreview("");
            showAlert?.("Form cleared", "info");
        }
    };

    // Submit handler
    const onSubmit = async (formData:any) => {
        try {
            setLoading(true);

            const payload = {
                faculty: {
                    ...formData,
                    joining_date: formData.joining_date
                        ? dayjs(formData.joining_date).format("YYYY-MM-DD")
                        : null,
                    dob: formData.dob
                        ? dayjs(formData.dob).format("YYYY-MM-DD")
                        : null,
                    experience_years: Number(formData.experience_years || 0),
                    publications_count: Number(formData.publications_count || 0),
                    profile_photo: formData.profile_photo || avatarPreview || "",
                }
            };

            let res;

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

        } catch (err) {
            console.error("Save failed:", err);
            showAlert(err?.response?.data?.message || "Save failed", "error");
        } finally {
            setLoading(false);
        }
    };


    // small UI helpers
    const leftCard = (
        <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Box sx={{ position: "relative" }}>
                    <Avatar
                        src={avatarPreview || ""}
                        sx={{ width: 112, height: 112 }}
                    >
                        {!avatarPreview && <EditIcon />}
                    </Avatar>

                    <input
                        ref={fileInputRef}
                        accept="image/*"
                        style={{ display: "none" }}
                        id="profile-photo"
                        type="file"
                        onChange={handleAvatarChange}
                    />

                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={handleAvatarClick}
                        sx={{
                            position: "absolute",
                            right: -6,
                            bottom: -6,
                            background: "white",
                            border: "1px solid rgba(0,0,0,0.12)",
                        }}
                    >
                        <PhotoCamera />
                    </IconButton>
                </Box>

                <Typography variant="h6">
                    {watch("first_name") || watch("username") || "New Faculty"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {watch("designation") || "Designation"}
                </Typography>

                <Divider sx={{ width: "100%", my: 2 }} />

                <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Status</Typography>
                    <Typography variant="body2">{watch("status")}</Typography>
                </Box>
            </Box>
        </Paper>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {/* Left column - profile card */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            {leftCard}
                        </Grid>

                        {/* Right column - form */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Paper elevation={2} sx={{ p: 3 }}>
                                <Stack spacing={2}>
                                    <Typography variant="h6">Profile & Account</Typography>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Employee ID"
                                                fullWidth
                                                {...register("employee_id")}
                                                error={!!errors.employee_id}
                                                helperText={errors.employee_id?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Username"
                                                fullWidth
                                                {...register("username")}
                                                error={!!errors.username}
                                                helperText={errors.username?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="First Name"
                                                fullWidth
                                                {...register("first_name")}
                                                error={!!errors.first_name}
                                                helperText={errors.first_name?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Last Name"
                                                fullWidth
                                                {...register("last_name")}
                                                error={!!errors.last_name}
                                                helperText={errors.last_name?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Email"
                                                fullWidth
                                                {...register("email")}
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Phone"
                                                fullWidth
                                                {...register("phone")}
                                                error={!!errors.phone}
                                                helperText={errors.phone?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Department"
                                                fullWidth
                                                disabled
                                                defaultValue="CDOE"
                                                {...register("department")}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Designation"
                                                fullWidth
                                                {...register("designation")}
                                                error={!!errors.designation}
                                                helperText={errors.designation?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Qualification"
                                                fullWidth
                                                {...register("qualification")}
                                                error={!!errors.qualification}
                                                helperText={errors.qualification?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Specialization"
                                                fullWidth
                                                {...register("specialization")}
                                                error={!!errors.specialization}
                                                helperText={errors.specialization?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="joining_date"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        label="Joining Date"
                                                        {...field}
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(val: any) => field.onChange(val ? val.toDate() : null)}
                                                        slotProps={{
                                                            textField: { fullWidth: true, error: !!errors.joining_date, helperText: errors.joining_date?.message },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="experience_years"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Experience (Years)"
                                                        type="number"
                                                        inputMode="numeric"
                                                        fullWidth
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        error={!!errors.experience_years}
                                                        helperText={errors.experience_years?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="employment_type"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField {...field} select label="Employment Type" fullWidth error={!!errors.employment_type} helperText={errors.employment_type?.message}>
                                                        {employmentOptions.map((opt) => (
                                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="publications_count"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Publications Count"
                                                        type="number"
                                                        fullWidth
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                        error={!!errors.publications_count}
                                                        helperText={errors.publications_count?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                label="Research Area"
                                                fullWidth
                                                {...register("research_area")}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Gender</FormLabel>
                                                <Controller
                                                    name="gender"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <RadioGroup row {...field}>
                                                            {genderOptions.map((g) => (
                                                                <FormControlLabel key={g} value={g} control={<Radio />} label={g} />
                                                            ))}
                                                        </RadioGroup>
                                                    )}
                                                />
                                            </FormControl>
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Controller
                                                name="dob"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        label="Date of Birth"
                                                        {...field}
                                                        value={field.value ? dayjs(field.value) : null}
                                                        onChange={(val: any) => field.onChange(val ? val.toDate() : null)}
                                                        slotProps={{
                                                            textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob?.message },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                label="Address"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                {...register("address")}
                                                error={!!errors.address}
                                                helperText={errors.address?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                label="LinkedIn URL"
                                                fullWidth
                                                {...register("linkedin_url")}
                                                error={!!errors.linkedin_url}
                                                helperText={errors.linkedin_url?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControlLabel
                                                control={<Controller name="is_active" control={control} render={({ field }) => <Checkbox {...field} checked={!!field.value} />} />}
                                                label="Is Active"
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControlLabel
                                                control={<Controller name="is_superuser" control={control} render={({ field }) => <Checkbox {...field} checked={!!field.value} />} />}
                                                label="Is Supervisor"
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                        <Button variant="contained" color="primary" onClick={handleBack}>Back</Button>
                                        <Button variant="outlined" color="error" onClick={handleReset}>Reset</Button>
                                        <Button type="submit" variant="contained" color="secondary" disabled={loading}>
                                            {loading ? <CircularProgress size={20} /> : id ? "Update" : "Submit"}
                                        </Button>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </LocalizationProvider>
    );
}
